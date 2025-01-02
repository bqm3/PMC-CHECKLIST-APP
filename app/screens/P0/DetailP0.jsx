import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useContext,
} from "react";
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
} from "react-native";
import { useSelector } from "react-redux";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import adjust from "../../adjust";
import moment from "moment";
import axios from "axios";
import { COLORS } from "../../constants/theme";
import { BASE_URL } from "../../constants/config";
import { ReloadContext } from "../../context/ReloadContext";

const P0 = [
  {
    id: 0,
    title: "Xe ô tô thường",
    key: "Slxeoto",
    value: "0",
  },
  {
    id: 1,
    title: "Xe ô tô điện",
    key: "Slxeotodien",
    value: "0",
  },
  { id: 2, title: "Xe máy điện", key: "Slxemaydien", value: "0" },
  {
    id: 3,
    title: "Xe máy thường",
    key: "Slxemay",
    value: "0",
  },
  { id: 4, title: "Xe đạp điện", key: "Slxedapdien", value: "0" },
  {
    id: 5,
    title: "Xe đạp thường",
    key: "Slxedap",
    value: "0",
  },
  { id: 6, title: "Thẻ xe ô tô", key: "Sltheoto", value: "0" },
  { id: 7, title: "Thẻ xe máy", key: "Slthexemay", value: "0" },
  {
    id: 8,
    title: "Sự cố xe ô tô thường",
    key: "Slscoto",
    value: "0",
  },
  {
    id: 9,
    title: "Sự cố xe ô tô điện",
    key: "Slscotodien",
    value: "0",
  },
  {
    id: 10,
    title: "Sự cố xe máy điện",
    key: "Slscxemaydien",
    value: "0",
  },
  {
    id: 11,
    title: "Sự cố xe máy thường",
    key: "Slscxemay",
    value: "0",
  },
  {
    id: 12,
    title: "Sự cố xe đạp điện",
    key: "Slscxedapdien",
    value: "0",
  },
  {
    id: 13,
    title: "Sự cố xe đạp thường",
    key: "Slscxedap",
    value: "0",
  },
  {
    id: 14,
    title: "Sự cố khác",
    key: "Slsucokhac",
    value: "0",
  },
  {
    id: 15,
    title: "Công tơ điện",
    key: "Slcongto",
    value: "0",
  },
  {
    id: 16,
    title: "Quân số thực tế",
    key: "QuansoTT",
    value: "0",
  },
  {
    id: 17,
    title: "Quân số định biên",
    key: "QuansoDB",
    value: "0",
  },
  {
    id: 18,
    title: "Doanh thu từ 6 đến 18h",
    key: "Doanhthu",
    value: "0",
  },
];

const DetailP0 = ({ navigation, route }) => {
  const { data } = route.params;
   const { isReload, setIsReload } = useContext(ReloadContext);
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [p0_Data, setP0_Data] = useState(P0);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const isToday = moment(data?.Ngaybc).isSame(moment(), "day");
  const [ghichu, setGhichu] = useState(data?.Ghichu);

  const scrollViewRef = useRef(null);
  const noteInputRef = useRef(null);
  const noteContainerRef = useRef(null);

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

  useEffect(() => {
    const updatedP0 = P0.map((item) => ({
      ...item,
      value:
        data[item.key] !== undefined ? data[item.key].toString() : item.value,
    }));
    setP0_Data(updatedP0);
  }, [data]);

  const handleInputChange = (key, value) => {
    setP0_Data((prev) =>
      prev.map((item) => (item.key == key ? { ...item, value } : item))
    );
  };

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
        onPress: () =>
          key
            ? navigation.navigate("Báo cáo P0")
            : console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };
  const handleAlertUpdate = () => {
    Alert.alert(
      "PMC Thông báo",
      "Bạn có chắc muốn cập nhật báo cáo ngày " +
        moment(data?.Ngaybc).format("DD/MM/YYYY") +
        "?",
      [
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
      ]
    );
  }

  const handleUpdate = async () => {
    const filteredReport = p0_Data.reduce((acc, item) => {
      const floatValue = parseFloat(item.value.replace(",", "."));
      acc[item.key] = floatValue;
      return acc;
    }, {});

    filteredReport.Ghichu = ghichu;

    const dataReq = {
      data: filteredReport,
      Ngay: data?.Ngay_ghi_nhan,
    };

    setIsLoadingSubmit(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/p0/update/${data.ID_P0}`,
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
        showAlert("Cập nhật thành công", true);
        setIsReload(true);
      } else {
        showAlert("Có lỗi xảy ra khi cập nhật", false);
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

  const editable = (id) => {
    let check = false;
    if (user?.ID_KhoiCV == 4 && id == 18) {
      check = true;
    } else if (user?.ID_KhoiCV == 3 && id != 18) {
      check = true;
    } else if (user?.ID_KhoiCV == null) {
      check = true;
    }
    return check;
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {item.map((subItem) => {
        if (!subItem) return null;
        return (
          <View
            key={subItem.id}
            style={[
              styles.itemContainer,
              {
                backgroundColor: editable(subItem.id) ? "white" : "gray",
              },
            ]}
          >
            <Text
              style={[
                styles.itemTitle,
                { color: editable(subItem.id) ? "black" : "white" },
              ]}
            >
              {subItem.title}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: editable(subItem.id) ? "white" : "gray",
                  color: editable(subItem.id) ? "black" : "white",
                },
              ]}
              value={subItem.value.toString()}
              onChangeText={(text) => handleInputChange(subItem.key, text)}
              placeholderTextColor="#888"
              keyboardType="numeric"
              returnKeyType="done"
              editable={editable(subItem.id) && isToday}
            />
          </View>
        );
      })}
    </View>
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
          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={groupedData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
            />
            <TouchableOpacity
              ref={noteContainerRef}
              style={styles.noteContainer}
              onPress={handleNotePress}
              activeOpacity={1}
            >
              <Text style={styles.text}>Ghi chú</Text>
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
          {isToday && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                Keyboard.dismiss();
                // handleUpdate();
                handleAlertUpdate()
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
  },
  multilineTextInput: {
    height: 70,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
});

export default DetailP0;
