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
  ent_toanha_get,
  ent_duan_get,
} from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import ItemToanha from "../../components/Item/ItemToanha";
import ModalToanha from "../../components/Modal/ModalToanha";

const DanhmucToanhaScreen = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_toanha, ent_duan } = useSelector(
    (state) => state.entReducer
  );
  const { user, authToken } = useSelector((state) => state.authReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    ID_Toanha: null,
  });

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_duan = async () => {
    await dispath(ent_duan_get());
  };

  useEffect(() => {
    setIsLoading(true)
    init_toanha();
    init_duan();
    setIsLoading(false)
  }, []);

  
  const [dataInput, setDataInput] = useState({
    ID_Duan: null,
    Toanha: "",
    Sotang: 0,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (
      dataInput.ID_Duan === null ||
      dataInput.Toanha === "" 
    ) {
      Alert.alert("PMC Thông báo", "Thiếu thông tin tòa nhà", [
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
        Toanha: dataInput.Toanha,
        Sotang: dataInput.Sotang,
        
      };
      setLoadingSubmit(true)
      await axios
        .post(BASE_URL + "/ent_toanha/create", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_toanha();
          handleAdd();
          handleCloseModal();
          setLoadingSubmit(false)
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
          console.log('err',err)
          setLoadingSubmit(false)
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
      ID_Toanha: data.ID_Toanha,
    });
    handlePresentModalPress();
    setDataInput({
      ID_Duan: data.ID_Duan,
        Toanha: data.Toanha,
        Sotang: data.Sotang,
    
    });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.Toanha === "" || dataInput.ID_Duan === null) {
      Alert.alert("PMC Thông báo", "Thiếu thông tin tòa nhà", [
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
        Toanha: dataInput.Toanha,
        Sotang: dataInput.Sotang,
      };
      setLoadingSubmit(true)
      await axios
        .put(BASE_URL + `/ent_toanha/update/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_toanha();
          handleAdd();
          handleCloseModal();
          setLoadingSubmit(false)
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
          setLoadingSubmit(false)
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
      .put(BASE_URL + `/ent_toanha/delete/${id}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        init_toanha();
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
      ID_Duan: null,
      Toanha: "",
      Sotang: 0,
     
    });
    setIsCheckUpdate({
      check: false,
      ID_Toanha: null,
    })
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      handleCloseModal();
      handleAdd()
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number === 0) return `${number}`;
    return number;
  };

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
                  justifyContent: "center",
                  width: "100%",
                  opacity: opacity,
                }}
              >
                <View style={styles.container}>
                  <Text allowFontScaling={false}   style={styles.danhmuc}>Danh mục tòa nhà</Text>
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
                      {ent_toanha && ent_toanha.length > 0 ? (
                        <>
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text allowFontScaling={false}   style={styles.text}>
                              Số lượng: {decimalNumber(ent_toanha?.length)}
                            </Text>
                            <ButtonChecklist
                              text={"Thêm mới"}
                              width={"auto"}
                              color={COLORS.bg_button}
                              // icon={
                              //   <Ionicons name="add" size={20} color="white" />
                              // }
                              onPress={()=> {
                                handlePresentModalPress()
                                handleAdd()
                                setIsCheckUpdate({
                                  check: false,
                                  ID_Toanha: null,
                                })
                              }}
                            />
                          </View>

                          <FlatList
                            horizontal={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            style={{ marginVertical: 10 }}
                            data={ent_toanha}
                            renderItem={({ item, index }) => (
                              <ItemToanha
                                key={index}
                                item={item}
                                handleEditEnt={handleEditEnt}
                                handleAlertDelete={handleAlertDelete}
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
                            <Text allowFontScaling={false}
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
                  <ModalToanha 
                   ent_duan={ent_duan}
                   handleChangeText={handleChangeText}
                   dataInput={dataInput}
                   handlePushDataSave={handlePushDataSave}
                   isCheckUpdate={isCheckUpdate}
                   handlePushDataEdit={handlePushDataEdit}
                   loadingSubmit={loadingSubmit}
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

export default DanhmucToanhaScreen;
