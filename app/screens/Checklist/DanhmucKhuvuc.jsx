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

import {
  ent_toanha_get,
  ent_khoicv_get,
  ent_khuvuc_get,
} from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import ItemKhuVuc from "../../components/Item/ItemKhuVuc";
import ModalKhuvuc from "../../components/Modal/ModalKhuvuc";

const DanhmucCalamviec = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_toanha, ent_khuvuc, ent_khoicv } = useSelector(
    (state) => state.entReducer
  );
  const { user, authToken } = useSelector((state) => state.authReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [1, "20%", "30%", "80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    id_khuvuc: null,
  });

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  useEffect(() => {
    init_toanha();
    init_khuvuc();
    init_khoicv();
  }, []);

  const [dataInput, setDataInput] = useState({
    toanha: null,
    khoicv: null,
    makhuvuc: "",
    sothutu: null,
    qrcode: "",
    tenkhuvuc: "",
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (
      dataInput.makhuvuc === "" ||
      dataInput.khoicv === null ||
      dataInput.toanha === null ||
      dataInput.tenkhuvuc === ""
    ) {
      Alert.alert("PMC Thông báo", "Thiêu thông tin khu vực", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Toanha: dataInput.toanha,
        ID_KhoiCV: dataInput.khoicv,
        Sothutu: dataInput.sothutu,
        Makhuvuc: dataInput.makhuvuc,
        MaQrCode: dataInput.qrcode,
        Tenkhuvuc: dataInput.tenkhuvuc,
      };
      await axios
        .post(BASE_URL + "/ent_khuvuc/create", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_khoicv();
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

  const handleEditEnt = (data) => {
    setIsCheckUpdate({
      check: true,
      id_khuvuc: data.ID_Khuvuc,
    });
    handlePresentModalPress();
    setDataInput({
      toanha: data.ID_Toanha,
      khoicv: data.ID_KhoiCV,
      sothutu: data.Sothutu,
      makhuvuc: data.Makhuvuc,
      qrcode: data.MaQrCode,
      tenkhuvuc: data.Tenkhuvuc,
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
        ID_Toanha: dataInput.toanha,
        ID_KhoiCV: dataInput.khoicv,
        Sothutu: dataInput.sothutu,
        Makhuvuc: dataInput.makhuvuc,
        MaQrCode: dataInput.qrcode,
        Tenkhuvuc: dataInput.tenkhuvuc,
      };
      await axios
        .put(BASE_URL + `/ent_khuvuc/update/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_khuvuc();
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

  const handleAlertDelete = async (id) => {
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa khu vực làm việc", [
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
      .put(BASE_URL + `/ent_khuvuc/delete/${id}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        init_khuvuc();
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
  };

  const handleAdd = () => {
    setDataInput({
      toanha: null,
      khoicv: null,
      makhuvuc: "",
      sothutu: "",
      qrcode: "",
      tenkhuvuc: "",
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
                  <Text style={styles.danhmuc}>Danh mục khu vực</Text>

                  {ent_khuvuc && ent_khuvuc.length > 0 ? (
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
                          Số lượng: {decimalNumber(ent_khuvuc?.length)}
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
                        data={ent_khuvuc}
                        renderItem={({ item, index }) => (
                          <ItemKhuVuc
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
                  <ModalKhuvuc
                    ent_khoicv={ent_khoicv}
                    ent_toanha={ent_toanha}
                    handleChangeText={handleChangeText}
                    dataInput={dataInput}
                    handlePushDataSave={handlePushDataSave}
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
