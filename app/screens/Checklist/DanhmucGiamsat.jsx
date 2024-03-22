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

import {
  ent_chucvu_get,
  ent_giamsat_get,
  ent_duan_get,
} from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import ModalCalamviec from "../../components/Modal/ModalCalamviec";
import ItemGiamSat from "../../components/Item/ItemGiamSat";
import ModalGiamsat from "../../components/Modal/ModalGiamsat";
import ModalGiamsatInfo from "../../components/Modal/ModalGiamsatInfo";

const DanhmucGiamsat = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_giamsat, ent_chucvu, ent_duan } = useSelector(
    (state) => state.entReducer
  );
  const { user, authToken } = useSelector((state) => state.authReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [1, "20%", "50%", "80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    id_giamsat: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const init_duan = async () => {
    await dispath(ent_duan_get());
  };

  const init_chucvu = async () => {
    await dispath(ent_chucvu_get());
  };

  const init_giamsat = async () => {
    await dispath(ent_giamsat_get());
  };

  useEffect(() => {
    init_giamsat();
    init_duan();
    init_chucvu();
  }, []);

  const [dataInput, setDataInput] = useState({
    id_duan: null,
    hoten: "",
    gioitinh: "",
    ngaysinh: "",
    sodienthoai: "",
    id_chucvu: null,
    id_quyen: null,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (dataInput.hoten === "" || dataInput.sodienthoai === null) {
      Alert.alert("PMC Thông báo", "Thiêu thông tin người giám sát", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Duan: dataInput.id_duan,
        Hoten: dataInput.hoten,
        Gioitinh: dataInput.gioitinh,
        Sodienthoai: dataInput.sodienthoai,
        Ngaysinh: dataInput.ngaysinh,
        ID_Chucvu: dataInput.id_chucvu,
        iQuyen: 1,
      };
      await axios
        .post(BASE_URL + "/ent_giamsat/create", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_giamsat();
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

  const handleEditEnt = async (data) => {
    handlePresentModalPress();
    setDataInput({
      id_duan: data.ID_Duan,
      hoten: data.Hoten,
      gioitinh: data.Gioitinh,
      ngaysinh: data.Ngaysinh,
      sodienthoai: data.Sodienthoai,
      id_chucvu: data.ID_Chucvu,
      id_quyen: data.iQuyen,
    });

    setIsCheckUpdate({
      check: true,
      id_giamsat: data.ID_Giamsat,
    });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.hoten === "" || dataInput.sodienthoai === null) {
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
        ID_Duan: dataInput.id_duan,
        Hoten: dataInput.hoten,
        Gioitinh: dataInput.gioitinh,
        Sodienthoai: dataInput.sodienthoai,
        Ngaysinh: dataInput.ngaysinh,
        ID_Chucvu: dataInput.id_chucvu,
        iQuyen: 1,
      };

      await axios
        .put(BASE_URL + `/ent_giamsat/update/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_giamsat();
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
          console.log("err", err);
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
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa người giám sát", [
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
      .put(BASE_URL + `/ent_giamsat/delete/${id}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        init_giamsat();
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

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleConfirm = (key, date) => {
    handleChangeText(key, moment(date).format("L"));
    setDatePickerVisibility(false);
  };

  const handleAdd = () => {
    setDataInput({
      id_duan: null,
      hoten: "",
      gioitinh: "",
      ngaysinh: "",
      sodienthoai: "",
      id_chucvu: null,
      id_quyen: null,
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
                  <Text style={styles.danhmuc}>Danh mục giám sát</Text>

                  {ent_giamsat && ent_giamsat.length > 0 ? (
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
                          Số lượng: {decimalNumber(ent_giamsat?.length)}
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
                        data={ent_giamsat}
                        renderItem={({ item, index }) => (
                          <ItemGiamSat
                            key={index}
                            item={item}
                            handleEditEnt={handleEditEnt}
                            handleAlertDelete={handleAlertDelete}
                            handleToggleModal={handleToggleModal}
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
                  <ModalGiamsat
                    ent_chucvu={ent_chucvu}
                    ent_duan={ent_duan}
                    handleChangeText={handleChangeText}
                    isDatePickerVisible={isDatePickerVisible}
                    handleConfirm={handleConfirm}
                    toggleDatePicker={toggleDatePicker}
                    dataInput={dataInput}
                    handlePushDataSave={handlePushDataSave}
                    handleEditEnt={handleEditEnt}
                    isCheckUpdate={isCheckUpdate}
                    handlePushDataEdit={handlePushDataEdit}
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
                    <Text style={styles.modalText}>Thông tin cá nhân chi tiết</Text>
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
    fontWeight: '600',
    paddingVertical: 10
  }
});

export default DanhmucGiamsat;
