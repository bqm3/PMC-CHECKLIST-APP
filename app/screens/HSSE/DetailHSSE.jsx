import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import CustomAlertModal from "../../components/CustomAlertModal";
import RenderHTML from "react-native-render-html";
import adjust from "../../adjust";
import moment from "moment";
import axios from "axios";
import { COLORS } from "../../constants/theme";
import { BASE_URL } from "../../constants/config";
import { ReloadContext } from "../../context/ReloadContext";
import { getSharePointList } from "../../utils/util";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
const { width, height } = Dimensions.get("window");

const HSSE = [
  { id: 0, title: "Điện cư dân", key: "Dien_cu_dan", value: "0", type: "number" },
  { id: 1, title: "Điện chủ đầu tư", key: "Dien_cdt", value: "0", type: "number" },
  { id: 2, title: "Nước cư dân", key: "Nuoc_cu_dan", value: "0", type: "number" },
  { id: 3, title: "Nước chủ đầu tư", key: "Nuoc_cdt", value: "0", type: "number" },
  { id: 4, title: "Nước xả thải", key: "Xa_thai", value: "0", type: "number" },
  { id: 5, title: "Rác sinh hoạt", key: "Rac_sh", value: "0", type: "number" },
  { id: 6, title: "Muối điện phân", key: "Muoi_dp", value: "0", type: "number" },
  { id: 7, title: "PAC", key: "PAC", value: "0", type: "number" },
  { id: 8, title: "NaHSO3", key: "NaHSO3", value: "0", type: "number" },
  { id: 9, title: "NaOH", key: "NaOH", value: "0", type: "number" },
  { id: 10, title: "Mật rỉ đường", key: "Mat_rd", value: "0", type: "number" },
  { id: 11, title: "Polymer Anion", key: "Polymer_Anion", value: "0", type: "number" },
  { id: 12, title: "Chlorine bột", key: "Chlorine_bot", value: "0", type: "number" },
  { id: 13, title: "Chlorine viên", key: "Chlorine_vien", value: "0", type: "number" },
  { id: 14, title: "Methanol", key: "Methanol", value: "0", type: "number" },
  { id: 15, title: "Dầu máy phát", key: "Dau_may", value: "0", type: "number" },
  { id: 16, title: "Túi rác 240L", key: "Tui_rac240", value: "0", type: "number" },
  { id: 17, title: "Túi rác 120L", key: "Tui_rac120", value: "0", type: "number" },
  { id: 18, title: "Túi rác 20L", key: "Tui_rac20", value: "0", type: "number" },
  { id: 19, title: "Túi rác 10L", key: "Tui_rac10", value: "0", type: "number" },
  { id: 20, title: "Túi rác 5L", key: "Tui_rac5", value: "0", type: "number" },
  { id: 21, title: "Giấy vệ sinh 235mm", key: "giayvs_235", value: "0", type: "number" },
  { id: 22, title: "Giấy vệ sinh 120mm", key: "giaivs_120", value: "0", type: "number" },
  { id: 23, title: "Giấy lau tay", key: "giay_lau_tay", value: "0", type: "number" },
  { id: 24, title: "Hóa chất làm sạch", key: "hoa_chat", value: "0", type: "number" },
  { id: 25, title: "Nước rửa tay", key: "nuoc_rua_tay", value: "0", type: "number" },
  { id: 26, title: "Nhiệt độ", key: "nhiet_do", value: "0", type: "number" },
  { id: 27, title: "Nước bù bể", key: "nuoc_bu", value: "0", type: "number" },
  { id: 28, title: "Clo", key: "clo", value: "0", type: "number" },
  { id: 29, title: "Nồng độ PH", key: "PH", value: "0", type: "number" },
  { id: 30, title: "Poolblock", key: "Poolblock", value: "0", type: "number" },
  { id: 31, title: "Trạt thải", key: "trat_thai", value: "0", type: "number" },
  { id: 32, title: "pH Minus", key: "pHMINUS", value: "0", type: "number" },
  { id: 33, title: "Axit", key: "axit", value: "0", type: "number" },
  { id: 34, title: "PN180", key: "PN180", value: "0", type: "number" },
  { id: 35, title: "Chỉ số CO2", key: "chiSoCO2", value: "0", type: "number" },
  { id: 36, title: "Clorin", key: "clorin", value: "0", type: "number" },
  { id: 37, title: "NaOCL", key: "NaOCL", value: "0", type: "number" },
  { id: 38, title: "Ảnh công tơ điện", key: "anh_dien", value: null, type: "image" },
  { id: 39, title: "Ảnh đồng hồ nước", key: "anh_nuoc", value: null, type: "image" },
];

const DetailHSSE = ({ navigation, route }) => {
  const { data } = route.params;
  const { isReload, setIsReload } = useContext(ReloadContext);
  const { authToken } = useSelector((state) => state.authReducer);
  const [hsseData, setHsseData] = useState(HSSE);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const isToday = moment(data?.Ngay_ghi_nhan).isSame(moment(), "day");
  const isFirstDayOfMonth = useMemo(() => {
    const currentDate = moment();
    return currentDate.date() === 1;
  });

  const filteredHsseData = useMemo(() => {
    if (isFirstDayOfMonth) {
      return hsseData;
    } else {
      return hsseData.filter((item) => item.type !== "image");
    }
  }, [hsseData, isFirstDayOfMonth]);

  useEffect(() => {
    const updatedHSSE = HSSE.map((item) => ({
      ...item,
      value: data[item.key] !== undefined ? data[item.key]?.toString() : item.value,
    }));
    setHsseData(updatedHSSE);

    // Load images if available
    loadImages();
  }, [data]);

  const loadImages = async () => {
    if (!data) return;

    setIsLoadingImages(true);
    const imageData = {};

    try {
      // Load ảnh điện nếu có link
      if (data.anh_dien) {
        try {
          const electricDataUri = await getSharePointList(data.anh_dien);
          imageData.anh_dien = electricDataUri;
        } catch (error) {
          console.log("Lỗi tải ảnh điện:", error.message);
        }
      }

      // Load ảnh nước nếu có link
      if (data.anh_nuoc) {
        try {
          const waterDataUri = await getSharePointList(data.anh_nuoc);
          imageData.anh_nuoc = waterDataUri;
        } catch (error) {
          console.log("Lỗi tải ảnh nước:", error.message);
        }
      }

      setImageUrls(imageData);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleInputChange = (key, value) => {
    setHsseData((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const handleImageChange = useCallback((id, value) => {
    setHsseData((prevState) => prevState.map((item) => (item.id === id ? { ...item, value: value } : item)));
  }, []);

  // Hàm nhận dạng văn bản từ ảnh với fallback (sử dụng ảnh đã crop)
  const recognizeTextFromImage = useCallback(async (croppedImageUri) => {
    try {
      // Đọc ảnh đã crop base64 để POST lên server OCR
      const base64 = await FileSystem.readAsStringAsync(croppedImageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const { data } = await axios.post(
        `${BASE_URL}/image/ocr/base64`,
        {
          imageBase64: `data:image/jpeg;base64,${base64}`,
        },
        { timeout: 30000 }
      );
      return data?.number ?? null;
    } catch (error) {
      console.error("Lỗi OCR (backend):", error?.response?.data || error.message);
      return null;
    }
  }, []);

  const showImagePicker = useCallback(async (itemId) => {
    Alert.alert("Chọn ảnh", "Bạn muốn chọn ảnh từ đâu?", [
      {
        text: "Camera",
        onPress: () => openCamera(itemId),
      },
      {
        text: "Thư viện",
        onPress: () => openImageLibrary(itemId),
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  }, []);

  const openCamera = useCallback(
    async (itemId) => {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      if (status !== "granted") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Thông báo", "Cần cấp quyền truy cập camera!");
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType,
        quality: 1,
        allowsEditing: true,
        aspect: [3, 1],
      });

      if (!result.canceled && result.assets?.[0]) {
        const croppedImage = result.assets[0];
        await processImage(itemId, croppedImage);
      }
    },
    [processImage]
  );

  const openImageLibrary = useCallback(
    async (itemId) => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Thông báo", "Cần cấp quyền truy cập thư viện ảnh!");
          return;
        }
      }

      // Chọn ảnh với tùy chọn crop
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        quality: 1,
        allowsEditing: true,
        aspect: [3, 1],
      });

      if (!result.canceled && result.assets?.[0]) {
        const croppedImage = result.assets[0];
        await processImage(itemId, croppedImage);
      }
    },
    [processImage]
  );

  const processImage = useCallback(
    async (itemId, croppedImageAsset) => {
      // Cập nhật ảnh gốc vào state (để gửi API)
      handleImageChange(itemId, {
        uri: croppedImageAsset.uri, // Sử dụng ảnh gốc
        type: "image/jpeg",
        name: "image.jpg",
      });

      try {
        // Tìm item hiện tại để xác định loại ảnh
        const currentItem = hsseData.find((item) => item.id === itemId);

        // Nhận dạng văn bản từ ảnh đã crop
        let recognizedValue = null;
        recognizedValue = await recognizeTextFromImage(croppedImageAsset.uri);

        if (recognizedValue !== null) {
          if (currentItem) {
            // Cập nhật giá trị nhận dạng được vào trường tương ứng
            if (currentItem.key === "anh_dien") {
              setHsseData((prevState) =>
                prevState.map((item) => (item.id === itemId ? { ...item, value: { ...item.value, gia_tri_dien_ao: recognizedValue } } : item))
              );
            } else if (currentItem.key === "anh_nuoc") {
              setHsseData((prevState) =>
                prevState.map((item) => (item.id === itemId ? { ...item, value: { ...item.value, gia_tri_nuoc_ao: recognizedValue } } : item))
              );
            }
          }
        }
      } catch (error) {
      } finally {
        setIsLoadingSubmit(false);
      }
    },
    [handleImageChange, hsseData, recognizeTextFromImage]
  );
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  const groupedData = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredHsseData.length; i += 2) {
      result.push([filteredHsseData[i], filteredHsseData[i + 1] || null]);
    }
    return result;
  }, [filteredHsseData]);

  const showAlert = (message, key = false) => {
    Alert.alert("PMC Thông báo", message, [
      {
        text: "Xác nhận",
        onPress: () => (key ? navigation.navigate("Báo cáo HSSE") : console.log("Cancel Pressed")),
        style: "cancel",
      },
    ]);
  };

  const handleAlertUpdate = () => {
    Alert.alert("PMC Thông báo", "Bạn có chắc muốn cập nhật báo cáo ngày " + moment(data?.Ngaybc).format("DD/MM/YYYY") + "?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => handleUpdate(),
        style: "default",
      },
    ]);
  };

  const handleUpdate = async () => {
    // Tạo FormData để gửi cả text và image
    const formData = new FormData();

    // Thêm dữ liệu số
    hsseData.forEach((item) => {
      if (item.type === "number") {
        const floatValue = parseFloat(item.value.replace(",", "."));
        formData.append(item.key, floatValue?.toString());
      } else if (item.type === "image" && item.value && item.value.uri) {
        // Thêm file ảnh mới nếu có
        formData.append(item.key, {
          uri: item.value.uri,
          type: item.value.type,
          name:
            item.key === "anh_dien"
              ? `${moment().format("YYYYMMDDHHmmss")}_anh_dien.jpg`
              : `anh_nuoc_${moment().format("YYYYMMDDHHmmss")}.jpg`,
        });

        // Thêm giá trị nhận dạng từ ảnh (nếu có)
        if (item.key === "anh_dien" && item.value.gia_tri_dien_ao) {
          formData.append("gia_tri_dien_ao", item.value.gia_tri_dien_ao?.toString());
        } else if (item.key === "anh_nuoc" && item.value.gia_tri_nuoc_ao) {
          formData.append("gia_tri_nuoc_ao", item.value.gia_tri_nuoc_ao?.toString());
        }
      }
    });

    // Thêm thông tin ngày
    formData.append("Ngay", data?.Ngay_ghi_nhan);

    setIsLoadingSubmit(true);
    try {
      const response = await axios.put(`${BASE_URL}/hsse/update/${data.ID}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 200 || response.status == 201) {
        setIsReload(true);
        setMessage(response.data.htmlResponse);
        if (response.data.htmlResponse == "") {
          showAlert("Cập nhật báo cáo thành công", true);
        } else {
          setIsModalVisible(true);
        }
      } else {
        showAlert("Có lỗi xảy ra khi cập nhật báo cáo", false);
      }
    } catch (error) {
      if (error.response) {
        showAlert(error.response.data?.message || "Lỗi từ máy chủ. Vui lòng thử lại", false);
      } else if (error.request) {
        showAlert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối", false);
      } else {
        showAlert("Đã có lỗi xảy ra. Vui lòng thử lại", false);
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        {item.map((subItem) => {
          if (!subItem) return null;

          if (subItem.type === "image") {
            const imageUrl = imageUrls[subItem.key];
            const hasNewImage = subItem.value && subItem.value.uri;
            const displayImageUrl = hasNewImage ? subItem.value.uri : imageUrl;

            return (
              <View key={subItem.id} style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{subItem.title}</Text>
                <View style={styles.imageContainer}>
                  {isLoadingImages && !hasNewImage ? (
                    <View style={styles.imageLoadingContainer}>
                      <ActivityIndicator size="small" color={COLORS.bg_button} />
                      <Text style={styles.loadingImageText}>Đang tải ảnh...</Text>
                    </View>
                  ) : displayImageUrl ? (
                    <TouchableOpacity style={styles.imageButton} onPress={() => openImageModal(displayImageUrl)}>
                      <Image source={{ uri: displayImageUrl }} style={styles.previewImage} resizeMode="cover" />
                      <Text style={styles.viewImageText}>Xem ảnh lớn</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.noImageContainer} onPress={() => isToday && showImagePicker(subItem.id)} disabled={!isToday}>
                      <Text style={styles.noImageText}>📷</Text>
                      <Text style={styles.noImageSubText}>{isToday ? "Chụp ảnh" : "Không có ảnh"}</Text>
                    </TouchableOpacity>
                  )}

                  {/* Nút thay đổi ảnh nếu đã có ảnh và là ngày hiện tại */}
                  {displayImageUrl && isToday && (
                    <TouchableOpacity style={styles.changeImageButton} onPress={() => showImagePicker(subItem.id)}>
                      <Text style={styles.changeImageText}>Thay đổi ảnh</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }

          return (
            <View key={subItem.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{subItem.title}</Text>
              <TextInput
                style={[styles.input, !isToday && styles.disabledInput]}
                editable={isToday}
                value={subItem.value}
                onChangeText={(text) => handleInputChange(subItem.key, text)}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          );
        })}
      </View>
    ),
    [imageUrls, isLoadingImages, isToday, data, showImagePicker]
  );

  const keyExtractor = useCallback((item, index) => `group-${index}`, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ImageBackground source={require("../../../assets/bg.png")} resizeMode="cover" style={styles.flex}>
          {/* Hiển thị trạng thái ngày */}
          <View style={styles.dateStatusContainer}>
            <Text style={[styles.dateStatusText, isToday ? styles.editableStatus : styles.readOnlyStatus]}>
              {isToday
                ? `Ngày ${moment(data?.Ngay_ghi_nhan).format("DD/MM/YYYY")} - Có thể chỉnh sửa`
                : `Ngày ${moment(data?.Ngay_ghi_nhan).format("DD/MM/YYYY")} - Chỉ xem`}
            </Text>
          </View>

          {isLoadingSubmit && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.bg_white} />
              <Text style={styles.loadingText}>Đang xử lý...</Text>
            </View>
          )}

          <FlatList
            data={groupedData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {isToday && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                Keyboard.dismiss();
                handleAlertUpdate();
              }}
            >
              <Text style={styles.submitButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          )}

          {/* Modal hiển thị ảnh lớn */}
          <Modal animationType="fade" transparent={true} visible={isImageModalVisible} onRequestClose={() => setIsImageModalVisible(false)}>
            <View style={styles.imageModalContainer}>
              <TouchableOpacity style={styles.imageModalBackground} activeOpacity={1} onPress={() => setIsImageModalVisible(false)}>
                <View style={styles.imageModalContent}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setIsImageModalVisible(false)}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                  {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />}
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          <CustomAlertModal
            isVisible={isModalVisible}
            title="PMC Thông báo"
            message={<RenderHTML contentWidth={300} source={{ html: message }} />}
            onConfirm={() => {
              setIsModalVisible(false);
              navigation.navigate("Báo cáo HSSE");
            }}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dateStatusContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  dateStatusText: {
    textAlign: "center",
    fontSize: adjust(14),
    fontWeight: "600",
  },
  editableStatus: {
    color: "#28a745",
  },
  readOnlyStatus: {
    color: "#6c757d",
  },
  listContent: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTitle: {
    fontSize: adjust(14),
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
  },
  imageContainer: {
    alignItems: "center",
    minHeight: 80,
  },
  imageLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 80,
  },
  loadingImageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  imageButton: {
    alignItems: "center",
    padding: 5,
  },
  previewImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginBottom: 5,
  },
  viewImageText: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  noImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    opacity: 0.5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderStyle: "dashed",
  },
  noImageText: {
    fontSize: 24,
    marginBottom: 5,
  },
  noImageSubText: {
    fontSize: 12,
    color: "#666",
  },
  changeImageButton: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  changeImageText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
  recognizedValueContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#e3f2fd",
    borderRadius: 6,
    alignItems: "center",
  },
  recognizedValueLabel: {
    fontSize: 11,
    color: "#1976d2",
    marginBottom: 2,
  },
  recognizedValueText: {
    fontSize: 13,
    color: "#1976d2",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: COLORS.bg_button,
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 10,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalContent: {
    width: width * 0.9,
    height: height * 0.8,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: -40,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});

export default DetailHSSE;
