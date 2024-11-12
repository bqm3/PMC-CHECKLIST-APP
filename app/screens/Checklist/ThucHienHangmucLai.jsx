import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Linking,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button/Button";
import QRCodeScreen from "../QRCodeScreen";
import DataContext from "../../context/DataContext";
import adjust from "../../adjust";
import { Camera } from "expo-camera";

const ThucHienHangmucLai = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Khuvuc, dataFilterHandler, Tenkv } =
    route.params;
  const { dataChecklists, setHangMuc, hangMuc, HangMucDefault } =
    useContext(DataContext);

  const [opacity, setOpacity] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);

  useEffect(() => {
    if (HangMucDefault && dataChecklists) {
      // Lọc các mục có ID_Khuvuc trùng khớp
      const filteredByKhuvuc = HangMucDefault?.filter(
        (item) => item.ID_Khuvuc == ID_Khuvuc
      );

      if (dataFilterHandler.length > 0) {
        const checklistIDs = dataFilterHandler?.map((item) => item.ID_Hangmuc);

        // Lọc filteredByKhuvuc để chỉ giữ lại các mục có ID_Hangmuc tồn tại trong checklistIDs
        const finalFilteredData = filteredByKhuvuc?.filter((item) =>
          checklistIDs.includes(item.ID_Hangmuc)
        );

        if (finalFilteredData.length == 0 && filteredByKhuvuc.length == 0) {
          navigation.goBack();
        } else {
          setHangMuc(finalFilteredData);
        }
      } else {
        // Lấy danh sách ID_Hangmuc từ dataChecklists
        const checklistIDs = dataChecklists?.map((item) => item.ID_Hangmuc);

        // Lọc filteredByKhuvuc để chỉ giữ lại các mục có ID_Hangmuc tồn tại trong checklistIDs
        const finalFilteredData = filteredByKhuvuc?.filter((item) =>
          checklistIDs.includes(item.ID_Hangmuc)
        );

        if (finalFilteredData.length == 0 && filteredByKhuvuc.length == 0) {
          navigation.goBack();
        } else {
          setHangMuc(finalFilteredData);
        }
      }
    }
  }, [ID_Khuvuc, HangMucDefault, dataChecklists]);

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value
      
      .trim()
      .toLowerCase();
    try {
      const resData = hangMuc.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
      if (resData.length >= 1) {
        navigation.navigate("Chi tiết Checklist", {
          ID_ChecklistC,
          ID_KhoiCV,
          ID_Hangmuc: resData[0].ID_Hangmuc,
          hangMuc,
          Hangmuc: resData[0],
          isScan: null
        });
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      } else {
        Alert.alert(
          "PMC Thông báo",
          `Hạng mục có QrCode: "${cleanedValue}" không thuộc khu vực "${Tenkv}"`,
        );
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      }
    } catch (error) {
      Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu");
    }
  };

  const toggleTodo = (item) => {
    const isExistIndex = dataSelect.find(
      (existingItem) => existingItem === item
    );
    if (isExistIndex) {
      setDataSelect([]);
    } else {
      setDataSelect([item]);
    }
  };

  const handleSubmit = () => {
    navigation.navigate("Chi tiết Checklist lại", {
      ID_ChecklistC,
      ID_KhoiCV,
      ID_Hangmuc: dataSelect[0].ID_Hangmuc,
      hangMuc,
      ID_Khuvuc,
      Hangmuc: dataSelect[0],
      isScan: 1
    });
    setDataSelect([]);
  };

  const renderItem = (item, index) => (
    <TouchableOpacity
      onPress={() => toggleTodo(item)}
      style={[
        styles.content,
        {
          backgroundColor: dataSelect[0] === item ? COLORS.bg_button : "white",
        },
      ]}
      key={index}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "80%" }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(18),
              color: dataSelect[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Hangmuc}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "white" : "black",
              fontWeight: "500",
            }}
          >
            {item?.MaQrCode}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" ,gap:10, marginRight: adjust(10)}}>
            {item.Important === 1 && (
                <Image
                  source={require("../../../assets/icons/ic_star.png")}
                  style={{
                    tintColor:  dataSelect[0] === item ? "white" : COLORS.bg_button,
                  }}
                />
            )}
            {item.Tieuchuankt !== "" && item.Tieuchuankt !== null && (
              <TouchableOpacity onPress={() => handlePopupActive(item, index)}>
                <Image
                  source={require("../../../assets/icons/ic_certificate.png")}
                  style={{
                    tintColor: dataSelect[0] === item ? "white" : "black",
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
      </View>
    </TouchableOpacity>
  );

  const handleOpenQrCode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setModalVisibleQr(true);
      setOpacity(0.2);
    } else if (status === "denied") {
      Alert.alert(
        "Permission Required",
        "Camera access is required to take photos. Please enable it in settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setModalVisibleQr(false);
              setOpacity(1);
            },
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ],
        { cancelable: false }
      );
    } else {
      setModalVisibleQr(false);
      setOpacity(1);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              <View style={{ flex: 1, opacity }}>
                <View style={{ margin: 12 }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Số lượng: {hangMuc?.length} hạng mục
                  </Text>
                </View>

                {isLoadingDetail === false && hangMuc?.length > 0 ? (
                  <FlatList
                    style={{ margin: 12, flex: 1, marginBottom: 100 }}
                    data={hangMuc}
                    renderItem={({ item, index }) => renderItem(item, index)}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 16 }} />
                    )}
                    keyExtractor={(item, index) =>
                      `${item?.ID_Checklist}_${index}`
                    }
                  />
                ) : (
                  navigation.goBack()
                )}

                {isLoadingDetail && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size="large" color={COLORS.bg_white} />
                  </View>
                )}

                {isLoadingDetail === false && hangMuc?.length === 0 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 80,
                    }}
                  >
                    <Image
                      source={require("../../../assets/icons/delete_bg.png")}
                      resizeMode="contain"
                      style={{ height: 120, width: 120 }}
                    />
                    <Text
                      allowFontScaling={false}
                      style={[styles.danhmuc, { padding: 10 }]}
                    >
                      {isScan
                        ? "Không thấy hạng mục cho khu vực này"
                        : "Không còn hạng mục cho ca làm việc này !"}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    position: "absolute",
                    bottom: 30,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {hangMuc.length > 0 && (
                    <Button
                      text={"Quét Qrcode"}
                      backgroundColor={"white"}
                      color={"black"}
                      onPress={() => handleOpenQrCode()}
                    />
                  )}
                  {dataSelect[0] && (
                    <Button
                      text={"Vào Checklist"}
                      backgroundColor={COLORS.bg_button}
                      color={"white"}
                      onPress={handleSubmit}
                    />
                  )}
                </View>
              </View>
            </ImageBackground>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleQr}
              onRequestClose={() => {
                setModalVisibleQr(!modalVisibleQr);
                setOpacity(1);
              }}
            >
              <View
                style={[styles.centeredView, { width: "100%", height: "80%" }]}
              >
                <View
                  style={[styles.modalView, { width: "80%", height: "60%" }]}
                >
                  <QRCodeScreen
                    setModalVisibleQr={setModalVisibleQr}
                    setOpacity={setOpacity}
                    handlePushDataFilterQr={handlePushDataFilterQr}
                    setIsScan={setIsScan}
                  />
                </View>
              </View>
            </Modal>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
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
    width: 60,
    height: 60,
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
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
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
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default ThucHienHangmucLai;
