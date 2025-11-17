import React, { useState, useCallback, useMemo, useRef, useEffect, useContext } from "react";
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
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";
import moment from "moment";
import axios from "axios";
import { COLORS } from "../../constants/theme";
import { BASE_URL } from "../../constants/config";
import { ReloadContext } from "../../context/ReloadContext";
import WarningBox from "../../components/Warning/WarningBox";

// Field categories for grouping data fields
const fieldCategories = {
  "Thông tin thẻ": ["Sotheotodk", "Sothexemaydk"],
  "Thông tin tồn ảo": ["the_ton_ao", "tien_ton_ao"],
  "Thông tin kiểm kê tại quầy": ["Sltheoto", "Slthexemay", "Sltheotophanmem", "Slthexemayphanmem"],
  "Thông tin xe": ["Slxeoto", "Slxeotodien", "Slxemay", "Slxemaydien", "Slxedap", "Slxedapdien"],
  "Sự cố": ["Slscoto", "Slscotodien", "Slscxemay", "Slscxemaydien", "Slscxedap", "Slscxedapdien", "Slsucokhac"],
  "Thông tin nhân sự an ninh": ["QuansoTT", "QuansoDB", "Slcongto", "ns_nghiphep", "ns_tangca", "ns_vipham", "ns_phatsinh"],
  "Số lượng quân tư trang/ SL cấp phát": ["coi", "gay_giao_thong", "ao_mua", "den_pin"],
  "Doanh thu": ["Doanhthu"],
  "Ghi chú": ["Ghichu"],
};

// Map for field labels
const fieldLabels = {
  Slxeoto: "Xe ô tô thường",
  Slxeotodien: "Xe ô tô điện",
  Slxemaydien: "Xe máy điện",
  Slxemay: "Xe máy thường",
  Slxedapdien: "Xe đạp điện",
  Slxedap: "Xe đạp thường",
  Sotheotodk: "Thẻ ô tô đã bàn giao",
  Sothexemaydk: "Thẻ xe máy đã bàn giao",
  Sltheoto: "Thẻ ô tô chưa sử dụng",
  Slthexemay: "Thẻ xe máy chưa sd",
  Slscoto: "Sự cố xe ô tô thường",
  Slscotodien: "Sự cố xe ô tô điện",
  Slscxemaydien: "Sự cố xe máy điện",
  Slscxemay: "Sự cố xe máy thường",
  Slscxedapdien: "Sự cố xe đạp điện",
  Slscxedap: "Sự cố xe đạp thường",
  Slsucokhac: "Sự cố khác",
  Slcongto: "Công tơ điện",
  QuansoTT: "Quân số thực tế",
  QuansoDB: "Quân số định biên",
  Doanhthu: "Doanh thu từ 16h hôm trước đến 16h hôm nay",
  Ghichu: "Ghi chú",
  Sltheotophanmem: "Thẻ ô tô sử dụng trên phần mềm",
  Slthexemayphanmem: "Thẻ xe máy sử dụng trên phần mềm",
  ns_nghiphep: "Nhân sự nghỉ phép",
  ns_tangca: "Nhân sự tăng ca",
  ns_vipham: "Quân số vi phạm lập biên bản đang có",
  ns_phatsinh: "Vụ sự phát sinh trong ca",
  coi: "Còi",
  gay_giao_thong: "Gậy giao thông",
  ao_mua: "Áo mưa",
  den_pin: "Đèn pin",
  the_ton_ao: "Thẻ tồn ảo",
  tien_ton_ao: "Tiền tồn ảo",
};

// Initialize P0 data structure based on field categories
const initP0Data = () => {
  let id = 0;
  const data = [];

  // Flatten the field categories into a single array
  Object.values(fieldCategories).forEach((categoryFields) => {
    categoryFields.forEach((fieldKey) => {
      if (fieldKey !== "Ghichu") {
        // Handle Ghichu separately
        data.push({
          id: id++,
          title: fieldLabels[fieldKey],
          key: fieldKey,
          value: "0",
        });
      }
    });
  });

  return data;
};

const DetailP0 = ({ navigation, route }) => {
  const { data } = route.params;
  const { isReload, setIsReload } = useContext(ReloadContext);
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [p0_Data, setP0_Data] = useState(initP0Data());
  const [qtt, setQTT] = useState();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const isToday = moment(data?.Ngaybc).isSame(moment(), "day");
  const [ghichu, setGhichu] = useState(data?.Ghichu);
  const [totalCars, setTotalCars] = useState(0);
  const [totalMotorcycles, setTotalMotorcycles] = useState(0);
  const [isCars, setIsCars] = useState(false);
  const [isMotorcycles, setIsMotorcycles] = useState(false);

  const scrollViewRef = useRef(null);
  const noteInputRef = useRef(null);
  const noteContainerRef = useRef(null);

  const report = useMemo(() => {
    if (p0_Data.length === 0) return {};

    return p0_Data.reduce((acc, item) => {
      const floatValue = parseFloat(item?.value?.replace(",", ".")) || 0;
      acc[item.key] = floatValue;
      return acc;
    }, {});
  }, [p0_Data]);

  useEffect(() => {
    getSoThe();
  }, [authToken]);

  useEffect(() => {
    setTotalCars((report.Sltheoto || 0) + (report.Sltheotophanmem || 0));
    setTotalMotorcycles((report.Slthexemay || 0) + (report.Slthexemayphanmem || 0));
  }, [report]);

  useEffect(() => {
    if (totalCars !== (report.Sotheotodk || 0)) {
      setIsCars(true);
    } else {
      setIsCars(false);
    }
  }, [totalCars, report]);

  useEffect(() => {
    if (totalMotorcycles !== (report.Sothexemaydk || 0)) {
      setIsMotorcycles(true);
    } else {
      setIsMotorcycles(false);
    }
  }, [totalMotorcycles, report]);

  useEffect(() => {
    // Load data from route params into state
    const updatedP0 = p0_Data.map((item) => ({
      ...item,
      value: data[item.key] !== undefined ? data[item.key]?.toString() : item.value,
    }));
    setP0_Data(updatedP0);
  }, [data]);

  const handleNotePress = () => {
    noteInputRef.current?.focus();
  };

  const handleNoteFocus = () => {
    setTimeout(
      () => {
        noteContainerRef.current?.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y,
              animated: true,
            });
          },
          () => console.log("measurement failed")
        );
      },
      Platform.OS === "ios" ? 250 : 50
    );
  };

  const handleInputChange = (id, value) => {
    setP0_Data((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
  };

  const showAlert = (message, key = false) => {
    Alert.alert("Thông báo", message, [
      {
        text: "Xác nhận",
        onPress: () => (key ? navigation.navigate("Báo cáo S0") : console.log("Cancel Pressed")),
        style: "cancel",
      },
    ]);
  };

  const handleAlertUpdate = () => {
    Alert.alert("Thông báo", "Bạn có chắc muốn cập nhật báo cáo ngày " + moment(data?.Ngaybc).format("DD/MM/YYYY") + "?", [
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
    report.Ghichu = ghichu;

    const dataReq = {
      data: report,
      Ngay: data?.Ngay_ghi_nhan,
    };

    setIsLoadingSubmit(true);
    try {
      const response = await axios.put(`${BASE_URL}/p0/update/${data.ID_P0}`, dataReq, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Kiểm tra response status
      if (response.status == 200 || response.status == 201) {
        showAlert("Cập nhật thành công", true);
        setIsReload(true);
      } else {
        showAlert("Có lỗi xảy ra khi cập nhật", false);
      }
    } catch (error) {
      if (error.response) {
        showAlert(error.response.data?.message || "Lỗi từ máy chủ. Vui lòng thử lại", false);
      } else if (error.request) {
        // Lỗi kết nối
        showAlert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối", false);
      } else {
        // Lỗi khác
        showAlert("Đã có lỗi xảy ra. Vui lòng thử lại", false);
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const getSoThe = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/s0-thaydoithe/${user?.ID_Duan}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      setQTT(res.data?.data);
      setP0_Data((prevData) =>
        prevData.map((item) => {
          if (item.key === "Sotheotodk")
            return {
              ...item,
              value: `${res.data?.data?.sltheoto}` != `null` ? `${res.data?.data?.sltheoto}` : "0",
            };
          if (item.key === "Sothexemaydk")
            return {
              ...item,
              value: `${res.data?.data?.slthexemay}` != `null` ? `${res.data?.data?.slthexemay}` : "0",
            };
          return item;
        })
      );
    } catch (error) {
      showAlert("Đã có lỗi xảy ra. Vui lòng thử lại", false);
    }
  };

  const editable = (fieldKey) => {
    if (fieldKey === "Sotheotodk" || fieldKey === "Sothexemaydk") {
      return false;
    }

    let check = false;
    const arrKhoiParsed = user?.arr_Khoi?.split(",").map(Number);

    if (
      (user?.ID_KhoiCV == 4 || arrKhoiParsed?.includes(4)) &&
      ["Sltheoto", "Slthexemay", "Sltheotophanmem", "Slthexemayphanmem"].includes(fieldKey)
    ) {
      check = true;
    } else if (
      (user?.ID_KhoiCV == 3 || arrKhoiParsed?.includes(3)) &&
      !["Sltheoto", "Slthexemay", "Sltheotophanmem", "Slthexemayphanmem", "Doanhthu"].includes(fieldKey)
    ) {
      check = true;
    } else if (user?.ID_KhoiCV == null) {
      check = true;
    } else if (`${user?.isCheckketoan}` === `1` && fieldKey === "Doanhthu") {
      check = true;
    }
    return check && isToday;
  };

  // Render a category section
  const renderCategory = (category, index) => {
    const fields = fieldCategories[category];

    // Filter out 'Ghichu' since it's handled separately
    const filteredFields = fields.filter((field) => field !== "Ghichu");

    if (filteredFields.length === 0) return null;

    // Create pairs of fields for the row layout
    const pairs = [];
    for (let i = 0; i < filteredFields.length; i += 2) {
      const pair = [filteredFields[i]];
      if (i + 1 < filteredFields.length) {
        pair.push(filteredFields[i + 1]);
      }
      pairs.push(pair);
    }

    const getDisplayLabel = (fieldKey) => {
      if (fieldKey === "coi" || fieldKey === "gay_giao_thong" || fieldKey === "ao_mua" || fieldKey === "den_pin") {
        return `${fieldLabels[fieldKey]} - (${qtt?.[fieldKey] || 0})`;
      }
      return fieldLabels[fieldKey];
    };

    return (
      <View key={index} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {pairs.map((pair, pairIndex) => (
          <View key={pairIndex} style={styles.row}>
            {pair.map((fieldKey) => {
              // Find the corresponding item in p0_Data
              const item = p0_Data.find((item) => item.key === fieldKey);
              if (!item) return null;

              return (
                <View
                  key={fieldKey}
                  style={[
                    styles.itemContainer,
                    // Apply full width style if it's the only item in the pair
                    pair.length === 1 && styles.fullWidthItem,
                    {
                      backgroundColor: editable(fieldKey) ? "white" : "gray",
                    },
                  ]}
                >
                  <Text style={[styles.itemTitle, { color: editable(fieldKey) ? "black" : "white" }]}> {getDisplayLabel(fieldKey)}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: editable(fieldKey) ? "white" : "gray",
                        color: editable(fieldKey) ? "black" : "white",
                      },
                    ]}
                    value={item?.value?.toString()}
                    onChangeText={(text) => handleInputChange(item.id, text)}
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    returnKeyType="done"
                    editable={editable(fieldKey)}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ImageBackground source={require("../../../assets/bg.png")} resizeMode="cover" style={styles.flex}>
          {isLoadingSubmit && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.bg_white} />
            </View>
          )}

          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Render each category */}
            {Object.keys(fieldCategories).map((category, index) => category !== "Ghi chú" && renderCategory(category, index))}

            {/* Render Ghi chú separately */}
            <TouchableOpacity ref={noteContainerRef} style={styles.noteContainer} onPress={handleNotePress} activeOpacity={1}>
              <Text style={styles.categoryTitle}>Ghi chú</Text>
              <TextInput
                ref={noteInputRef}
                value={ghichu}
                placeholder="Ghi chú"
                placeholderTextColor="gray"
                multiline
                returnKeyType="done"
                blurOnSubmit
                onChangeText={setGhichu}
                onFocus={handleNoteFocus}
                onSubmitEditing={Keyboard.dismiss}
                style={[styles.textInput, styles.multilineTextInput]}
                editable={isToday}
              />
            </TouchableOpacity>
          </ScrollView>

          {isCars && (
            <WarningBox
              title="Số lượng thẻ xe ô tô không khớp"
              content={`
                <span><strong>Tổng:</strong> Thẻ ô tô chưa sử dụng (${report.Sltheoto}) + thẻ ô tô sử dụng trên phần mềm (${report.Sltheotophanmem})
                = ${report.Slxeoto + report.Sltheotophanmem}</span></br>
                <span>Số thẻ ô tô đã bàn giao = ${report.Sotheotodk}</span></br>
                <span style="color:red;">Vui lòng kiểm tra lại dữ liệu trước khi gửi</span>
              `}
              style={{ marginHorizontal: 10 }}
            />
          )}

          {isMotorcycles && (
            <WarningBox
              title="Số lượng thẻ xe máy không khớp"
              content={`
                <span><strong>Tổng:</strong> Thẻ xe máy chưa sử dụng (${report.Slthexemay}) + thẻ xe máy sử dụng trên phần mềm (${
                report.Slthexemayphanmem
              })
                = ${report.Slthexemay + report.Slthexemayphanmem}</span></br>
                <span>Số thẻ xe máy đã bàn giao = ${report.Sothexemaydk}</span></br>
                <span style="color:red;">Vui lòng kiểm tra lại dữ liệu trước khi gửi</span>
              `}
              style={{ marginHorizontal: 10 }}
            />
          )}

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
        </ImageBackground>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: adjust(18),
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
    marginLeft: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthItem: {
    flex: 2,
    marginHorizontal: 5,
  },
  itemTitle: {
    fontSize: adjust(14),
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
  noteContainer: {
    borderRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "white",
    textAlign: "left",
    textAlignVertical: "top",
    paddingTop: 10,
  },
  multilineTextInput: {
    height: 80,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginEnd: adjust(12),
  },
  closeIcon: {
    tintColor: "white",
    resizeMode: "contain",
    transform: [{ scale: 0.5 }],
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DetailP0;
