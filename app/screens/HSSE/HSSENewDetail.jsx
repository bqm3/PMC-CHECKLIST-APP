import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
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
  ScrollView,
  Modal,
  Dimensions,
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
import { getSharePointList } from "../../utils/util";

const { width, height } = Dimensions.get("window");

const HSSE = [
  { id: 0, title: "Điện cư dân", key: "Dien_cu_dan", value: "0", type: "number", category: "Năng lượng" },
  { id: 1, title: "Điện chủ đầu tư", key: "Dien_cdt", value: "0", type: "number", category: "Năng lượng" },
  { id: 2, title: "Nước cư dân", key: "Nuoc_cu_dan", value: "0", type: "number", category: "Nước" },
  { id: 3, title: "Nước chủ đầu tư", key: "Nuoc_cdt", value: "0", type: "number", category: "Nước" },
  { id: 4, title: "Nước xả thải", key: "Xa_thai", value: "0", type: "number", category: "Nước" },
  { id: 5, title: "Rác sinh hoạt", key: "Rac_sh", value: "0", type: "number", category: "Rác thải" },
  { id: 6, title: "Muối điện phân", key: "Muoi_dp", value: "0", type: "number", category: "Hóa chất" },
  { id: 7, title: "PAC", key: "PAC", value: "0", type: "number", category: "Hóa chất" },
  { id: 8, title: "NaHSO3", key: "NaHSO3", value: "0", type: "number", category: "Hóa chất" },
  { id: 9, title: "NaOH", key: "NaOH", value: "0", type: "number", category: "Hóa chất" },
  { id: 10, title: "Mật rỉ đường", key: "Mat_rd", value: "0", type: "number", category: "Hóa chất" },
  { id: 11, title: "Polymer Anion", key: "Polymer_Anion", value: "0", type: "number", category: "Hóa chất" },
  { id: 12, title: "Chlorine bột", key: "Chlorine_bot", value: "0", type: "number", category: "Hóa chất" },
  { id: 13, title: "Chlorine viên", key: "Chlorine_vien", value: "0", type: "number", category: "Hóa chất" },
  { id: 14, title: "Methanol", key: "Methanol", value: "0", type: "number", category: "Hóa chất" },
  { id: 15, title: "Dầu máy phát", key: "Dau_may", value: "0", type: "number", category: "Năng lượng" },
  { id: 16, title: "Túi rác 240L", key: "Tui_rac240", value: "0", type: "number", category: "Túi đựng rác" },
  { id: 17, title: "Túi rác 120L", key: "Tui_rac120", value: "0", type: "number", category: "Túi đựng rác" },
  { id: 18, title: "Túi rác 20L", key: "Tui_rac20", value: "0", type: "number", category: "Túi đựng rác" },
  { id: 19, title: "Túi rác 10L", key: "Tui_rac10", value: "0", type: "number", category: "Túi đựng rác" },
  { id: 20, title: "Túi rác 5L", key: "Tui_rac5", value: "0", type: "number", category: "Túi đựng rác" },
  { id: 21, title: "Giấy vệ sinh 235mm", key: "giayvs_235", value: "0", type: "number", category: "Giấy" },
  { id: 22, title: "Giấy vệ sinh 120mm", key: "giaivs_120", value: "0", type: "number", category: "Giấy" },
  { id: 23, title: "Giấy lau tay", key: "giay_lau_tay", value: "0", type: "number", category: "Giấy" },
  { id: 24, title: "Hóa chất làm sạch", key: "hoa_chat", value: "0", type: "number", category: "Hóa chất dùng cho làm sạch" },
  { id: 25, title: "Nước rửa tay", key: "nuoc_rua_tay", value: "0", type: "number", category: "Hóa chất dùng cho làm sạch" },
  { id: 26, title: "Nhiệt độ", key: "nhiet_do", value: "0", type: "number", category: "Nhiệt độ" },
  { id: 27, title: "Nước bù bể", key: "nuoc_bu", value: "0", type: "number", category: "Nước" },
  { id: 28, title: "Clo", key: "clo", value: "0", type: "number", category: "Hóa chất" },
  { id: 29, title: "Nồng độ PH", key: "PH", value: "0", type: "number", category: "Hóa chất" },
  { id: 30, title: "Poolblock", key: "Poolblock", value: "0", type: "number", category: "Hóa chất" },
  { id: 31, title: "Trạt thải", key: "trat_thai", value: "0", type: "number", category: "Rác thải" },
  { id: 32, title: "pH Minus", key: "pHMINUS", value: "0", type: "number", category: "Hóa chất" },
  { id: 33, title: "Axit", key: "axit", value: "0", type: "number", category: "Hóa chất" },
  { id: 34, title: "PN180", key: "PN180", value: "0", type: "number", category: "Hóa chất" },
  { id: 35, title: "Chỉ số CO2", key: "chiSoCO2", value: "0", type: "number", category: "Chỉ số CO2 tại tầng hầm" },
  { id: 36, title: "Clorin", key: "clorin", value: "0", type: "number", category: "Hóa chất" },
  { id: 37, title: "NaOCL", key: "NaOCL", value: "0", type: "number", category: "Hóa chất" },
  { id: 38, title: "Ảnh công tơ điện", key: "anh_dien", value: [], type: "image", category: "Hình ảnh" },
  { id: 39, title: "Ảnh đồng hồ nước", key: "anh_nuoc", value: [], type: "image", category: "Hình ảnh" },
];

const HSSEReport = ({ navigation, route }) => {
  const isDetailMode = !!route?.params?.data;
  const reportData = route?.params?.data;

  const { isReload, setIsReload } = useContext(ReloadContext);
  const { authToken } = useSelector((state) => state.authReducer);
  const [hsseData, setHsseData] = useState(HSSE);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [ocrValues, setOcrValues] = useState({
    gia_tri_dien_ao: [],
    gia_tri_nuoc_ao: [],
  });
  const [oldImageUrls, setOldImageUrls] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  const isToday = !isDetailMode || moment(reportData?.Ngay_ghi_nhan).isSame(moment(), "day");

  const isFirstDayOfMonth = useMemo(() => {
    const currentDate = moment();
    return currentDate.date() === 1;
  }, []);

  const filteredHsseData = useMemo(() => {
    if (isFirstDayOfMonth) {
      return hsseData;
    }
    return hsseData.filter((item) => item.type !== "image");
  }, [hsseData, isFirstDayOfMonth]);

  const groupedByCategory = useMemo(() => {
    const groups = {};
    filteredHsseData.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredHsseData]);

  useEffect(() => {
    if (isDetailMode && reportData) {
      const updatedHSSE = HSSE.map((item) => ({
        ...item,
        value: item.type === "image" ? [] : reportData[item.key] !== undefined ? reportData[item.key]?.toString() : item.value,
      }));
      setHsseData(updatedHSSE);
      loadImages();

      // ✅ Chỉ mở những category có dữ liệu
      const expanded = {};
      Object.keys(groupedByCategory).forEach((cat) => {
        const hasData = groupedByCategory[cat].some((item) => {
          if (item.type === "number") {
            const val = parseFloat(reportData[item.key]);
            return !isNaN(val) && val !== 0;
          }
          if (item.type === "image") {
            const val = reportData[item.key];
            return val && val.length > 0;
          }
          return false;
        });
        expanded[cat] = hasData; // true nếu có dữ liệu, false nếu không
      });
      setExpandedCategories(expanded);
    }
  }, [reportData, isDetailMode]);

  const loadImages = async () => {
    if (!isDetailMode || !reportData) return;
    const imageData = {};

    try {
      const parseLinks = (value) => {
        if (!value) return [];
        try {
          if (typeof value === "string") {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return [value];
            }
          }
          if (Array.isArray(value)) return value;
          if (typeof value === "object") {
            return Object.values(value).filter((val) => typeof val === "string" && val.startsWith("http"));
          }
        } catch (e) {
          console.log("Parse error:", e.message);
        }
        return [];
      };

      const processImages = async (imageValue, key) => {
        if (!imageValue) return;
        try {
          const imageUrls = parseLinks(imageValue);
          if (imageUrls.length === 0) return;

          const dataUris = await Promise.all(
            imageUrls.map(async (url) => {
              if (!url) return null;
              try {
                return await getSharePointList(url);
              } catch (error) {
                console.log(`Lỗi tải ảnh từ ${url}:`, error.message);
                return null;
              }
            })
          );

          const validUris = dataUris.filter((uri) => uri !== null);
          if (validUris.length > 0) {
            imageData[key] = validUris;
          }
        } catch (error) {
          console.log(`Lỗi tải ảnh ${key}:`, error.message);
        }
      };

      await Promise.all([
        reportData.anh_dien && processImages(reportData.anh_dien, "anh_dien"),
        reportData.anh_nuoc && processImages(reportData.anh_nuoc, "anh_nuoc"),
      ]);

      setOldImageUrls(imageData);

      if (reportData.gia_tri_dien_ao) {
        try {
          const dienValues =
            typeof reportData.gia_tri_dien_ao === "string"
              ? JSON.parse(reportData.gia_tri_dien_ao).map(String)
              : Array.isArray(reportData.gia_tri_dien_ao)
              ? reportData.gia_tri_dien_ao.map(String)
              : [reportData.gia_tri_dien_ao?.toString()];

          setOcrValues((prev) => ({
            ...prev,
            gia_tri_dien_ao: dienValues,
          }));
        } catch (e) {
          setOcrValues((prev) => ({
            ...prev,
            gia_tri_dien_ao: [reportData.gia_tri_dien_ao?.toString()],
          }));
        }
      }

      if (reportData.gia_tri_nuoc_ao) {
        try {
          const nuocValues =
            typeof reportData.gia_tri_nuoc_ao === "string"
              ? JSON.parse(reportData.gia_tri_nuoc_ao).map(String)
              : Array.isArray(reportData.gia_tri_nuoc_ao)
              ? reportData.gia_tri_nuoc_ao.map(String)
              : [reportData.gia_tri_nuoc_ao?.toString()];

          setOcrValues((prev) => ({
            ...prev,
            gia_tri_nuoc_ao: nuocValues,
          }));
        } catch (e) {
          setOcrValues((prev) => ({
            ...prev,
            gia_tri_nuoc_ao: [reportData.gia_tri_nuoc_ao?.toString()],
          }));
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };

  const handleChange = useCallback((id, value) => {
    setHsseData((prevState) => prevState.map((item) => (item.id === id ? { ...item, value } : item)));
  }, []);

  const recognizeTextFromImage = useCallback(async (croppedImageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(croppedImageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const { data } = await axios.post(`${BASE_URL}/image/ocr/base64`, { imageBase64: `data:image/jpeg;base64,${base64}` }, { timeout: 30000 });
      return data?.number ?? null;
    } catch (error) {
      console.error("Lỗi OCR:", error?.response?.data || error.message);
      return null;
    }
  }, []);

  const showImagePicker = useCallback((itemId) => {
    Alert.alert("Chọn ảnh", "Bạn muốn chọn ảnh từ đâu?", [
      { text: "📷 Camera", onPress: () => openCamera(itemId) },
      { text: "🖼️ Thư viện", onPress: () => openImageLibrary(itemId) },
      { text: "Hủy", style: "cancel" },
    ]);
  }, []);

  const openCamera = useCallback(async (itemId) => {
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
      await processImage(itemId, result.assets[0]);
    }
  }, []);

  const openImageLibrary = useCallback(async (itemId) => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Thông báo", "Cần cấp quyền truy cập thư viện ảnh!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      quality: 1,
      allowsEditing: true,
      aspect: [3, 1],
    });

    if (!result.canceled && result.assets?.[0]) {
      await processImage(itemId, result.assets[0]);
    }
  }, []);

  const processImage = useCallback(
    async (itemId, croppedImageAsset) => {
      setIsLoadingSubmit(true);
      const currentItem = hsseData.find((item) => item.id === itemId);

      const newImage = {
        uri: croppedImageAsset.uri,
        type: "image/jpeg",
        name: "image.jpg",
      };

      setHsseData((prevState) =>
        prevState.map((item) => {
          if (item.id === itemId) {
            const currentImages = Array.isArray(item.value) ? item.value : [];
            return { ...item, value: [...currentImages, newImage] };
          }
          return item;
        })
      );

      try {
        const recognizedValue = await recognizeTextFromImage(croppedImageAsset.uri);

        if (recognizedValue !== null && currentItem) {
          if (currentItem.key === "anh_dien") {
            setOcrValues((prev) => ({
              ...prev,
              gia_tri_dien_ao: [...prev.gia_tri_dien_ao, recognizedValue],
            }));
          } else if (currentItem.key === "anh_nuoc") {
            setOcrValues((prev) => ({
              ...prev,
              gia_tri_nuoc_ao: [...prev.gia_tri_nuoc_ao, recognizedValue],
            }));
          }
        }
      } catch (error) {
        console.error("Lỗi khi xử lý ảnh:", error);
        Alert.alert("Lỗi", "Đã có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
      } finally {
        setIsLoadingSubmit(false);
      }
    },
    [hsseData, recognizeTextFromImage]
  );

  const removeImage = useCallback(
    (itemId, imageIndex) => {
      Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa ảnh này?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => {
            setHsseData((prevState) =>
              prevState.map((item) => {
                if (item.id === itemId) {
                  const currentImages = Array.isArray(item.value) ? item.value : [];
                  return { ...item, value: currentImages.filter((_, i) => i !== imageIndex) };
                }
                return item;
              })
            );

            const currentItem = hsseData.find((item) => item.id === itemId);
            if (currentItem) {
              if (currentItem.key === "anh_dien") {
                setOcrValues((prev) => ({
                  ...prev,
                  gia_tri_dien_ao: prev.gia_tri_dien_ao.filter((_, i) => i !== imageIndex),
                }));
              } else if (currentItem.key === "anh_nuoc") {
                setOcrValues((prev) => ({
                  ...prev,
                  gia_tri_nuoc_ao: prev.gia_tri_nuoc_ao.filter((_, i) => i !== imageIndex),
                }));
              }
            }
          },
          style: "destructive",
        },
      ]);
    },
    [hsseData]
  );

  const showAlert = (alertMessage, navigateBack = false) => {
    Alert.alert("PMC Thông báo", alertMessage, [
      {
        text: "Xác nhận",
        onPress: () => (navigateBack ? navigation.navigate("Báo cáo HSSE") : null),
        style: "cancel",
      },
    ]);
  };

  const checkSubmit = () => {
    const message = isDetailMode
      ? `Bạn có chắc muốn cập nhật báo cáo ngày ${moment(reportData?.Ngay_ghi_nhan).format("DD/MM/YYYY")}?`
      : "Bạn có chắc chắn muốn gửi không?";

    Alert.alert("PMC Thông báo", message, [
      { text: "Hủy", style: "cancel" },
      { text: "Đồng ý", onPress: () => handleSubmit() },
    ]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    hsseData.forEach((item) => {
      if (item.type === "number") {
        const floatValue = parseFloat(item.value.replace(",", "."));
        formData.append(item.key, floatValue.toString());
      } else if (item.type === "image" && Array.isArray(item.value) && item.value.length > 0) {
        item.value.forEach((image, index) => {
          formData.append(item.key, {
            uri: image.uri,
            type: image.type,
            name:
              item.key === "anh_dien"
                ? `${moment().format("YYYYMMDDHHmmss")}_anh_dien_${index + 1}.jpg`
                : `${moment().format("YYYYMMDDHHmmss")}_anh_nuoc_${index + 1}.jpg`,
          });
        });
      }
    });

    if (ocrValues.gia_tri_dien_ao.length > 0) {
      formData.append("gia_tri_dien_ao", JSON.stringify(ocrValues.gia_tri_dien_ao));
    }
    if (ocrValues.gia_tri_nuoc_ao.length > 0) {
      formData.append("gia_tri_nuoc_ao", JSON.stringify(ocrValues.gia_tri_nuoc_ao));
    }

    if (isDetailMode) {
      formData.append("Ngay", reportData?.Ngay_ghi_nhan);
    }

    const hasNumericChanges = hsseData.some((item) => item.type === "number" && parseFloat(item.value.replace(",", ".")) !== 0);

    if (!hasNumericChanges && !ocrValues.gia_tri_dien_ao.length && !ocrValues.gia_tri_nuoc_ao.length) {
      showAlert("Chưa có thông tin nào thay đổi. Vui lòng nhập thông tin!");
      return;
    }

    setIsLoadingSubmit(true);
    try {
      const endpoint = isDetailMode ? `${BASE_URL}/hsse/update/${reportData.ID}` : `${BASE_URL}/hsse/create`;
      const method = isDetailMode ? "put" : "post";

      const response = await axios[method](endpoint, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setIsReload(true);
        setMessage(response.data.htmlResponse);
        if (response.data.htmlResponse === "") {
          showAlert(isDetailMode ? "✅ Cập nhật báo cáo thành công" : "✅ Gửi báo cáo thành công", true);
          if (!isDetailMode) {
            setHsseData(HSSE);
            setOcrValues({ gia_tri_dien_ao: [], gia_tri_nuoc_ao: [] });
          }
        } else {
          setIsModalVisible(true);
        }
      } else {
        showAlert("❌ Có lỗi xảy ra khi xử lý báo cáo");
      }
    } catch (error) {
      if (error.response) {
        showAlert(error.response.data?.message || "❌ Lỗi từ máy chủ. Vui lòng thử lại");
      } else if (error.request) {
        showAlert("❌ Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối");
      } else {
        showAlert("❌ Đã có lỗi xảy ra. Vui lòng thử lại");
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const renderNumberInput = (item) => (
    <View key={item.id} style={styles.fieldCard}>
      <Text style={styles.fieldLabel}>{item.title}</Text>
      <TextInput
        style={[styles.numberInput, !isToday && styles.disabledInput]}
        value={item.value.toString()}
        onChangeText={(text) => handleChange(item.id, text)}
        placeholderTextColor="#bbb"
        keyboardType="numeric"
        returnKeyType="done"
        editable={isToday}
      />
    </View>
  );

  const renderImageField = (item) => {
    const newImages = Array.isArray(item.value) ? item.value : [];
    const currentItemOcrKey = item.key === "anh_dien" ? "gia_tri_dien_ao" : "gia_tri_nuoc_ao";
    const currentOcrValues = ocrValues[currentItemOcrKey] || [];
    const oldImages = oldImageUrls[item.key] || [];

    return (
      <View key={item.id} style={styles.imageCard}>
        <Text style={styles.imageTitle}>{item.title}</Text>

        {oldImages.length > 0 && (
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionLabel}>📸 Ảnh cũ</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {oldImages.map((image, index) => (
                <TouchableOpacity key={`old-${index}`} style={styles.imageThumbnail} onPress={() => openImageModal(image)} activeOpacity={0.7}>
                  <Image source={{ uri: image }} style={styles.imageThumbnailImg} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {newImages.length > 0 && (
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionLabel}>✨ Ảnh mới</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {newImages.map((image, index) => (
                <View key={`new-${index}`} style={styles.imageThumbnailWrapper}>
                  <Image source={{ uri: image.uri }} style={styles.imageThumbnailImg} resizeMode="cover" />
                  {currentOcrValues[index] && (
                    <View style={styles.ocrBadge}>
                      <Text style={styles.ocrText}>{currentOcrValues[index]}</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(item.id, index)} activeOpacity={0.7}>
                    <Text style={styles.removeImageIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {isToday && (
          <TouchableOpacity style={styles.addPhotoBtn} onPress={() => showImagePicker(item.id)} activeOpacity={0.7}>
            <Text style={styles.addPhotoBtnIcon}>📷</Text>
            <View>
              <Text style={styles.addPhotoBtnLabel}>Thêm ảnh</Text>
              <Text style={styles.addPhotoBtnSubLabel}>{newImages.length > 0 ? `${newImages.length} ảnh` : "Chụp hoặc chọn từ thư viện"}</Text>
            </View>
          </TouchableOpacity>
        )}

        {!isToday && newImages.length === 0 && oldImages.length === 0 && (
          <View style={[styles.addPhotoBtn, styles.disabledPhotoBtn]}>
            <Text style={styles.addPhotoBtnIcon}>📷</Text>
            <Text style={styles.addPhotoBtnLabel}>Không có ảnh</Text>
          </View>
        )}
      </View>
    );
  };

  const renderCategory = (categoryName) => {
    const items = groupedByCategory[categoryName] || [];
    const isExpanded = expandedCategories[categoryName];

    return (
      <View key={categoryName} style={styles.categorySection}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() =>
            setExpandedCategories((prev) => ({
              ...prev,
              [categoryName]: !prev[categoryName],
            }))
          }
          activeOpacity={0.7}
        >
          <Text style={styles.categoryIcon}>
            {categoryName === "Năng lượng" && "⚡"}
            {categoryName === "Nước" && "💦"}
            {categoryName === "Rác thải" && "🗑️"}
            {categoryName === "Túi đựng rác" && "🛍️"}
            {categoryName === "Giấy" && "📃"}
            {categoryName === "Hóa chất dùng cho làm sạch" && "🧴"}
            {categoryName === "Nhiệt độ" && "🌡️"}
            {categoryName === "Chỉ số CO2 tại tầng hầm" && "💨"}
            {categoryName === "Hóa chất" && "⚗️"}
            {categoryName === "Hình ảnh" && "📸"}
          </Text>

          <Text style={styles.categoryTitle}>{categoryName}</Text>
          <Text style={styles.itemCount}>{items.length}</Text>
          <Text style={[styles.expandIcon, isExpanded && styles.expandedIcon]}>{isExpanded ? "▼" : "▶"}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.categoryContent}>
            {items.map((item) => (
              <View key={item.id}>
                {item.type === "number" && renderNumberInput(item)}
                {item.type === "image" && renderImageField(item)}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ImageBackground source={require("../../../assets/bg.png")} resizeMode="cover" style={styles.container}>
          {/* Header Status */}
          {/* {isDetailMode && (
            <View style={styles.headerStatus}>
              <View style={[styles.statusBadge, isToday ? styles.editableBadge : styles.readOnlyBadge]}>
                <Text style={styles.statusIcon}>{isToday ? "✏️" : "👁️"}</Text>
                <View>
                  <Text style={styles.statusDate}>{moment(reportData?.Ngay_ghi_nhan).format("DD/MM/YYYY")}</Text>
                  <Text style={styles.statusMode}>{isToday ? "Có thể chỉnh sửa" : "Chỉ xem"}</Text>
                </View>
              </View>
            </View>
          )} */}

          {/* Loading Overlay */}
          {isLoadingSubmit && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Đang xử lý...</Text>
            </View>
          )}

          {/* Categories List */}
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {Object.keys(groupedByCategory).map((categoryName) => renderCategory(categoryName))}
          </ScrollView>

          {/* Submit Button */}
          {isToday && (
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  Keyboard.dismiss();
                  checkSubmit();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnIcon}>{isDetailMode ? "💾" : "✅"}</Text>
                <Text style={styles.submitBtnText}>{isDetailMode ? "Cập nhật báo cáo" : "Gửi báo cáo"}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Image Modal */}
          <Modal animationType="fade" transparent visible={isImageModalVisible} onRequestClose={() => setIsImageModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setIsImageModalVisible(false)}>
                <View style={styles.modalContent}>
                  <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsImageModalVisible(false)}>
                    <Text style={styles.closeModalIcon}>✕</Text>
                  </TouchableOpacity>
                  {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />}
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Alert Modal */}
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
  container: {
    flex: 1,
  },
  headerStatus: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  editableBadge: {
    backgroundColor: "white",
    borderLeftWidth: 4,
    borderLeftColor: "#34d399",
  },
  readOnlyBadge: {
    backgroundColor: "rgba(156, 163, 175, 0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#9ca3af",
  },
  statusIcon: {
    fontSize: 24,
  },
  statusDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
  statusMode: {
    fontSize: 12,
    color: "black",
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 100,
  },
  categorySection: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 10,
    color: "#00BFFF",
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  itemCount: {
    fontSize: 12,
    color: "#9ca3af",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  expandIcon: {
    fontSize: 12,
    color: "#6b7280",
  },
  expandedIcon: {
    color: "#3b82f6",
  },
  categoryContent: {
    paddingHorizontal: 5,
    gap: 10,
  },
  fieldCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },
  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
    borderColor: "#d1d5db",
  },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  imageSection: {
    marginBottom: 10,
  },
  imageSectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 8,
  },
  imageRow: {
    marginBottom: 8,
  },
  imageThumbnail: {
    marginRight: 8,
  },
  imageThumbnailImg: {
    width: 85,
    height: 85,
    borderRadius: 8,
  },
  imageThumbnailWrapper: {
    position: "relative",
    marginRight: 8,
  },
  ocrBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  ocrText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  removeImageIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addPhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#dbeafe",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f0f9ff",
    gap: 10,
  },
  disabledPhotoBtn: {
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    opacity: 0.6,
  },
  addPhotoBtnIcon: {
    fontSize: 28,
  },
  addPhotoBtnLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0ea5e9",
  },
  addPhotoBtnSubLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  submitContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  submitBtnIcon: {
    fontSize: 18,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 100,
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.92,
    height: height * 0.75,
    position: "relative",
  },
  closeModalBtn: {
    position: "absolute",
    top: -45,
    right: 0,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalIcon: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});

export default HSSEReport;
