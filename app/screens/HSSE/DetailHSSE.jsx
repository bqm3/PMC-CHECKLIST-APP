import React, { useState, useCallback, useMemo, useEffect } from "react";
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
} from "react-native";
import { useSelector } from "react-redux";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import CustomAlertModal from "../../components/CustomAlertModal";
import RenderHTML from "react-native-render-html";
import adjust from "../../adjust";
import moment from "moment";
import axios from "axios";
import { COLORS } from "../../constants/theme";
import { BASE_URL } from "../../constants/config";

const HSSE = [
  { id: 0, title: "Điện cư dân", key: "Dien_cu_dan", value: "0" },
  { id: 1, title: "Điện chủ đầu tư", key: "Dien_cdt", value: "0" },
  { id: 2, title: "Nước cư dân", key: "Nuoc_cu_dan", value: "0" },
  { id: 3, title: "Nước chủ đầu tư", key: "Nuoc_cdt", value: "0" },
  { id: 4, title: "Nước xả thải", key: "Xa_thai", value: "0" },
  { id: 5, title: "Rác sinh hoạt", key: "Rac_sh", value: "0" },
  { id: 6, title: "Muối điện phân", key: "Muoi_dp", value: "0" },
  { id: 7, title: "PAC", key: "PAC", value: "0" },
  { id: 8, title: "NaHSO3", key: "NaHSO3", value: "0" },
  { id: 9, title: "NaOH", key: "NaOH", value: "0" },
  { id: 10, title: "Mật rỉ đường", key: "Mat_rd", value: "0" },
  { id: 11, title: "Polymer Anion", key: "Polymer_Anion", value: "0" },
  { id: 12, title: "Chlorine bột", key: "Chlorine_bot", value: "0" },
  { id: 13, title: "Chlorine viên", key: "Chlorine_vien", value: "0" },
  { id: 14, title: "Methanol", key: "Methanol", value: "0" },
  { id: 15, title: "Dầu máy phát", key: "Dau_may", value: "0" },
  { id: 16, title: "Túi rác 240L", key: "Tui_rac240", value: "0" },
  { id: 17, title: "Túi rác 120L", key: "Tui_rac120", value: "0" },
  { id: 18, title: "Túi rác 20L", key: "Tui_rac20", value: "0" },
  { id: 19, title: "Túi rác 10L", key: "Tui_rac10", value: "0" },
  { id: 20, title: "Túi rác 5L", key: "Tui_rac5", value: "0" },
  { id: 21, title: "Giấy vệ sinh 235mm", key: "giayvs_235", value: "0" },
  { id: 22, title: "Giấy vệ sinh 120mm", key: "giaivs_120", value: "0" },
  { id: 23, title: "Giấy lau tay", key: "giay_lau_tay", value: "0" },
  { id: 24, title: "Hóa chất làm sạch", key: "hoa_chat", value: "0" },
  { id: 25, title: "Nước rửa tay", key: "nuoc_rua_tay", value: "0" },
  { id: 26, title: "Nhiệt độ", key: "nhiet_do", value: "0" },
  { id: 27, title: "Nước bù bể", key: "nuoc_bu", value: "0" },
  { id: 28, title: "Clo", key: "clo", value: "0" },
  { id: 29, title: "Nồng độ PH", key: "PH", value: "0" },
  { id: 30, title: "Poolblock", key: "Poolblock", value: "0" },
  { id: 31, title: "Trạt thải", key: "trat_thai", value: "0" },
  { id: 32, title: "pH Minus", key: "pHMINUS", value: "0" },
  { id: 33, title: "Axit", key: "axit", value: "0" },
  { id: 34, title: "PN180", key: "PN180", value: "0" },
  { id: 35, title: "Chỉ số CO2", key: "chiSoCO2", value: "0" },
  { id: 36, title: "Clorin", key: "clorin", value: "0" },
  { id: 37, title: "NaOCL", key: "NaOCL", value: "0" },
];

const DetailHSSE = ({ navigation, route }) => {
  const { data, setIsReload } = route.params;
  const { authToken } = useSelector((state) => state.authReducer);
  const [hsseData, setHsseData] = useState(HSSE);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const isToday = moment(data?.Ngay_ghi_nhan).isSame(moment(), "day");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updatedHSSE = HSSE.map((item) => ({
      ...item,
      value:
        data[item.key] !== undefined ? data[item.key].toString() : item.value,
    }));
    setHsseData(updatedHSSE);
  }, [data]);

  const handleInputChange = (key, value) => {
    setHsseData((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const groupedData = useMemo(() => {
    const result = [];
    for (let i = 0; i < hsseData.length; i += 2) {
      result.push([hsseData[i], hsseData[i + 1] || null]);
    }
    return result;
  }, [hsseData]);

  const showAlert = (message, key = false) => {
    Alert.alert("PMC Thông báo", message, [
      {
        text: "Xác nhận",
        onPress: () =>
          key
            ? navigation.navigate("Báo cáo HSSE")
            : console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  const handleUpdate = async () => {
    const filteredReport = hsseData.reduce((acc, item) => {
      const floatValue = parseFloat(item.value.replace(",", "."));
      acc[item.key] = floatValue;
      return acc;
    }, {});

    const dataReq = {
      data: filteredReport,
      Ngay: data?.Ngay_ghi_nhan,
    };

    setIsLoadingSubmit(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/hsse/update/${data.ID}`,
        dataReq,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

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
        showAlert(
          error.response.data?.message || "Lỗi từ máy chủ. Vui lòng thử lại",
          false
        );
      } else if (error.request) {
        // Lỗi kết nối
        showAlert(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối",
          false
        );
      } else {
        // Lỗi khác
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
          return (
            <View key={subItem.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{subItem.title}</Text>
              <TextInput
                style={[styles.input]}
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
    []
  );

  const keyExtractor = useCallback((item, index) => `group-${index}`, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ImageBackground
          source={require("../../../assets/bg.png")}
          resizeMode="cover"
          style={styles.flex}
        >
          {isLoadingSubmit && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.bg_white} />
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
                handleUpdate();
              }}
            >
              <Text style={styles.submitButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          )}

          <CustomAlertModal
            isVisible={isModalVisible}
            title="PMC Thông báo"
            message={
              <RenderHTML contentWidth={300} source={{ html: message }} />
            }
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});

export default DetailHSSE;
