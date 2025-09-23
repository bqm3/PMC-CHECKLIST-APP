import * as SQLite from 'expo-sqlite';

class SQLiteDataManager {
  constructor() {
    this.db = null;
    this.CHUNK_SIZE = 500000; // 500KB mỗi chunk để tránh lỗi
    this.MAX_CHUNKS = 10;
    this.isInitialized = false;
  }

  // Khởi tạo database
  async initDatabase() {
    if (this.isInitialized) return;

    try {
      this.db = await SQLite.openDatabaseAsync('checklist_data.db');
      
      // Tạo bảng chính để lưu data
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

      // Tạo bảng để lưu chunks
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

      // Tạo index để tăng performance
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

  // Cleanup old data - giữ lại chỉ 5 records gần nhất
  async cleanupOldData() {
    try {
      // Lấy danh sách các checklist_id cũ (giữ lại 5 gần nhất)
      const oldRecords = await this.db.getAllAsync(`
        SELECT checklist_id 
        FROM checklist_data 
        ORDER BY updated_at DESC 
        LIMIT -1 OFFSET 5
      `);

      if (oldRecords.length > 0) {
        const oldIds = oldRecords.map(row => `'${row.checklist_id}'`).join(',');
        
        // Xóa chunks cũ
        await this.db.runAsync(`DELETE FROM data_chunks WHERE checklist_id IN (${oldIds})`);
        
        // Xóa main records cũ
        await this.db.runAsync(`DELETE FROM checklist_data WHERE checklist_id IN (${oldIds})`);
        
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

      // Ước tính kích thước
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
      
      if (chunkSizes.length > 0) {
        console.log('🔝 Top 5 largest chunks:');
        chunkSizes.slice(0, 5).forEach((chunk, index) => {
          console.log(`${index + 1}. ${chunk.checklist_id}: ${(chunk.size / 1024).toFixed(2)} KB`);
        });
      }

      return { total_records: result.total_records, total_chunks: result.total_chunks, totalSize };
      
    } catch (error) {
      console.error('Error checking database size:', error);
      return null;
    }
  }

  // Lưu data
  async saveData(checklistId, data) {
    try {
      await this.initDatabase();
      
      // Cleanup trước khi lưu
      await this.cleanupOldData();
      
      const dataString = JSON.stringify(data);
      console.log(`💾 Saving data for ${checklistId}: ${(dataString.length / 1024).toFixed(2)} KB`);

      // Kiểm tra kích thước data
      if (dataString.length > this.CHUNK_SIZE * this.MAX_CHUNKS) {
        throw new Error(`Data too large: ${(dataString.length / 1024 / 1024).toFixed(2)}MB (max: ${(this.CHUNK_SIZE * this.MAX_CHUNKS / 1024 / 1024).toFixed(2)}MB)`);
      }

      // Bắt đầu transaction
      await this.db.runAsync('BEGIN TRANSACTION');

      try {
        // Xóa data cũ nếu có
        await this.deleteData(checklistId, false); // false = không commit transaction

        if (dataString.length > this.CHUNK_SIZE) {
          // Lưu dạng chunks
          await this.saveChunkedData(checklistId, dataString);
        } else {
          // Lưu dạng single chunk
          await this.saveSingleData(checklistId, dataString);
        }

        // Commit transaction
        await this.db.runAsync('COMMIT');
        console.log('✅ Data saved successfully');

      } catch (error) {
        // Rollback nếu có lỗi
        await this.db.runAsync('ROLLBACK');
        throw error;
      }

    } catch (error) {
      console.error("❌ Error saving data:", error);
      
      // Xử lý lỗi SQLITE_FULL
      if (error.message.includes('database or disk is full') || error.message.includes('SQLITE_FULL')) {
        console.log('💾 Database full - attempting emergency cleanup...');
        await this.emergencyCleanup();
        throw new Error('Database full - please try again after cleanup');
      }
      
      throw error;
    }
  }

  // Lưu data đơn
  async saveSingleData(checklistId, dataString) {
    // Insert main record
    await this.db.runAsync(`
      INSERT OR REPLACE INTO checklist_data 
      (checklist_id, data_type, chunk_count, updated_at) 
      VALUES (?, 'single', 1, CURRENT_TIMESTAMP)
    `, [checklistId]);

    // Insert single chunk
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

    // Insert main record
    await this.db.runAsync(`
      INSERT OR REPLACE INTO checklist_data 
      (checklist_id, data_type, chunk_count, updated_at) 
      VALUES (?, 'chunked', ?, CURRENT_TIMESTAMP)
    `, [checklistId, chunks.length]);

    // Insert chunks
    for (let i = 0; i < chunks.length; i++) {
      await this.db.runAsync(`
        INSERT OR REPLACE INTO data_chunks 
        (checklist_id, chunk_index, chunk_data) 
        VALUES (?, ?, ?)
      `, [checklistId, i, chunks[i]]);
    }
  }

  // Đọc data
  async loadData(checklistId) {
    try {
      await this.initDatabase();

      // Lấy thông tin main record
      const mainRecord = await this.db.getFirstAsync(`
        SELECT data_type, chunk_count 
        FROM checklist_data 
        WHERE checklist_id = ?
      `, [checklistId]);

      if (!mainRecord) {
        console.log(`📭 No data found for ${checklistId}`);
        return null;
      }

      // Lấy các chunks
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

      // Kiểm tra tính toàn vẹn
      if (chunks.length !== mainRecord.chunk_count) {
        console.warn(`⚠️ Chunk count mismatch for ${checklistId}: expected ${mainRecord.chunk_count}, found ${chunks.length}`);
      }

      // Ghép dữ liệu
      const dataString = chunks.map(chunk => chunk.chunk_data).join('');
      const data = JSON.parse(dataString);

      console.log(`📖 Loaded data for ${checklistId}: ${(dataString.length / 1024).toFixed(2)} KB`);
      return data;

    } catch (error) {
      console.error("❌ Error loading data:", error);
      return null;
    }
  }

  // Xóa data
  async deleteData(checklistId, shouldCommit = true) {
    try {
      if (shouldCommit) {
        await this.db.runAsync('BEGIN TRANSACTION');
      }

      // Xóa chunks
      await this.db.runAsync(`DELETE FROM data_chunks WHERE checklist_id = ?`, [checklistId]);
      
      // Xóa main record
      await this.db.runAsync(`DELETE FROM checklist_data WHERE checklist_id = ?`, [checklistId]);

      if (shouldCommit) {
        await this.db.runAsync('COMMIT');
        console.log(`🗑️ Deleted data for ${checklistId}`);
      }

    } catch (error) {
      if (shouldCommit) {
        await this.db.runAsync('ROLLBACK');
      }
      console.error(`Error deleting data for ${checklistId}:`, error);
      throw error;
    }
  }

  // Emergency cleanup - xóa tất cả trừ record gần nhất
  async emergencyCleanup() {
    try {
      console.log('🚨 Emergency cleanup started...');

      // Giữ lại chỉ 1 record gần nhất
      const keepRecord = await this.db.getFirstAsync(`
        SELECT checklist_id 
        FROM checklist_data 
        ORDER BY updated_at DESC 
        LIMIT 1
      `);

      if (keepRecord) {
        // Xóa tất cả trừ record này
        await this.db.runAsync(`
          DELETE FROM data_chunks 
          WHERE checklist_id != ?
        `, [keepRecord.checklist_id]);
        
        await this.db.runAsync(`
          DELETE FROM checklist_data 
          WHERE checklist_id != ?
        `, [keepRecord.checklist_id]);
      } else {
        // Xóa tất cả
        await this.db.runAsync(`DELETE FROM data_chunks`);
        await this.db.runAsync(`DELETE FROM checklist_data`);
      }

      // Vacuum để giải phóng không gian
      await this.db.runAsync('VACUUM');
      
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

export default sqliteManager;