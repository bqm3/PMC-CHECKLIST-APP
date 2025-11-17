import * as SQLite from 'expo-sqlite';

class SQLiteDataManager {
  constructor() {
    this.db = null;
    this.CHUNK_SIZE = 500000; // 500KB mỗi chunk
    this.MAX_CHUNKS = 10;
    this.isInitialized = false;
    this.operationQueue = Promise.resolve(); // ✅ Thêm queue
  }

  // ✅ Queue để tránh race condition
  async queueOperation(operation) {
    this.operationQueue = this.operationQueue
      .then(operation)
      .catch((error) => {
        console.error('Queue operation error:', error);
        throw error;
      });
    return this.operationQueue;
  }

  // Khởi tạo database
  async initDatabase() {
    if (this.isInitialized) return;

    try {
      this.db = await SQLite.openDatabaseAsync('checklist_data.db');
      
      // Tạo bảng chính
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS checklist_data (
          id INTEGER PRIMARY KEY,
          checklist_id TEXT UNIQUE,
          data_type TEXT DEFAULT 'single',
          chunk_count INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Tạo bảng chunks
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS data_chunks (
          id INTEGER PRIMARY KEY,
          checklist_id TEXT,
          chunk_index INTEGER,
          chunk_data TEXT,
          FOREIGN KEY (checklist_id) REFERENCES checklist_data (checklist_id),
          UNIQUE(checklist_id, chunk_index)
        );
      `);

      // Tạo index
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_checklist_id ON data_chunks(checklist_id);
        CREATE INDEX IF NOT EXISTS idx_chunk_index ON data_chunks(checklist_id, chunk_index);
      `);

      this.isInitialized = true;
      console.log('✅ SQLite Database initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      throw error;
    }
  }

  // Cleanup old data
  async cleanupOldData() {
    try {
      const oldRecords = await this.db.getAllAsync(`
        SELECT checklist_id 
        FROM checklist_data 
        ORDER BY updated_at DESC 
        LIMIT -1 OFFSET 5
      `);

      if (oldRecords.length > 0) {
        for (const record of oldRecords) {
          await this.db.runAsync(`DELETE FROM data_chunks WHERE checklist_id = ?`, [record.checklist_id]);
          await this.db.runAsync(`DELETE FROM checklist_data WHERE checklist_id = ?`, [record.checklist_id]);
        }
        console.log(`🗑️ Cleaned up ${oldRecords.length} old records`);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Kiểm tra kích thước database
  async checkDatabaseSize() {
    try {
      const result = await this.db.getFirstAsync(`
        SELECT 
          COUNT(*) as total_records,
          (SELECT COUNT(*) FROM data_chunks) as total_chunks
        FROM checklist_data
      `);

      const chunkSizes = await this.db.getAllAsync(`
        SELECT checklist_id, LENGTH(chunk_data) as size 
        FROM data_chunks 
        ORDER BY size DESC 
        LIMIT 10
      `);

      const totalSize = chunkSizes.reduce((sum, chunk) => sum + chunk.size, 0);
      
      console.log('=== SQLite DATABASE INFO ===');
      console.log(`📦 Total Records: ${result.total_records}`);
      console.log(`🧩 Total Chunks: ${result.total_chunks}`);
      console.log(`📊 Estimated Size: ${(totalSize / 1024).toFixed(2)} KB`);

      return { total_records: result.total_records, total_chunks: result.total_chunks, totalSize };
      
    } catch (error) {
      console.error('Error checking database size:', error);
      return null;
    }
  }

  // ✅ FIX: Lưu data với queue và transaction đúng cách
  async saveData(checklistId, data) {
    return this.queueOperation(async () => {
      try {
        await this.initDatabase();
        await this.cleanupOldData();
        
        const dataString = JSON.stringify(data);
        console.log(`💾 Saving data for ${checklistId}: ${(dataString.length / 1024).toFixed(2)} KB`);

        if (dataString.length > this.CHUNK_SIZE * this.MAX_CHUNKS) {
          throw new Error(`Data too large: ${(dataString.length / 1024 / 1024).toFixed(2)}MB`);
        }

        // ✅ Transaction đúng cách
        try {
          // Xóa data cũ trước (KHÔNG dùng transaction riêng)
          await this.db.runAsync(`DELETE FROM data_chunks WHERE checklist_id = ?`, [checklistId]);
          await this.db.runAsync(`DELETE FROM checklist_data WHERE checklist_id = ?`, [checklistId]);

          // Lưu data mới
          if (dataString.length > this.CHUNK_SIZE) {
            await this.saveChunkedData(checklistId, dataString);
          } else {
            await this.saveSingleData(checklistId, dataString);
          }

          console.log('✅ Data saved successfully');

        } catch (error) {
          throw error;
        }

      } catch (error) {
        console.error("❌ Error saving data:", error);
        
        if (error.message.includes('database or disk is full') || error.message.includes('SQLITE_FULL')) {
          console.log('💾 Database full - attempting emergency cleanup...');
          await this.emergencyCleanup();
          throw new Error('Database full - please try again after cleanup');
        }
        
        throw error;
      }
    });
  }

  // Lưu data đơn
  async saveSingleData(checklistId, dataString) {
    await this.db.runAsync(`
      INSERT OR REPLACE INTO checklist_data 
      (checklist_id, data_type, chunk_count, updated_at) 
      VALUES (?, 'single', 1, CURRENT_TIMESTAMP)
    `, [checklistId]);

    await this.db.runAsync(`
      INSERT OR REPLACE INTO data_chunks 
      (checklist_id, chunk_index, chunk_data) 
      VALUES (?, 0, ?)
    `, [checklistId, dataString]);
  }

  // Lưu data dạng chunks
  async saveChunkedData(checklistId, dataString) {
    const chunks = [];
    for (let i = 0; i < dataString.length; i += this.CHUNK_SIZE) {
      chunks.push(dataString.slice(i, i + this.CHUNK_SIZE));
    }

    console.log(`📦 Splitting into ${chunks.length} chunks`);

    await this.db.runAsync(`
      INSERT OR REPLACE INTO checklist_data 
      (checklist_id, data_type, chunk_count, updated_at) 
      VALUES (?, 'chunked', ?, CURRENT_TIMESTAMP)
    `, [checklistId, chunks.length]);

    for (let i = 0; i < chunks.length; i++) {
      await this.db.runAsync(`
        INSERT OR REPLACE INTO data_chunks 
        (checklist_id, chunk_index, chunk_data) 
        VALUES (?, ?, ?)
      `, [checklistId, i, chunks[i]]);
    }
  }

  // ✅ FIX: Đọc data với queue
  async loadData(checklistId) {
    return this.queueOperation(async () => {
      try {
        await this.initDatabase();

        const mainRecord = await this.db.getFirstAsync(`
          SELECT data_type, chunk_count 
          FROM checklist_data 
          WHERE checklist_id = ?
        `, [checklistId]);

        if (!mainRecord) {
          console.log(`📭 No data found for ${checklistId}`);
          return null;
        }

        const chunks = await this.db.getAllAsync(`
          SELECT chunk_data 
          FROM data_chunks 
          WHERE checklist_id = ? 
          ORDER BY chunk_index ASC
        `, [checklistId]);

        if (chunks.length === 0) {
          console.log(`📭 No chunks found for ${checklistId}`);
          return null;
        }

        if (chunks.length !== mainRecord.chunk_count) {
          console.warn(`⚠️ Chunk count mismatch for ${checklistId}: expected ${mainRecord.chunk_count}, found ${chunks.length}`);
        }

        const dataString = chunks.map(chunk => chunk.chunk_data).join('');
        const data = JSON.parse(dataString);

        console.log(`📖 Loaded data for ${checklistId}: ${(dataString.length / 1024).toFixed(2)} KB`);
        return data;

      } catch (error) {
        console.error("❌ Error loading data:", error);
        return null;
      }
    });
  }

  // ✅ FIX: Xóa data đơn giản hơn (bỏ transaction phức tạp)
  async deleteData(checklistId) {
    return this.queueOperation(async () => {
      try {
        await this.initDatabase();
        
        await this.db.runAsync(`DELETE FROM data_chunks WHERE checklist_id = ?`, [checklistId]);
        await this.db.runAsync(`DELETE FROM checklist_data WHERE checklist_id = ?`, [checklistId]);

        console.log(`🗑️ Deleted data for ${checklistId}`);

      } catch (error) {
        console.error(`Error deleting data for ${checklistId}:`, error);
        throw error;
      }
    });
  }

  // Emergency cleanup
  async emergencyCleanup() {
    try {
      console.log('🚨 Emergency cleanup started...');

      const keepRecord = await this.db.getFirstAsync(`
        SELECT checklist_id 
        FROM checklist_data 
        ORDER BY updated_at DESC 
        LIMIT 1
      `);

      if (keepRecord) {
        await this.db.runAsync(`DELETE FROM data_chunks WHERE checklist_id != ?`, [keepRecord.checklist_id]);
        await this.db.runAsync(`DELETE FROM checklist_data WHERE checklist_id != ?`, [keepRecord.checklist_id]);
      } else {
        await this.db.runAsync(`DELETE FROM data_chunks`);
        await this.db.runAsync(`DELETE FROM checklist_data`);
      }

      await this.db.execAsync('VACUUM');
      console.log('🚨 Emergency cleanup completed');
      
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
    }
  }

  // Lấy danh sách tất cả checklist IDs
  async getAllChecklistIds() {
    try {
      await this.initDatabase();
      
      const records = await this.db.getAllAsync(`
        SELECT checklist_id, updated_at, chunk_count
        FROM checklist_data 
        ORDER BY updated_at DESC
      `);

      return records;
      
    } catch (error) {
      console.error('Error getting checklist IDs:', error);
      return [];
    }
  }

  // Xóa tất cả data
  async deleteAllData() {
    return this.queueOperation(async () => {
      try {
        await this.initDatabase();
        
        console.log('🗑️ Deleting all data from database...');
        
        const chunksDeleted = await this.db.runAsync(`DELETE FROM data_chunks`);
        const recordsDeleted = await this.db.runAsync(`DELETE FROM checklist_data`);
        
        await this.db.execAsync('VACUUM');
        
        console.log(`✅ Successfully deleted all data:`);
        console.log(`   - Records deleted: ${recordsDeleted.changes}`);
        console.log(`   - Chunks deleted: ${chunksDeleted.changes}`);
        
        return {
          success: true,
          recordsDeleted: recordsDeleted.changes,
          chunksDeleted: chunksDeleted.changes
        };

      } catch (error) {
        console.error('❌ Error deleting all data:', error);
        throw error;
      }
    });
  }
}

// Export instance và functions
const sqliteManager = new SQLiteDataManager();

export const saveData = async (checklistId, data) => {
  return await sqliteManager.saveData(checklistId, data);
};

export const loadData = async (checklistId) => {
  return await sqliteManager.loadData(checklistId);
};

export const deleteData = async (checklistId) => {
  return await sqliteManager.deleteData(checklistId);
};

export const checkDatabaseSize = async () => {
  return await sqliteManager.checkDatabaseSize();
};

export const cleanupDatabase = async () => {
  return await sqliteManager.cleanupOldData();
};

export const emergencyCleanup = async () => {
  return await sqliteManager.emergencyCleanup();
};

export const getAllChecklistIds = async () => {
  return await sqliteManager.getAllChecklistIds();
};

export const deleteAllData = async () => {
  return await sqliteManager.deleteAllData();
}

export default sqliteManager;