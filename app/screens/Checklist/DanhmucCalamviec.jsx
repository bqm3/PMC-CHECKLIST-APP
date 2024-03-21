import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ItemCalamviec from "../../components/Item/ItemCalamviec";

import { ent_khoicv_get, ent_calv_get } from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import ModalCalamviec from "../../components/Modal/ModalCalamviec";

const DanhmucCalamviec = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_khoicv, ent_calv } = useSelector((state) => state.entReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [1, "20%", "30%", "80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    id_calv: null,
  });

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_calv = async () => {
    await dispath(ent_calv_get());
  };

  useEffect(() => {
    init_khoicv();
    init_calv();
  }, []);

  const dateHour = moment(new Date()).format("LT");
  const [dataInput, setDataInput] = useState({
    tenca: "",
    giobd: dateHour,
    giokt: dateHour,
    khoicv: null,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (dataInput.tenca === "" || dataInput.khoicv === null) {
      Alert.alert("PMC Thông báo", "Thiêu thông tin ca làm việc", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        Tenca: dataInput.tenca,
        Giobatdau: dataInput.giobd,
        Gioketthuc: dataInput.giokt,
        ID_KhoiCV: dataInput.khoicv,
        ID_Duan: user.ID_Duan,
      };
      await axios
        .post(BASE_URL + "/ent_calv/create", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_calv();
          handleAdd();
          handleCloseModal();
          Alert.alert("PMC Thông báo", response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        });
    }
  };

  const handleEditEnt = async (id) => {
    await axios
      .get(BASE_URL + `/ent_calv/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        const data = response.data.data;
        handlePresentModalPress();
        setDataInput({
          tenca: data.Tenca,
          giobd: data.Giobatdau,
          giokt: data.Gioketthuc,
          khoicv: data.ID_KhoiCV,
        });
        setIsCheckUpdate({
          check: true,
          id_calv: id,
        });
      })
      .catch((err) => {
        Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.tenca === "" || dataInput.khoicv === null) {
      Alert.alert("PMC Thông báo", "Thiêu thông tin ca làm việc", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        Tenca: dataInput.tenca,
        Giobatdau: dataInput.giobd,
        Gioketthuc: dataInput.giokt,
        ID_KhoiCV: dataInput.khoicv,
        ID_Duan: user.ID_Duan,
      };
      await axios
        .put(BASE_URL + `/ent_calv/update/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_calv();
          handleAdd();
          handleCloseModal();
          Alert.alert("PMC Thông báo", response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        });
    }
  };

  const handleAlertDelete = async(id) => {
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa ca làm việc", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xác nhận", onPress: () => handlePushDataDelete(id) },
    ]);
  };

  const handlePushDataDelete = async (id) => {
    await axios
        .put(BASE_URL + `/ent_calv/delete/${id}`,[], {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
      .then((response) => {
        init_calv();
        handleAdd();
        handleCloseModal();
        Alert.alert("PMC Thông báo", response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((err) => {
        console.log('err0',err)
        Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      });
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    giobd: false,
    giokt: false,
  });

  const showDatePicker = (key) => {
    setDatePickerVisibility((data) => ({
      ...data,
      [key]: true,
    }));
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (key, date) => {
    handleChangeText(key, moment(date).format("LT"));
    hideDatePicker();
  };

  const handleAdd = () => {
    setDataInput({
      tenca: "",
      giobd: dateHour,
      giokt: dateHour,
      khoicv: null,
    });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    if (index === -1 || index === 0) {
      setOpacity(1);
    } else {
      setOpacity(0.5);
    }
  }, []);

  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  const decimalNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  width: "100%",
                  opacity: opacity,
                }}
              >
                <View style={styles.container}>
                  <Text style={styles.danhmuc}>Danh mục làm việc</Text>
                  {/* {
                  isLoading && <View style={{flex: 1,justifyContent:'center', alignContent:'center'}}>
                    <ActivityIndicator />
                  </View>
                } */}
                  {ent_calv && ent_calv.length > 0 ? (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.text}>
                          Số lượng: {decimalNumber(ent_calv?.length)}
                        </Text>
                        <ButtonChecklist
                          text={"Thêm mới"}
                          width={"auto"}
                          color={COLORS.bg_button}
                          icon={<Ionicons name="add" size={24} color="white" />}
                          onPress={handlePresentModalPress}
                        />
                      </View>

                      <FlatList
                        horizontal={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={{ marginVertical: 10 }}
                        data={ent_calv}
                        renderItem={({ item, index }) => (
                          <ItemCalamviec
                            key={index}
                            item={item}
                            handleEditEnt={handleEditEnt}
                            handleAlertDelete={handleAlertDelete}
                          />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEventThrottle={16}
                        ListFooterComponent={<View style={{ height: 120 }} />}
                        scrollEnabled={true}
                      />
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 100,
                        }}
                      >
                        <Image
                          source={require("../../../assets/icons/delete_bg.png")}
                          resizeMode="contain"
                          style={{ height: 120, width: 120 }}
                        />
                        <Text style={[styles.danhmuc, { paddingVertical: 10 }]}>
                          Bạn chưa thêm dữ liệu nào
                        </Text>
                        <ButtonChecklist
                          text={"Thêm mới"}
                          width={"auto"}
                          color={COLORS.bg_button}
                          onPress={handleAdd}
                        />
                      </View>
                    </>
                  )}
                </View>
              </View>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={3}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
              >
                <BottomSheetScrollView style={styles.contentContainer}>
                  <ModalCalamviec
                    ent_khoicv={ent_khoicv}
                    handleChangeText={handleChangeText}
                    showDatePicker={showDatePicker}
                    isDatePickerVisible={isDatePickerVisible}
                    handleConfirm={handleConfirm}
                    hideDatePicker={hideDatePicker}
                    dataInput={dataInput}
                    handlePushDataSave={handlePushDataSave}
                    handleEditEnt={handleEditEnt}
                    isCheckUpdate={isCheckUpdate}
                    handlePushDataEdit={handlePushDataEdit}
                  />
                </BottomSheetScrollView>
              </BottomSheetModal>
            </ImageBackground>
          </BottomSheetModalProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
    paddingVertical: 40,
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 36,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    marginTop: 10,
    height: 36,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  head: {
    backgroundColor: COLORS.bg_main,
    // height: 30
  },
  headText: {
    textAlign: "center",
    color: COLORS.text_main,
  },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
});

export default DanhmucCalamviec;
