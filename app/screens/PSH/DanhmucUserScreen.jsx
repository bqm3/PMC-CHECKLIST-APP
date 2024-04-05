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
  Modal,
  Pressable,
  ActivityIndicator,
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
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";

import {
  ent_chucvu_get,
  ent_duan_get,
  ent_khoicv_get,
  ent_users_get,
} from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import ModalGiamsatInfo from "../../components/Modal/ModalGiamsatInfo";
import ItemUser from "../../components/Item/ItemUser";
import ModalUsers from "../../components/Modal/ModalUsers";

const DanhmucUserScreen = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_users, ent_duan, ent_khoicv, ent_chucvu } = useSelector(
    (state) => state.entReducer
  );
  const { user, authToken } = useSelector((state) => state.authReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    ID_User: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const init_duan = async () => {
    await dispath(ent_duan_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_chucvu = async () => {
    await dispath(ent_chucvu_get());
  };

  const init_users = async () => {
    await dispath(ent_users_get());
  };

  useEffect(() => {
    init_users();
    init_duan();
    init_chucvu();
    init_khoicv();
  }, []);

  const [dataInput, setDataInput] = useState({
    ID_Duan: null,
    Permission: null,
    ID_KhoiCV: null,
    UserName: "",
    Password: "",
    Emails: "",
    rePassword: "",
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (dataInput.UserName === "" || dataInput.Password === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin người dùng", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else if (dataInput.Password !== dataInput.rePassword) {
      Alert.alert("PMC Thông báo", "Mật khẩu phải trùng nhau", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Duan: dataInput.ID_Duan,
        Permission: dataInput.Permission,
        ID_KhoiCV: dataInput.ID_KhoiCV,
        UserName: dataInput.UserName,
        Password: dataInput.Password,
        Emails: dataInput.Emails,
      };
      setLoadingSubmit(true);
      await axios
        .post(BASE_URL + "/ent_user/register", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_users();
          handleAdd();
          handleCloseModal();
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", "Tạo tài khoản user thành công!!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.error("err", err);
          setLoadingSubmit(false);
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

  const handleEditEnt = async (data) => {
    handlePresentModalPress();
    setDataInput({
      ID_Duan: data.ID_Duan,
      Permission: data.Permission,
      ID_KhoiCV: data.ID_KhoiCV,
      UserName: data.UserName,
      Password: "",
      rePassword: "",
      Emails: data.Emails,
    });

    setIsCheckUpdate({
      check: true,
      ID_User: data.ID_User,
    });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.UserName === "" || dataInput.Password === null) {
      Alert.alert("PMC Thông báo", "Thiếu thông tin ca làm việc", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else if (dataInput.Password !== dataInput.rePassword) {
      Alert.alert("PMC Thông báo", "Mật khẩu phải trùng nhau", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Duan: dataInput.ID_Duan,
        Permission: dataInput.Permission,
        ID_KhoiCV: dataInput.ID_KhoiCV,
        UserName: dataInput.UserName,
        Password: dataInput.Password,
        Emails: dataInput.Emails,
      };
      setLoadingSubmit(true);

      await axios
        .put(BASE_URL + `/ent_user/update/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_users();
          handleAdd();
          handleCloseModal();
          setLoadingSubmit(false);
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
          console.log("err", err);
          setLoadingSubmit(false);
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
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa người dùng", [
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
      .put(BASE_URL + `/ent_user/delete/${id}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        init_users();
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

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleAdd = () => {
    setDataInput({
      ID_Duan: null,
      UserName: "",
      Password: "",
      Emails: "",
      rePassword: "",
      Permission: null,
      ID_KhoiCV: null,
    });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleToggleModal = (isCheck, data, opacity) => {
    setDataModal(data);
    setModalVisible(isCheck), setOpacity(opacity);
  };

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
                  <Text style={styles.danhmuc}>
                    Danh mục quản lý người dùng
                  </Text>
                  {isLoading === true ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 40,
                      }}
                    >
                      <ActivityIndicator size="large" color={"white"} />
                    </View>
                  ) : (
                    <>
                      {ent_users && ent_users.length > 0 ? (
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
                              Số lượng: {decimalNumber(ent_users?.length)}
                            </Text>
                            <ButtonChecklist
                              text={"Thêm mới"}
                              width={"auto"}
                              color={COLORS.bg_button}
                              // // icon={<Ionicons name="add" size={20} color="white" />}
                              onPress={() => {
                                handlePresentModalPress();
                                handleAdd();
                                setIsCheckUpdate({
                                  check: false,
                                  ID_User: null,
                                });
                              }}
                            />
                          </View>

                          <FlatList
                            horizontal={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            style={{ marginVertical: 10 }}
                            data={ent_users}
                            renderItem={({ item, index }) => (
                              <ItemUser
                                key={index}
                                item={item}
                                handleEditEnt={handleEditEnt}
                                handleAlertDelete={handleAlertDelete}
                                handleToggleModal={handleToggleModal}
                              />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEventThrottle={16}
                            ListFooterComponent={
                              <View style={{ height: 120 }} />
                            }
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
                            <Text
                              style={[styles.danhmuc, { paddingVertical: 10 }]}
                            >
                              Bạn chưa thêm dữ liệu nào
                            </Text>
                            <ButtonChecklist
                              text={"Thêm mới"}
                              width={"auto"}
                              color={COLORS.bg_button}
                              onPress={handlePresentModalPress}
                            />
                          </View>
                        </>
                      )}
                    </>
                  )}
                </View>
              </View>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
              >
                <BottomSheetScrollView style={styles.contentContainer}>
                  <ModalUsers
                    ent_chucvu={ent_chucvu}
                    ent_duan={ent_duan}
                    ent_khoicv={ent_khoicv}
                    toggleDatePicker={toggleDatePicker}
                    dataInput={dataInput}
                    handlePushDataSave={handlePushDataSave}
                    handleEditEnt={handleEditEnt}
                    isCheckUpdate={isCheckUpdate}
                    handlePushDataEdit={handlePushDataEdit}
                    loadingSubmit={loadingSubmit}
                    handleChangeText={handleChangeText}
                  />
                </BottomSheetScrollView>
              </BottomSheetModal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      Thông tin cá nhân chi tiết
                    </Text>
                    <ModalGiamsatInfo
                      dataModal={dataModal}
                      handleToggleModal={handleToggleModal}
                    />
                  </View>
                </View>
              </Modal>
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
    marginBottom: 20,
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 10,
  },
});

export default DanhmucUserScreen;
