import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import adjust from "../../adjust";
import { COLORS, SIZES } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons, Entypo, MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import { useLoading } from "../../context/LoadingContext";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { CameraView } from "expo-camera";
import { bt_chitiettb_API, tansuatAPI, hanhdongAPI } from "./api";
import * as Location from "expo-location";

const TINH_TRANG = {
  BINH_THUONG: "Bình thường",
  HU_HONG: "Hư hỏng",
};

const ThucHienBaotriThietbiScreen = ({ route, navigation }) => {
  const { deviceData, phieuId } = route.params;
  const { authToken } = useSelector((state) => state.authReducer);
  const { setIsLoading } = useLoading();

  const [tasks, setTasks] = useState(deviceData.bt_chitiettb || []);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // QR Scan states (for potentially scanning labels while checklist)
  const [camera, setCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const cameraRef = useRef(null);

  const [currentCoord, setCurrentCoord] = useState({ lat: "", long: "", alt: "" });

  const tansuatList = route.params?.tansuatList || [];
  const hanhdongList = route.params?.hanhdongList || [];

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (loc && loc.coords) {
            setCurrentCoord({
                lat: loc.coords.latitude.toString(),
                long: loc.coords.longitude.toString(),
                alt: loc.coords.altitude ? loc.coords.altitude.toString() : ""
            });
        }
    } catch (err) {
        console.log("Lỗi lấy vị trí:", err);
    }
  };

  const getTansuatLabel = (id) => {
    const item = tansuatList.find(i => i.id_dmtansuat === id);
    return item ? item.ten_tan_suat : `Tần suất #${id}`;
  };

  const getHanhdongLabels = (idList) => {
    if (!idList) return "";
    const ids = idList.toString().split(",");
    return ids.map(id => {
        const item = hanhdongList.find(i => i.id_dmhanhdong.toString() === id.trim());
        return item ? item.ten_hanh_dong : id;
    }).join(", ");
  };



  // Form state for a single task
  const [taskForm, setTaskForm] = useState({
    ket_qua: "",
    tinh_trang: TINH_TRANG.BINH_THUONG,
    ghi_chu: "",
    images: [], // List of up to 5 photos
  });

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setTaskForm({
      ket_qua: task.ket_qua || "",
      tinh_trang: task.tinh_trang || TINH_TRANG.BINH_THUONG,
      ghi_chu: task.ghi_chu || "",
      images: task.images || [], // task.images should be an array
    });
    setModalVisible(true);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập camera để thực hiện tính năng này!");
      return;
    }

    if (Platform.OS === "android" || Platform.OS === "ios") {
        setCamera(true);
        return;
    }
  };

  const handleCapture = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync();

      const resizedImage = await ImageManipulator.manipulateAsync(
        photo.uri, 
        [{ resize: { width: Math.min(1024, photo.width) } }], 
        { compress: 0.7, format: "jpeg" }
      );

      if (taskForm.images.length < 5) {
        setTaskForm(prev => ({
          ...prev,
          images: [...prev.images, resizedImage]
        }));
      } else {
        Alert.alert("Thông báo", "Chỉ được chụp tối đa 5 ảnh.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      turnOffCamera();
    }
  };

  const turnOffCamera = () => {
    setIsProcessing(false);
    setFlashMode(false);
    setCamera(false);
  };

  const removeImage = (indexToRemove) => {
    setTaskForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSaveTask = () => {
    try {
        const newTasks = tasks.map((t) => {
          if (t.id_chitiettb === selectedTask.id_chitiettb) {
            return {
              ...t,
              ...taskForm,
              thoi_gian_thuc_hien: moment().format("YYYY-MM-DD HH:mm:ss"),
              vi_do: currentCoord.lat,
              kinh_do: currentCoord.long,
              do_cao: currentCoord.alt,
            };
          }
          return t;
        });
        setTasks(newTasks);
        
        if (route.params?.onUpdate) {
            route.params.onUpdate(newTasks);
        }
        
        setModalVisible(false);
    } catch (error) {
        console.error("Lỗi lưu hạng mục:", error);
    }
  };

  const handleSubmitOnline = async () => {
    const finishedTasks = tasks.filter(t => t.ket_qua && t.ket_qua.trim() !== "" && !t.hoan_thanh);
    if (finishedTasks.length === 0) {
        Alert.alert("Thông báo", "Bạn chưa hoàn thành hạng mục mới nào để đồng bộ.");
        return;
    }

    Alert.alert(
      "Xác nhận",
      "Bạn muốn đồng bộ trực tiếp kết quả của thiết bị này lên hệ thống? (Yêu cầu có mạng internet)",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đồng bộ", 
          onPress: async () => {
            try {
              setIsLoading(true);
              const formData = new FormData();
              formData.append("id_thongtinchung", phieuId);
              
              finishedTasks.forEach((item, index) => {
                  formData.append(`id_chitiettb[${index}]`, item.id_chitiettb);
                  formData.append(`ket_qua[${index}]`, item.ket_qua || "");
                  formData.append(`tinh_trang[${index}]`, item.tinh_trang || "Bình thường");
                  formData.append(`ghi_chu[${index}]`, item.ghi_chu || "");
                  formData.append(`thoi_gian_thuc_hien[${index}]`, item.thoi_gian_thuc_hien || moment().format("YYYY-MM-DD HH:mm:ss"));
                  formData.append(`vi_do[${index}]`, item.vi_do || "");
                  formData.append(`kinh_do[${index}]`, item.kinh_do || "");
                  formData.append(`do_cao[${index}]`, item.do_cao || "");
                  formData.append(`qr_code[${index}]`, route.params.isScanQr || 0);
                  
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

              await bt_chitiettb_API.updateTask(authToken, formData);
              Alert.alert("Thành công", "Đã đồng bộ thiết bị lên hệ thống.");
              
              const updatedTasks = tasks.map(t => {
                  if (finishedTasks.find(ft => ft.id_chitiettb === t.id_chitiettb)) {
                      return { ...t, hoan_thanh: 1 };
                  }
                  return t;
              });
              
              if (route.params?.onUpdate) {
                 route.params.onUpdate(updatedTasks);
              }
              navigation.goBack();
            } catch (error) {
              console.error(error);
              Alert.alert("Lỗi", "Không thể lưu dữ liệu, vui lòng kiểm tra kết nối mạng.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };



  const renderItem = ({ item, index }) => {
    const taskInfo = item.bt_thietbi_thietlap;
    const isSynced = item.hoan_thanh === 1 || item.hoan_thanh === true;

    console.log("item", item)

    return (
      <View style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <Ionicons
            name={isSynced ? "checkmark-done-circle" : (item.ket_qua ? "checkmark-circle" : "ellipse-outline")}
            size={adjust(24)}
            color={isSynced ? "#10b981" : (item.ket_qua ? "#f59e0b" : "#cbd5e1")}
          />
          <View style={styles.taskTitleContainer}>
            <Text style={[styles.taskName, item.ket_qua && styles.taskDoneText]}>{taskInfo?.hang_muc}</Text>
            <Text style={styles.taskContent} numberOfLines={2}>
              {taskInfo?.noi_dung_cong_viec}
            </Text>
            <View style={styles.metaBadgeRow}>
                <View style={[styles.metaBadge, { backgroundColor: '#eff6ff' }]}>
                    <Ionicons name="repeat" size={10} color="#1d4ed8" />
                    <Text style={[styles.metaBadgeText, { color: '#1d4ed8' }]}>{getTansuatLabel(item.id_dmtansuat)}</Text>
                </View>
                <View style={[styles.metaBadge, { backgroundColor: '#fdf2f8' }]}>
                    <Ionicons name="construct-outline" size={10} color="#be185d" />
                    <Text style={[styles.metaBadgeText, { color: '#be185d' }]} numberOfLines={1}>{getHanhdongLabels(item.id_dmhanhdong_list)}</Text>
                </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.inputArea, isSynced && { opacity: 0.7, backgroundColor: "#f1f5f9", borderColor: "#e2e8f0" }]} 
          onPress={() => {
              if (isSynced) {
                  Alert.alert("Trạng thái thiết bị", "Hạng mục này đã lưu bảo trì lên hệ thống và không thể sửa lại.");
              } else {
                  handleOpenTask(item);
              }
          }}
        >
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>Kết quả & Ảnh ({item.images?.length || 0} mới | {item.hinh_anh_url ? item.hinh_anh_url.split(',').length : 0} cũ)</Text>
            {isSynced ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="cloud-done" size={16} color="#10b981" />
                    <Text style={{ fontSize: adjust(10), color: "#10b981", fontWeight: "700" }}>ĐÃ GỬI</Text>
                </View>
            ) : (
                <Ionicons name="create-outline" size={16} color="#3b82f6" />
            )}
          </View>
          <Text style={styles.inputText} numberOfLines={1}>
            {item.ket_qua ? `KQ: ${item.ket_qua}` : "Chưa có kết quả..."}
            {item.ghi_chu ? ` | GC: ${item.ghi_chu}` : ""}
          </Text>
          
          {item.images?.length > 0 && (
              <View style={styles.miniImages}>
                  {item.images?.map((img, idx) => (
                      <Image key={`new-${idx}`} source={{ uri: img.uri }} style={[styles.miniImg, { borderColor: '#3b82f6', borderWidth: 1 }]} />
                  ))}
              </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (camera) {
    return (
      <CameraView ref={cameraRef} style={styles.fullCamera} enableTorch={flashMode} enableZoom={true} preset="medium">
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.flashBtn} onPress={() => setFlashMode(!flashMode)}>
            <MaterialIcons name={flashMode ? "flash-on" : "flash-off"} size={36} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.captureBtn, isProcessing && styles.btnDisabled]} 
            onPress={handleCapture}
            disabled={isProcessing}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraCloseBtn} onPress={turnOffCamera}>
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  return (
    <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="stretch" style={styles.background}>
      <View style={styles.container}>
        <View style={styles.deviceHeaderCard}>
          <View style={styles.deviceTitleRow}>
            <MaterialCommunityIcons name="cube-outline" size={20} color="#3b82f6" />
            <Text style={styles.deviceNameText}>{deviceData.bt_thietbida?.ten_thietbi_da}</Text>
          </View>
          <Text style={styles.deviceSubText}>Mã QR: {deviceData.bt_thietbida?.qr_code || "---"}</Text>
          <Text style={styles.deviceSubText}>Vị trí: {deviceData.bt_thietbida?.vi_tri_lap_dat || "---"}</Text>
        </View>

        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_chitiettb.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitOnline}>
            <Ionicons name="cloud-upload-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.submitBtnText}>Đồng bộ lên hệ thống ngay</Text>
          </TouchableOpacity>
        </View> */}

        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chi tiết</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                <Text style={styles.modalTaskName}>{selectedTask?.bt_thietbi_thietlap?.hang_muc}</Text>

                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>Kết quả đo đạc / kiểm tra</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Nhập kết quả..."
                    value={taskForm.ket_qua}
                    onChangeText={(text) => setTaskForm({ ...taskForm, ket_qua: text })}
                  />
                </View>

                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>Tình trạng</Text>
                  <View style={styles.statusPicker}>
                    {Object.values(TINH_TRANG).map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.statusBtn, taskForm.tinh_trang === s && styles.statusBtnActive]}
                        onPress={() => setTaskForm({ ...taskForm, tinh_trang: s })}
                      >
                        <Text style={[styles.statusBtnText, taskForm.tinh_trang === s && styles.statusBtnTextActive]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>Ghi chú thêm</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    placeholder="Nhập ghi chú..."
                    multiline
                    numberOfLines={3}
                    value={taskForm.ghi_chu}
                    onChangeText={(text) => setTaskForm({ ...taskForm, ghi_chu: text })}
                  />
                </View>

                <View style={styles.formItem}>
                    <View style={styles.photoHeader}>
                        <Text style={styles.formLabel}>Hình ảnh (Tối đa 5)</Text>
                        <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
                            <Entypo name="camera" size={18} color="white" />
                            <Text style={styles.addPhotoText}>Chụp ảnh</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                        {taskForm.images.map((img, index) => (
                            <View key={index} style={styles.photoWrapper}>
                                <Image source={{ uri: img.uri }} style={styles.photoItem} />
                                <TouchableOpacity style={styles.removePhotoBtn} onPress={() => removeImage(index)}>
                                    <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.9)" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.saveTaskBtn} onPress={handleSaveTask}>
                <Text style={styles.saveTaskBtnText}>Lưu hạng mục</Text>
              </TouchableOpacity>
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
  deviceHeaderCard: {
    backgroundColor: "white",
    borderRadius: adjust(12),
    padding: adjust(15),
    marginBottom: adjust(15),
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    elevation: 3,
  },
  deviceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: adjust(5),
    gap: adjust(8),
  },
  deviceNameText: {
    fontSize: adjust(17),
    fontWeight: "800",
    color: "#1e293b",
  },
  deviceSubText: {
    fontSize: adjust(13),
    color: "#64748b",
    marginTop: adjust(2),
  },
  listContent: {
    paddingBottom: adjust(100),
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: adjust(10),
    padding: adjust(12),
    marginBottom: adjust(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: adjust(10),
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskName: {
    fontSize: adjust(15),
    fontWeight: "700",
    color: "#334155",
  },
  taskDoneText: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
  },
  taskContent: {
    fontSize: adjust(13),
    color: "#64748b",
    marginTop: adjust(2),
  },
  metaBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: adjust(6),
    marginTop: adjust(6),
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: adjust(6),
    paddingVertical: adjust(2),
    borderRadius: adjust(4),
    gap: adjust(3),
  },
  metaBadgeText: {
    fontSize: adjust(10),
    fontWeight: '700',
  },
  inputArea: {
    marginTop: adjust(12),
    backgroundColor: "#f8fafc",
    padding: adjust(10),
    borderRadius: adjust(8),
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: adjust(4),
  },
  inputLabel: {
    fontSize: adjust(11),
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  inputText: {
    fontSize: adjust(13),
    color: "#475569",
    fontStyle: "italic",
  },
  miniImages: {
    flexDirection: 'row',
    marginTop: adjust(8),
    alignItems: 'center',
    gap: adjust(5),
  },
  miniImg: {
    width: adjust(40),
    height: adjust(40),
    borderRadius: adjust(4),
  },
  moreImgText: {
    fontSize: adjust(12),
    color: '#3b82f6',
    fontWeight: '700',
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: adjust(15),
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.bg_button || "#10b981",
    borderRadius: adjust(10),
    paddingVertical: adjust(14),
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "white",
    fontSize: adjust(16),
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: adjust(20),
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: adjust(16),
    padding: adjust(20),
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: adjust(15),
    paddingBottom: adjust(10),
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: adjust(18),
    fontWeight: "800",
    color: "#1e293b",
  },
  modalBody: {
    marginBottom: adjust(15),
  },
  modalTaskName: {
    fontSize: adjust(16),
    fontWeight: "700",
    color: "#3b82f6",
    marginBottom: adjust(15),
  },
  formItem: {
    marginBottom: adjust(15),
  },
  formLabel: {
    fontSize: adjust(13),
    fontWeight: "700",
    color: "#64748b",
    marginBottom: adjust(6),
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: adjust(8),
    paddingHorizontal: adjust(12),
    paddingVertical: adjust(8),
    fontSize: adjust(14),
    color: "#1e293b",
  },
  formTextArea: {
    height: adjust(80),
    textAlignVertical: "top",
  },
  statusPicker: {
    flexDirection: "row",
    gap: adjust(8),
  },
  statusBtn: {
    flex: 1,
    paddingVertical: adjust(8),
    alignItems: "center",
    borderRadius: adjust(8),
    backgroundColor: "#f1f5f9",
  },
  statusBtnActive: {
    backgroundColor: "#3b82f6",
  },
  statusBtnText: {
    fontSize: adjust(12),
    fontWeight: "600",
    color: "#64748b",
  },
  statusBtnTextActive: {
    color: "white",
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: adjust(8),
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: adjust(10),
    paddingVertical: adjust(6),
    borderRadius: adjust(6),
    gap: adjust(5),
  },
  addPhotoText: {
    color: 'white',
    fontSize: adjust(12),
    fontWeight: '700',
  },
  photoStrip: {
    flexDirection: 'row',
  },
  photoWrapper: {
    marginRight: adjust(10),
    position: 'relative',
  },
  photoItem: {
    width: adjust(100),
    height: adjust(140),
    borderRadius: adjust(8),
  },
  removePhotoBtn: {
    position: 'absolute',
    top: adjust(-5),
    right: adjust(-5),
  },
  saveTaskBtn: {
    backgroundColor: "#3b82f6",
    borderRadius: adjust(10),
    paddingVertical: adjust(12),
    alignItems: "center",
  },
  saveTaskBtnText: {
    color: "white",
    fontSize: adjust(15),
    fontWeight: "700",
  },
  fullCamera: {
    flex: 1,
    width: '100%',
  },
  cameraControls: {
    position: 'absolute',
    bottom: adjust(40),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: adjust(20),
  },
  captureBtn: {
    width: adjust(70),
    height: adjust(70),
    borderRadius: adjust(35),
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: adjust(54),
    height: adjust(54),
    borderRadius: adjust(27),
    backgroundColor: 'white',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  cameraCloseBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: adjust(50),
    height: adjust(50),
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: adjust(50),
    height: adjust(50),
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ThucHienBaotriThietbiScreen;
