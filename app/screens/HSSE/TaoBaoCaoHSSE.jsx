import React, { useState, useCallback, useMemo, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import CustomAlertModal from "../../components/CustomAlertModal";
import RenderHTML from "react-native-render-html";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import { COLORS } from "../../constants/theme";
import { ReloadContext } from "../../context/ReloadContext";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import moment from "moment-timezone";

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

const TaoBaoCaoHSSE = ({ navigation, route }) => {
  const { isReload, setIsReload } = useContext(ReloadContext);
  const { authToken } = useSelector((state) => state.authReducer);
  const [hsseData, setHsseData] = useState(HSSE);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleChange = useCallback((id, value) => {
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
      handleChange(itemId, {
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
        console.error("Lỗi khi xử lý ảnh:", error);
        Alert.alert("Lỗi", "Đã có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
      } finally {
        setIsLoadingSubmit(false);
      }
    },
    [handleChange, hsseData, recognizeTextFromImage]
  );

  const groupedData = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredHsseData.length; i += 2) {
      result.push([filteredHsseData[i], filteredHsseData[i + 1] || null]);
    }
    return result;
  }, [filteredHsseData]);

  const showAlert = (message, key = false) => {
    Alert.alert("Thông báo", message, [
      {
        text: "Xác nhận",
        onPress: () => (key ? navigation.navigate("Báo cáo HSSE") : console.log("Cancel Pressed")),
        style: "cancel",
      },
    ]);
  };

  const checkSubmit = async () => {
    Alert.alert("Thông báo", "Bạn có chắc chắn muốn gửi không?", [
      {
        text: "Hủy",
        onPress: () => {
          console.log("Cancel Pressed");
        },
        style: "cancel",
      },
      { text: "Đồng ý", onPress: () => handleSubmit() },
    ]);
  };

  const handleSubmit = async () => {
    // Tạo FormData để gửi cả text và image
    const formData = new FormData();

    // Thêm dữ liệu số
    hsseData.forEach((item) => {
      if (item.type === "number") {
        const floatValue = parseFloat(item.value.replace(",", "."));
        formData.append(item.key, floatValue.toString());
      } else if (item.type === "image" && item.value) {
        // Thêm file ảnh gốc (chưa crop)
        formData.append(item.key, {
          uri: item.value.uri, // Đây là ảnh gốc
          type: item.value.type,
          name:
            item.key === "anh_dien"
              ? `${moment().format("YYYYMMDDHHmmss")}_anh_dien.jpg`
              : `anh_nuoc_${moment().format("YYYYMMDDHHmmss")}.jpg`,
        });

        // Thêm giá trị nhận dạng từ ảnh đã crop (nếu có)
        if (item.key === "anh_dien" && item.value.gia_tri_dien_ao) {
          formData.append("gia_tri_dien_ao", item.value.gia_tri_dien_ao.toString());
        } else if (item.key === "anh_nuoc" && item.value.gia_tri_nuoc_ao) {
          formData.append("gia_tri_nuoc_ao", item.value.gia_tri_nuoc_ao.toString());
        }
      }
    });

    // Kiểm tra có dữ liệu thay đổi không
    const hasNumericChanges = hsseData.some((item) => item.type === "number" && parseFloat(item.value.replace(",", ".")) !== 0);

    if (!hasNumericChanges) {
      showAlert("Chưa có thông tin nào thay đổi. Vui lòng nhập thông tin!", false);
      return;
    }

    setIsLoadingSubmit(true);
    try {
      const response = await axios.post(`${BASE_URL}/hsse/create`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Kiểm tra response status
      if (response.status == 200 || response.status == 201) {
        setIsReload(true);
        setMessage(response.data.htmlResponse);
        if (response.data.htmlResponse == "") {
          showAlert("Gửi báo cáo thành công", true);
          setHsseData(HSSE);
        } else {
          setIsModalVisible(true);
        }
      } else {
        showAlert("Có lỗi xảy ra khi gửi báo cáo", false);
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
            return (
              <View key={subItem.id} style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{subItem.title}</Text>
                <TouchableOpacity style={styles.imageButton} onPress={() => showImagePicker(subItem.id)}>
                  {subItem.value ? (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: subItem.value.uri }} style={styles.previewImage} resizeMode="cover" />
                      <Text style={styles.changeImageText}>Thay đổi ảnh</Text>
                    </View>
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Text style={styles.placeholderText}>📷</Text>
                      <Text style={styles.placeholderSubText}>{"Chụp ảnh"}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <View key={subItem.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{subItem.title}</Text>
              <TextInput
                style={styles.input}
                value={subItem.value.toString()}
                onChangeText={(text) => handleChange(subItem.id, text)}
                placeholderTextColor="#888"
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          );
        })}
      </View>
    ),
    [handleChange, showImagePicker]
  );

  const keyExtractor = useCallback((item, index) => `group-${index}`, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ImageBackground source={require("../../../assets/bg.png")} resizeMode="cover" style={styles.flex}>
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

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              Keyboard.dismiss();
              checkSubmit();
            }}
          >
            <Text style={styles.submitButtonText}>Gửi báo cáo</Text>
          </TouchableOpacity>

          <CustomAlertModal
            isVisible={isModalVisible}
            title="Thông báo"
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
  imageButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    minHeight: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 5,
  },
  changeImageText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  recognizedValueText: {
    fontSize: 11,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "center",
  },
  placeholderContainer: {
    alignItems: "center",
    padding: 10,
  },
  placeholderText: {
    fontSize: 24,
    marginBottom: 5,
  },
  placeholderSubText: {
    fontSize: 12,
    color: "#666",
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
});

export default TaoBaoCaoHSSE;
