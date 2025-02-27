import React, { useState, useCallback, useMemo, useRef, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Platform, KeyboardAvoidingView, Keyboard, TouchableOpacity, ImageBackground, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import { COLORS } from "../../constants/theme";
import { ReloadContext } from "../../context/ReloadContext";
import WarningBox from "../../components/Warning/WarningBox";

const P0 = [
  { id: 0, title: "Thẻ ô tô đã giao", key: "Sotheotodk", value: "0" },
  { id: 1, title: "Thẻ xe máy đã giao", key: "Sothexemaydk", value: "0" },
  { id: 2, title: "Xe ô tô thường", key: "Slxeoto", value: "0" },
  { id: 3, title: "Xe ô tô điện", key: "Slxeotodien", value: "0" },
  { id: 4, title: "Xe máy điện", key: "Slxemaydien", value: "0" },
  { id: 5, title: "Xe máy thường", key: "Slxemay", value: "0" },
  { id: 6, title: "Xe đạp điện", key: "Slxedapdien", value: "0" },
  { id: 7, title: "Xe đạp thường", key: "Slxedap", value: "0" },
  { id: 8, title: "Thẻ xe ô tô chưa sử dụng", key: "Sltheoto", value: "0" },
  { id: 9, title: "Thẻ xe máy chưa sử dụng", key: "Slthexemay", value: "0" },
  { id: 10, title: "Sự cố xe ô tô thường", key: "Slscoto", value: "0" },
  { id: 11, title: "Sự cố xe ô tô điện", key: "Slscotodien", value: "0" },
  { id: 12, title: "Sự cố xe máy điện", key: "Slscxemaydien", value: "0" },
  { id: 13, title: "Sự cố xe máy thường", key: "Slscxemay", value: "0" },
  { id: 14, title: "Sự cố xe đạp điện", key: "Slscxedapdien", value: "0" },
  { id: 15, title: "Sự cố xe đạp thường", key: "Slscxedap", value: "0" },
  { id: 16, title: "Sự cố khác", key: "Slsucokhac", value: "0" },
  { id: 17, title: "Công tơ điện", key: "Slcongto", value: "0" },
  { id: 18, title: "Quân số thực tế", key: "QuansoTT", value: "0" },
  { id: 19, title: "Quân số định biên", key: "QuansoDB", value: "0" },
  {
    id: 20,
    title: "Doanh thu từ 16h hôm trước đến 16h hôm nay",
    key: "Doanhthu",
    value: "0",
  },
];

const TaoBaoCaoP0 = ({ navigation, route }) => {
  // const { setIsReload } = route.params;
  const { isReload, setIsReload } = useContext(ReloadContext);
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [p0_Data, setP0_Data] = useState(P0);
  const [ghichu, setGhichu] = useState("");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [totalCars, setTotalCars] = useState(0);
  const [totalMotorcycles, setTotalMotorcycles] = useState(0);
  const [isCars, setIsCars] = useState(false);
  const [isMotorcycles, setIsMotorcycles] = useState(false);

  const scrollViewRef = useRef(null);
  const noteInputRef = useRef(null);
  const noteContainerRef = useRef(null);

  useEffect(() => {
    getSoThe();
  }, [authToken]);


  const report = useMemo(() => {
    if (p0_Data.length === 0) return {};

    return p0_Data.reduce((acc, item) => {
      const floatValue = parseFloat(item.value.replace(",", ".")) || 0;
      acc[item.key] = floatValue;
      return acc;
    }, {});
  }, [p0_Data]);

  useEffect(() => {
    setTotalCars((report.Slxeoto || 0) + (report.Slxeotodien || 0) + (report.Sltheoto || 0));
    setTotalMotorcycles((report.Slxemay || 0) + (report.Slxemaydien || 0) + (report.Slthexemay || 0));
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

  const handleChange = useCallback((id, value) => {
    setP0_Data((prevState) => prevState.map((item) => (item.id === id ? { ...item, value: value } : item)));
  }, []);

  const groupedData = useMemo(() => {
    const result = [];
    for (let i = 0; i < p0_Data.length; i += 2) {
      result.push([p0_Data[i], p0_Data[i + 1] || null]);
    }
    return result;
  }, [p0_Data]);

  const showAlert = (message, key = false) => {
    Alert.alert("PMC Thông báo", message, [
      {
        text: "Xác nhận",
        onPress: () => (key ? navigation.navigate("Báo cáo S0") : console.log("Cancel Pressed")),
        style: "cancel",
      },
    ]);
  };

  const checkSubmit = async () => {
    Alert.alert("PMC Thông báo", "Bạn có chắc chắn muốn gửi không?", [
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

  const getSoThe = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/p0/so-the-phat-hanh`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      setP0_Data((prevData) =>
        prevData.map((item) => {
          if (item.key === "Sotheotodk")
            return {
              ...item,
              value: `${res.data?.data?.Sotheotodk}` != `null` ? `${res.data?.data?.Sotheotodk}` : 0,
            };
          if (item.key === "Sothexemaydk")
            return {
              ...item,
              value: `${res.data?.data?.Sotheotodk}` != `null` ? `${res.data?.data?.Sothexemaydk}` : 0,
            };
          return item;
        })
      );
    } catch (error) {
      showAlert("Đã có lỗi xảy ra. Vui lòng thử lại", false);
    }
  };

  const handleSubmit = async () => {
    // const filteredReport = p0_Data.reduce((acc, item) => {
    //   const floatValue = parseFloat(item.value.replace(",", "."));
    //   acc[item.key] = floatValue;
    //   return acc;
    // }, {});

    // filteredReport.Ghichu = ghichu;
    report.Ghichu = ghichu;
    setIsLoadingSubmit(true);

    try {
      const response = await axios.post(`${BASE_URL}/p0/create`, report, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Kiểm tra response status
      if (response.status == 200 || response.status == 201) {
        showAlert("Gửi báo cáo thành công", true);
        setIsReload(true);
        setP0_Data(P0);
      } else {
        showAlert("Có lỗi xảy ra khi gửi báo cáo", false);
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

  const editable = (id) => {
    let check = false;
    if (user?.ID_KhoiCV == 4 && id == 20) {
      check = true;
    } else if (user?.ID_KhoiCV == 3 && id != 20) {
      check = true;
    } else if (user?.ID_KhoiCV == null) {
      check = true;
    }
    return check;
  };

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        {item?.map((subItem) => {
          if (!subItem) return null;
          return (
            <View
              key={subItem?.id}
              style={[
                styles.itemContainer,
                {
                  backgroundColor: editable(subItem?.id) ? "white" : "gray",
                },
              ]}
            >
              <Text style={[styles.itemTitle, { color: editable(subItem?.id) ? "black" : "white" }]}>{subItem?.title}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: editable(subItem?.id) ? "white" : "gray",
                    color: editable(subItem?.id) ? "black" : "white",
                  },
                ]}
                value={subItem?.value.toString()}
                onChangeText={(text) => handleChange(subItem?.id, text)}
                placeholderTextColor="#888"
                keyboardType="numeric"
                returnKeyType="done"
                editable={editable(subItem?.id)}
              />
            </View>
          );
        })}
      </View>
    ),
    [handleChange]
  );

  const keyExtractor = useCallback((item, index) => `group-${index}`, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ImageBackground source={require("../../../assets/bg.png")} resizeMode="cover" style={styles.flex}>
          {isLoadingSubmit && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.bg_white} />
            </View>
          )}
          <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <FlatList data={groupedData} renderItem={renderItem} keyExtractor={keyExtractor} contentContainerStyle={styles.listContent} scrollEnabled={false} />
            <TouchableOpacity ref={noteContainerRef} style={styles.noteContainer} onPress={handleNotePress} activeOpacity={1}>
              <Text style={styles.text}>Ghi chú</Text>
              <TextInput
                ref={noteInputRef}
                value={ghichu}
                placeholder="Thêm ghi chú"
                placeholderTextColor="gray"
                multiline
                returnKeyType="done"
                blurOnSubmit
                onChangeText={setGhichu}
                onFocus={handleNoteFocus}
                onSubmitEditing={Keyboard.dismiss}
                style={[styles.textInput, styles.multilineTextInput]}
              />
            </TouchableOpacity>
          </ScrollView>

          {isCars && (
            <WarningBox
              title="Số lượng thẻ xe ô tô không khớp"
              content={`
                        <span><strong>Tổng:</strong> xe thường (${report.Slxeoto}) + xe điện (${report.Slxeotodien}) + chưa sử dụng (${report.Sltheoto}) 
                        = ${report.Slxeoto + report.Slxeotodien + report.Sltheoto}</span></br>
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
                        <span><strong>Tổng:</strong> xe thường (${report.Slxemay}) + xe điện (${report.Slxemaydien}) + chưa sử dụng (${report.Slthexemay})
                        = ${report.Slxemay + report.Slxemaydien + report.Slthexemay}</span></br>
                        <span>Số thẻ xe máy đã bàn giao = ${report.Sothexemaydk}</span></br>
                        <span style="color:red;">Vui lòng kiểm tra lại dữ liệu trước khi gửi</span>
                      `}
              style={{ marginHorizontal: 10 }}
            />
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              Keyboard.dismiss();
              checkSubmit();
            }}
          >
            <Text style={styles.submitButtonText}>Gửi báo cáo</Text>
          </TouchableOpacity>
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
  noteContainer: {
    borderRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingVertical: 4,
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
});

export default TaoBaoCaoP0;
