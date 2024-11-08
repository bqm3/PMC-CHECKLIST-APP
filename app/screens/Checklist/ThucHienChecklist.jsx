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
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  BackHandler,
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import {
  ent_calv_get,
  ent_hangmuc_get,
  ent_khuvuc_get,
} from "../../redux/actions/entActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tb_checklistc_get } from "../../redux/actions/tbActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import ModalChecklistC from "../../components/Modal/ModalChecklistC";
import ModalChecklistCImage from "../../components/Modal/ModalChecklistCImage";
import ItemCaChecklist from "../../components/Item/ItemCaChecklist";
import DataContext from "../../context/DataContext";
import adjust from "../../adjust";
import { useFocusEffect } from "@react-navigation/native";
import * as Network from "expo-network";
import CustomAlertModal from "../../components/CustomAlertModal";
import RenderHTML from 'react-native-render-html';
import { flatMap } from "lodash";

const ThucHienChecklist = ({ navigation }) => {
  const ref = useRef(null);
  const dispath = useDispatch();
  const { ent_calv, ent_hangmuc } = useSelector((state) => state.entReducer);
  const { tb_checklistc } = useSelector((state) => state.tbReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { setDataHangmuc, stepKhuvuc } = useContext(DataContext);

  const date = new Date();
  const dateDay = moment(date).format("YYYY-MM-DD");
  const dateHour = moment(date).format("LTS");

  const [dataCalv, setDataCalv] = useState([]);
  const bottomSheetModalRef2 = useRef(null);
  const snapPoints2 = useMemo(() => ["90%"], []);
  const [opacity, setOpacity] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);

  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [dataInput, setDataInput] = useState({
    dateDay: dateDay,
    dateHour: dateHour,
    Calv: null,
    ID_Duan: user?.ID_Duan,
  });

  const [dataImages, setDataImages] = useState({
    Giochupanh1: null,
    Anh1: null,
    Giochupanh2: null,
    Anh2: null,
    Giochupanh3: null,
    Anh3: null,
    Giochupanh4: null,
    Anh4: null,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeImages = (key, value) => {
    setDataImages((data) => ({
      ...data,
      [key]: value,
    }));
  };

  useEffect(() => {
    setDataCalv(tb_checklistc?.data);
  }, [tb_checklistc]);

  useEffect(() => {
    if (ent_hangmuc) {
      const hangmucIds = ent_hangmuc.map((item) => item.ID_Hangmuc);
      setDataHangmuc(hangmucIds);
    }
  }, [ent_hangmuc]);

  const init_ca = async () => {
    await dispath(ent_calv_get());
  };

  const int_checklistc = async () => {
    await dispath(tb_checklistc_get({ page: 0, limit: 30 }));
  };

  const loadData = async () => {
    await AsyncStorage.removeItem("dataChecklist");
    await AsyncStorage.removeItem("checkNetwork");
  };

  useEffect(() => {
    init_ca();
    int_checklistc();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen is focused
      loadData();

      // Optionally return a cleanup function if needed
      return () => {
        // Cleanup logic if necessary
      };
    }, []) // Dependencies for focus effect, keep it empty if you want it to run on every focus
  );

  const toggleTodo = async (item, index) => {
    // setIsCheckbox(true);
    const isExistIndex = newActionCheckList.findIndex(
      (existingItem) => existingItem.ID_ChecklistC === item.ID_ChecklistC
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionCheckList((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionCheckList([item]);
    }
  };

  const handlePushDataImagesSave = async (id) => {
    try {
      setLoadingSubmit(true);
      let formData = new FormData();

      // Iterate over the keys of dataImages object
      if (dataImages.Anh1) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh1?.uri
              : dataImages?.Anh1?.uri.replace("file://", ""),
          name:
            dataImages?.Anh1?.fileName ||
            Math.floor(Math.random() * Math.floor(99999999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh1`, file?.name);
        formData.append("Giochupanh1", dateHour);
      }
      if (dataImages.Anh2) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh2?.uri
              : dataImages?.Anh2?.uri.replace("file://", ""),
          name:
            dataImages?.Anh2?.fileName ||
            Math.floor(Math.random() * Math.floor(99999999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh2`, file?.name);
        formData.append("Giochupanh2", dateHour);
      }
      if (dataImages.Anh3) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh3?.uri
              : dataImages?.Anh3?.uri.replace("file://", ""),
          name:
            dataImages?.Anh3?.fileName ||
            Math.floor(Math.random() * Math.floor(99999999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh3`, file?.name);
        formData.append("Giochupanh3", dateHour);
      }
      if (dataImages.Anh4) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh4?.uri
              : dataImages?.Anh4?.uri.replace("file://", ""),
          name:
            dataImages?.Anh4?.fileName ||
            Math.floor(Math.random() * Math.floor(999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh4`, file?.name);
        formData.append("Giochupanh4", dateHour);
      }

      await axios
        .post(
          BASE_URL +
            `/tb_checklistc/update_images/${newActionCheckList[0].ID_ChecklistC}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authToken,
            },
          }
        )
        .then((res) => {
          setLoadingSubmit(false);
          int_checklistc();
          // handleCloseSheetImage();
          // bottomSheetModalRef2?.current?.close();
          Alert.alert("PMC Thông báo", "Checklist thành công", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((error) => {
          console.log("error", error.response);
          setLoadingSubmit(false);
          // Handle the error appropriately, e.g., displaying an error message
          if (error.response) {
            // Lỗi từ phía server (có response từ server)
            Alert.alert("PMC Thông báo", error.response.data.message, [
              {
                text: "Hủy",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
            ]);
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            Alert.alert(
              "PMC Thông báo",
              "Không nhận được phản hồi từ máy chủ",
              [
                {
                  text: "Hủy",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
              ]
            );
          } else {
            // Lỗi khi cấu hình request
            Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
              {
                text: "Hủy",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
            ]);
          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePushDataSave = async () => {
    if (dataInput.ID_Calv === null) {
      Alert.alert("PMC Thông báo", "Chưa chọn ca làm việc", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        Tenca: dataInput.Calv.Tenca,
        ID_Calv: dataInput.Calv.ID_Calv,
        ID_User: user.ID_User,
        ID_Duan: user.ID_Duan,
        ID_KhoiCV: user.ID_KhoiCV,
        Ngay: dataInput.dateDay,
        Giobd: dataInput.dateHour,
      };
      setLoadingSubmit(true);
      try {
        await axios
          .post(BASE_URL + "/tb_checklistc/create", data, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
          })
          .then((response) => {
            clearAsyncStorage();
            handleAdd();
            handleClosePopUp();
            int_checklistc();
            handleCloseSheetImage();
            setLoadingSubmit(false);
            handleChecklistDetail(
              response.data.data.ID_ChecklistC,
              response.data.data.ID_KhoiCV,
              response.data.data.ID_ThietLapCa,
              response.data.data.ID_Hangmucs,
              null
            );
          });
      } catch (error) {
        setLoadingSubmit(false);
        if (error.response) {
          // Lỗi từ phía server (có response từ server)
          // Alert.alert("PMC Thông báo", error.response.data.message, [
          //   {
          //     text: "Hủy",
          //     onPress: () => console.log("Cancel Pressed"),
          //     style: "cancel",
          //   },
          //   { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          // ]);
          setIsModalVisible(true);
          setMessage(error.response.data.message)
        } else if (error.request) {
          // Lỗi không nhận được phản hồi từ server
          console.log(error.request);
          Alert.alert("PMC Thông báo", "Không nhận được phản hồi từ máy chủ", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else {
          // Lỗi khi cấu hình request
          console.log("Error", error.message);
          Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }
    }
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem("dataChecklist");
      await AsyncStorage.removeItem("checkNetwork");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const handleClosePopUp = () => {
    setOpacity(1);
    setModalVisible(false);
    console.log(opacity);
  };

  const handleOpenPopUp = () => {
    setOpacity(0.2);
    setModalVisible(true);
  };

  const handleSheetChanges2 = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
      handleAdd();
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleCloseSheetImage = useCallback(() => {
    bottomSheetModalRef2?.current?.close();
    setOpacity(1);
  }, []);

  const handleToggleModal = () => {
    bottomSheetModalRef2?.current?.present();
    setOpacity(0.2);
  };

  const handleAdd = () => {
    setDataInput({
      dateDay: dateDay,
      dateHour: dateHour,
      Calv: null,
      ID_Duan: user?.ID_Duan,
    });
    setDataImages({
      Giochupanh1: null,
      Anh1: null,
      Giochupanh2: null,
      Anh2: null,
      Giochupanh3: null,
      Anh3: null,
      Giochupanh4: null,
      Anh4: null,
    });
  };

  const handleChecklistDetail = async (id1, id2, id3, id4) => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(networkState.isConnected);
    if (networkState.isConnected) {
      navigation.navigate("Thực hiện khu vực", {
        ID_ChecklistC: id1,
        ID_KhoiCV: id2,
        ID_ThietLapCa: id3,
        ID_Hangmucs: id4,
      });

      setNewActionCheckList([]);
    } else {
      Alert.alert(
        "Không có kết nối mạng",
        "Vui lòng kiểm tra kết nối mạng của bạn."
      );
    }
  };

  const handleCloseChecklist = async (ID_ChecklistC) => {
    await axios
      .put(
        BASE_URL + `/tb_checklistc/close/${ID_ChecklistC}`,
        {
          Giokt: dateHour,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then(() => {
        int_checklistc();
        setNewActionCheckList([]);
        Alert.alert("PMC Thông báo", "Khóa ca thành công", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => {} },
        ]);
      })
      .catch((err) => {
        Alert.alert("PMC Thông báo", "Khóa ca thất bại. Vui lòng thử lại!!", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => {} },
        ]);
      });
  };

  const handleChecklistClose = (item) => {
    Alert.alert("PMC Thông báo", "Bạn muốn khóa ca checklist ?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: () => handleCloseChecklist(item?.ID_ChecklistC),
      },
    ]);
  };

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        handleClosePopUp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [modalVisible]);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
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
                  opacity: opacity,
                }}
              >
                <View style={styles.container}>
                  <TouchableWithoutFeedback
                    onPress={() => handleCloseSheetImage()}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      {user?.ID_Chucvu !== 1 && (
                        <ButtonChecklist
                          text={"Thêm mới"}
                          width={"auto"}
                          color={COLORS.bg_button}
                          // icon={<Ionicons name="add" size={20} color="white" />}
                          onPress={() => handleOpenPopUp()}
                          newActionCheckList={newActionCheckList}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  {isLoading ? (
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
                      {dataCalv && dataCalv?.length > 0 ? (
                        <FlatList
                          horizontal={false}
                          contentContainerStyle={{ flexGrow: 1 }}
                          style={{ marginVertical: 10 }}
                          data={dataCalv}
                          renderItem={({ item, index }) => (
                            <ItemCaChecklist
                              key={index}
                              item={item}
                              toggleTodo={toggleTodo}
                              newActionCheckList={newActionCheckList}
                            />
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          scrollEventThrottle={16}
                          scrollEnabled={true}
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 120,
                          }}
                        >
                          <Image
                            source={require("../../../assets/icons/delete_bg.png")}
                            resizeMode="contain"
                            style={{ height: 120, width: 120 }}
                          />
                          <Text
                            allowFontScaling={false}
                            style={[styles.danhmuc, { paddingVertical: 10 }]}
                          >
                            Bạn chưa có dữ liệu nào
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                // onRequestClose={() => {
                //   //Alert.alert("Modal has been closed.");
                //   setModalVisible(!modalVisible);
                // }}
                onRequestClose={handleClosePopUp}
              >
                <CustomAlertModal
                  isVisible={isModalVisible}
                  title="PMC Thông báo"
                  message={<RenderHTML contentWidth={300} source={{ html: message }} />} // Sử dụng RenderHTML
                  onConfirm={() => setIsModalVisible(false)}
                />
                <View style={styles.centeredView}>
                  <View
                    style={[
                      styles.modalView,
                      { width: "80%", height: "auto", minHeight: 300 },
                    ]}
                  >
                    <View style={styles.contentContainer}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          color: "black",
                          fontWeight: "600",
                          fontSize: 20,
                          textAlign: "center",
                          paddingTop: 10,
                        }}
                      >
                        {user?.ent_khoicv?.KhoiCV}
                      </Text>
                      <ModalChecklistC
                        ent_calv={ent_calv}
                        dataInput={dataInput}
                        handleChangeText={handleChangeText}
                        handlePushDataSave={handlePushDataSave}
                        isLoading={loadingSubmit}
                        handleClosePopUp={handleClosePopUp}
                      />
                    </View>
                  </View>
                </View>
              </Modal>

              <BottomSheetModal
                ref={bottomSheetModalRef2}
                index={0}
                snapPoints={snapPoints2}
                onChange={handleSheetChanges2}
              >
                <View style={styles.contentContainer}>
                  <ModalChecklistCImage
                    dataImages={dataImages}
                    handleChangeImages={handleChangeImages}
                    ent_calv={ent_calv}
                    dataInput={dataInput}
                    handleChangeText={handleChangeText}
                    handlePushDataSave={handlePushDataSave}
                    isLoading={loadingSubmit}
                    handlePushDataImagesSave={handlePushDataImagesSave}
                    newActionCheckList={newActionCheckList}
                  />
                </View>
              </BottomSheetModal>

              {newActionCheckList?.length > 0 && user?.ID_Chucvu !== 1 && (
                <View
                  style={{
                    width: 60,
                    position: "absolute",
                    right: 20,
                    bottom: 50,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {newActionCheckList[0]?.Tinhtrang === 0 && (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          { backgroundColor: COLORS.bg_red },
                        ]}
                        onPress={() =>
                          handleChecklistClose(newActionCheckList[0])
                        }
                      >
                        {/* <Feather name="lock" size={26} color="white" /> */}
                        <Image
                          source={require("../../../assets/icons/ic_lock.png")}
                          style={{
                            tintColor: "white",
                            resizeMode: "contain",
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() =>
                          handleChecklistDetail(
                            newActionCheckList[0]?.ID_ChecklistC,
                            newActionCheckList[0]?.ID_KhoiCV,
                            newActionCheckList[0]?.ID_Calv,
                            newActionCheckList[0]?.ID_Hangmucs
                          )
                        }
                      >
                        {/* <Feather name="unlock" size={26} color="white" /> */}
                        <Image
                          source={require("../../../assets/icons/ic_unlock.png")}
                          style={{
                            tintColor: "white",
                            resizeMode: "contain",
                          }}
                        />
                      </TouchableOpacity>

                      {/* chưa dùng */}
                      <View style={{height: 50, width: 50}}>

                      </View>
                      {/* <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleToggleModal()}
                      >
                        <Image
                          source={require("../../../assets/icons/ic_camera.png")}
                          style={{
                            tintColor: "white",
                            resizeMode: "contain",
                          }}
                        />
                      </TouchableOpacity> */}
                    </>
                  )}
                </View>
              )}
            </ImageBackground>
          </BottomSheetModalProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(15), color: "white", fontWeight: "600" },
  headerTable: {
    color: "white",
  },
  outter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 4,
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
    fontSize: adjust(20),
    fontWeight: "600",
    paddingVertical: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default ThucHienChecklist;
