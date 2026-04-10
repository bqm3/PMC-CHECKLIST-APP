import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, ActivityIndicator, Modal, Alert } from "react-native";
import { useSelector } from "react-redux";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { bt_thongtinchung_API, bt_chitiettb_API, tansuatAPI, hanhdongAPI } from "./api";
import moment from "moment";
import { useLoading } from "../../context/LoadingContext";
import QRCodeScreen from "../QRCodeScreen";
import { Camera } from "expo-camera";

const ChiTietPhieuBaotriScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { authToken } = useSelector((state) => state.authReducer);
  const { setIsLoading } = useLoading();
  const [data, setData] = useState(null);
  
  // QR Scan states
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isScan, setIsScan] = useState(false);
  
  const [tansuatList, setTansuatList] = useState([]);
  const [hanhdongList, setHanhdongList] = useState([]);

  useEffect(() => {
    fetchDetail();
    fetchMasterData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Kiểm tra xem có hạng mục nào đã ghi kết quả/ảnh mà chưa đồng bộ không
      let hasUnsavedChanges = false;
      if (data && data.bt_dsthietbict) {
          for (const device of data.bt_dsthietbict) {
              if (device.bt_chitiettb) {
                  const unsaved = device.bt_chitiettb.find(t => t.ket_qua && t.ket_qua.trim() !== "" && !t.hoan_thanh);
                  if (unsaved) {
                      hasUnsavedChanges = true;
                      break;
                  }
              }
          }
      }

      if (!hasUnsavedChanges) {
        return;
      }

      // Ngăn chặn việc thoát màn hình ngay lập tức
      e.preventDefault();

      // Hiển thị thông báo xác nhận
      Alert.alert(
        'Cảnh báo dữ liệu',
        'Bạn có các hạng mục đã ghi kết quả nhưng chưa được đồng bộ lên hệ thống. Nếu thoát ra, các thay đổi này sẽ bị xóa bỏ hoàn toàn.',
        [
          { text: 'Tiếp tục làm việc', style: 'cancel', onPress: () => {} },
          {
            text: 'Thoát và Xóa',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, data]);

  const fetchMasterData = async () => {
    try {
        const [tsRes, hdRes] = await Promise.all([
            tansuatAPI.getList(authToken),
            hanhdongAPI.getList(authToken)
        ]);
        setTansuatList(tsRes.data || []);
        setHanhdongList(hdRes.data || []);
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
    }
  };

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const response = await bt_thongtinchung_API.getById(authToken, id);
      setData(response.data.data || null);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phiếu bảo trì:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenQrCode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setModalVisibleQr(true);
      setOpacity(0.2);
    } else {
      Alert.alert("Thông báo", "Vui lòng cấp quyền truy cập camera để quét mã QR.");
    }
  };

  const updateDeviceTasks = (id_dsthietbict, updatedTasks, is_scan_qr = 0) => {
    setData(prevData => {
      if (!prevData) return prevData;
      const newDsThietbi = prevData.bt_dsthietbict.map(dev => {
        if (dev.id_dsthietbict === id_dsthietbict) {
          const currentScan = dev.qr_code_scan === 1 ? 1 : is_scan_qr;
          return { ...dev, bt_chitiettb: updatedTasks, qr_code_scan: currentScan };
        }
        return dev;
      });
      return { ...prevData, bt_dsthietbict: newDsThietbi };
    });
  };

  const handleSyncAll = async () => {
    if (!data || !data.bt_dsthietbict) return;
    try {
      let allFinishedTasks = [];
      data.bt_dsthietbict.forEach(device => {
         if (device.bt_chitiettb) {
             const finished = device.bt_chitiettb.filter(t => t.ket_qua && t.ket_qua.trim() !== "" && !t.hoan_thanh);
             finished.forEach(t => {
                 allFinishedTasks.push({
                     ...t,
                     parent_id_dsthietbict: device.id_dsthietbict,
                     parent_qr_code: device.qr_code_scan || 0
                 });
             });
         }
      });

      if (allFinishedTasks.length === 0) {
          Alert.alert("Thông báo", "Chưa có kết quả nào được lưu để gửi lên hệ thống.");
          return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("id_thongtinchung", id); // Gửi thêm id_thongtinchung
      allFinishedTasks.forEach((item, index) => {
          formData.append(`id_chitiettb[${index}]`, item.id_chitiettb);
          formData.append(`ket_qua[${index}]`, item.ket_qua || "");
          formData.append(`tinh_trang[${index}]`, item.tinh_trang || "Bình thường");
          formData.append(`ghi_chu[${index}]`, item.ghi_chu || "");
          formData.append(`thoi_gian_thuc_hien[${index}]`, item.thoi_gian_thuc_hien);
          formData.append(`vi_do[${index}]`, item.vi_do || "");
          formData.append(`kinh_do[${index}]`, item.kinh_do || "");
          formData.append(`do_cao[${index}]`, item.do_cao || "");
          formData.append(`qr_code[${index}]`, item.parent_qr_code || 0);
          
          if (item.images && item.images.length > 0) {
              item.images.forEach((img, imgIdx) => {
                  formData.append(`images_${index}_${imgIdx}`, {
                      uri: img.uri,
                      name: `task_${item.id_chitiettb}_${imgIdx}.jpg`,
                      type: "image/jpeg",
                  });
              });
          }
      });

      console.log("formData ready to send");

      await bt_chitiettb_API.updateTask(authToken, formData);
      Alert.alert("Thành công", "Đã đồng bộ tất cả kết quả bảo trì lên hệ thống!");
      fetchDetail();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể đồng bộ dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushDataFilterQr = (value) => {
    const cleanedValue = value.trim();
    // Tìm thiết bị trong phiếu có mã QR tương ứng
    const foundDevice = data?.bt_dsthietbict?.find(item => 
        item.bt_thietbida?.qr_code === cleanedValue
    );

    if (foundDevice) {
        setModalVisibleQr(false);
        setOpacity(1);
        navigation.navigate("thuc_hien_bt_thiet_bi", { 
            deviceData: foundDevice,
            phieuId: id,
            isScanQr: 1,
            tansuatList,
            hanhdongList,
            onUpdate: (updatedTasks) => updateDeviceTasks(foundDevice.id_dsthietbict, updatedTasks, 1) // 1 because QR scanned
        });
    } else {
        Alert.alert("Thông báo", `Mã QR "${cleanedValue}" không thuộc danh sách thiết bị của phiếu bảo trì này.`);
    }
  };

  const renderItem = ({ item }) => {
    const device = item.bt_thietbida;
    const tasks = item.bt_chitiettb || [];
    const serverCount = tasks.filter(t => t?.hoan_thanh === 1).length;
    const localCount = tasks.filter(t => t?.ket_qua && t?.ket_qua.trim() !== "" && !t?.hoan_thanh).length;
    const progress = tasks.length > 0 ? (serverCount / tasks.length) * 100 : 0;

    return (
      <TouchableOpacity 
        style={styles.deviceCard}
        onPress={() => navigation.navigate("thuc_hien_bt_thiet_bi", { 
            deviceData: item,
            phieuId: id,
            isScanQr: 0,
            tansuatList,
            hanhdongList,
            onUpdate: (updatedTasks) => updateDeviceTasks(item.id_dsthietbict, updatedTasks, 0) // 0 because manual selection
        })}
      >
        <View style={styles.deviceHeader}>
          <View style={styles.deviceMainInfo}>
            <Text style={styles.deviceName}>{device?.ten_thietbi_da}</Text>
            <Text style={styles.devicePos}>Vị trí: {device?.vi_tri_lap_dat || "---"}</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.deviceCode}>{device?.bt_dmthietbi?.ma_thietbi || device?.serial_number}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Tiến độ: {serverCount}/{tasks.length}</Text>
                {localCount > 0 && (
                    <Text style={[styles.progressValue, { color: '#f59e0b', fontSize: adjust(12) }]}>
                        (Đã check tạm: {localCount})
                    </Text>
                )}
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: progress === 100 ? '#22c55e' : '#3b82f6' }]} />
            </View>
        </View>

        {/* <View style={styles.deviceFooter}>
            <View style={styles.statusBox}>
                <View style={[styles.statusDot, { backgroundColor: item.trang_thai === 'DONE' ? '#22c55e' : '#f59e0b' }]} />
                <Text style={styles.statusText}>{item.trang_thai === 'DONE' ? 'Hoàn thành' : 'Đang thực hiện'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </View> */}
      </TouchableOpacity>
    );
  };

  if (!data) return null;

  return (
    <ImageBackground
      source={require("../../../assets/bg_new.png")}
      resizeMode="stretch"
      style={styles.background}
    >
      <View style={[styles.container, { opacity }]}>
        <FlatList
          data={data.bt_dsthietbict || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_dsthietbict.toString()}
          ListHeaderComponent={() => (
            <View style={styles.headerCard}>
                <View style={styles.titleRow}>
                    <Text style={styles.phieuName}>{data.ten_phieu}</Text>
                    <Text style={styles.dateText}>{moment(data.ngay_bt).format("DD/MM/YYYY")}</Text>
                </View>
                {data.ghi_chu && (
                    <View style={styles.noteBox}>
                        <Text style={styles.noteLabel}>Ghi chú: </Text>
                        <Text style={styles.noteValue}>{data.ghi_chu}</Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={14} color="#64748b" />
                    <Text style={styles.infoLabel}>Người tạo: </Text>
                    <Text style={styles.infoValue}>{data?.ent_user?.UserName || "---"}</Text>
                    <Text style={[styles.infoLabel, { marginLeft: adjust(12) }]}>Lúc: </Text>
                    <Text style={styles.infoValue}>{data?.created_at ? moment(data.created_at).format("HH:mm:ss DD/MM/YYYY") : "---"}</Text>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>{data.tong_thiet_bi}</Text>
                        <Text style={styles.statLabel}>Thiết bị</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>{data.tong_dau_viec}</Text>
                        <Text style={styles.statLabel}>Đầu việc</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statVal, { color: '#22c55e' }]}>{data.tong_da_xong}</Text>
                        <Text style={styles.statLabel}>Đã xong</Text>
                    </View>
                </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating QR Button */}
        <TouchableOpacity style={styles.qrFab} onPress={handleOpenQrCode}>
          <Ionicons name="qr-code-outline" size={30} color="white" />
        </TouchableOpacity>

        {/* Bottom Bar Sync */}
        <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.syncBtn} onPress={handleSyncAll}>
                <Ionicons name="cloud-upload-outline" size={24} color="white" />
                <Text style={styles.syncBtnText}>
                  Đồng bộ dữ liệu ({data?.bt_dsthietbict?.reduce((acc, dev) => acc + (dev.bt_chitiettb?.filter(t => t.ket_qua && t.ket_qua.trim() !== "" && !t.hoan_thanh).length || 0), 0) || 0} mục)
                </Text>
            </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleQr}
          onRequestClose={() => {
            setModalVisibleQr(false);
            setOpacity(1);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <QRCodeScreen
                setModalVisibleQr={setModalVisibleQr}
                setOpacity={setOpacity}
                handlePushDataFilterQr={handlePushDataFilterQr}
                setIsScan={setIsScan}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: adjust(12),
  },
  listContent: {
    paddingBottom: adjust(100),
  },
  headerCard: {
    backgroundColor: "white",
    borderRadius: adjust(12),
    padding: adjust(15),
    marginBottom: adjust(15),
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: adjust(8),
  },
  phieuName: {
    fontSize: adjust(18),
    fontWeight: "800",
    color: "#1e293b",
    flex: 1,
  },
  dateText: {
    fontSize: adjust(13),
    color: "#64748b",
    fontWeight: "600",
  },
  noteBox: {
    flexDirection: 'row',
    marginBottom: adjust(12),
    backgroundColor: '#f8fafc',
    padding: adjust(8),
    borderRadius: adjust(6),
  },
  noteLabel: {
    fontSize: adjust(12),
    fontWeight: "700",
    color: "#64748b",
  },
  noteValue: {
    fontSize: adjust(12),
    color: "#475569",
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: adjust(12),
    paddingHorizontal: adjust(4),
  },
  infoLabel: {
    fontSize: adjust(13),
    fontWeight: "600",
    color: "#64748b",
    marginLeft: adjust(4),
  },
  infoValue: {
    fontSize: adjust(13),
    color: "#334155",
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: adjust(12),
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: adjust(16),
    fontWeight: "800",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: adjust(11),
    color: "#94a3b8",
    marginTop: adjust(2),
  },
  statDivider: {
    width: 1,
    height: adjust(25),
    backgroundColor: '#f1f5f9',
  },
  deviceCard: {
    backgroundColor: "white",
    borderRadius: adjust(12),
    padding: adjust(15),
    marginBottom: adjust(12),
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: adjust(12),
  },
  deviceMainInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: adjust(15),
    fontWeight: "700",
    color: "#334155",
  },
  devicePos: {
    fontSize: adjust(12),
    color: "#64748b",
    marginTop: adjust(2),
  },
  badgeContainer: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: adjust(8),
    paddingVertical: adjust(4),
    borderRadius: adjust(6),
  },
  deviceCode: {
    fontSize: adjust(11),
    fontWeight: "600",
    color: "#475569",
  },
  progressContainer: {
    marginBottom: adjust(12),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: adjust(5),
  },
  progressLabel: {
    fontSize: adjust(12),
    color: "#64748b",
  },
  progressValue: {
    fontSize: adjust(12),
    fontWeight: "700",
    color: "#1e293b",
  },
  progressBarBg: {
    height: adjust(6),
    backgroundColor: '#e2e8f0',
    borderRadius: adjust(3),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  deviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: adjust(10),
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: adjust(12),
    color: "#475569",
    fontWeight: "600",
  },
  qrFab: {
    position: "absolute",
    right: adjust(20),
    bottom: adjust(100),
    backgroundColor: COLORS.bg_button || "#1e293b",
    width: adjust(60),
    height: adjust(60),
    borderRadius: adjust(30),
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: adjust(15),
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  syncBtn: {
    backgroundColor: "#22c55e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: adjust(14),
    borderRadius: adjust(10),
    gap: adjust(8),
  },
  syncBtnText: {
    color: "white",
    fontSize: adjust(15),
    fontWeight: "700",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: "85%",
    height: "65%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ChiTietPhieuBaotriScreen;
