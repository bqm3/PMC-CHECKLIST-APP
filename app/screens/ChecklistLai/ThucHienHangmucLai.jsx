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
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import QRCodeScreen from "../QRCodeScreen";
import DataContext from "../../context/DataContext";
import adjust from "../../adjust";
import { Camera } from "expo-camera";
import { Linking } from "react-native";

const ThucHienHangmucLai = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Khuvuc, Tenkv } = route.params;
  const {
    dataChecklists,
    hangMucFilterByIDChecklistC,
    setHangMucByKhuVuc,
    hangMucByKhuVuc,
  } = useContext(DataContext);

  const [opacity, setOpacity] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tieuChuan, setTieuChuan] = useState();
  const [dataSelect, setDataSelect] = useState([]);

  useEffect(() => {
    if (hangMucFilterByIDChecklistC) {
      // Lọc các mục có ID_Khuvuc trùng khớp
      const filteredByKhuvuc = hangMucFilterByIDChecklistC?.filter(
        (item) => item.ID_Khuvuc == ID_Khuvuc
      );
      if (filteredByKhuvuc?.length == 0) {
        setTimeout(() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }, 250);
      } else {
        setHangMucByKhuVuc(filteredByKhuvuc);
      }
    }
  }, [ID_Khuvuc, hangMucFilterByIDChecklistC]);

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value.trim().toLowerCase();
    try {
      const resData = hangMucFilterByIDChecklistC.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
      if (resData?.length >= 1) {
        navigation.navigate("Chi tiết Checklist lại", {
          ID_ChecklistC: ID_ChecklistC,
          ID_KhoiCV: ID_KhoiCV,
          ID_Hangmuc: resData[0].ID_Hangmuc,
          Hangmuc: resData[0],
          isScan: null,
        });
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      } else if (resData?.length === 0) {
        Alert.alert(
          "Thông báo",
          `Hạng mục có QrCode: "${cleanedValue}" không thuộc khu vực "${Tenkv}"`,
          [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]
        );
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      }
    } catch (error) {
      if (error.response) {
        // Lỗi từ phía server (có response từ server)
        Alert.alert("Thông báo", error.response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        Alert.alert("Thông báo", "Không nhận được phản hồi từ máy chủ", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        // Lỗi khi cấu hình request
        Alert.alert("Thông báo", "Lỗi khi gửi yêu cầu", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      }
    }
  };

  const handlePopupActive = (item, index) => {
    setModalVisible(true);
    setOpacity(0.2);
    setTieuChuan(item.Tieuchuankt);
  };

  // toggle Data select
  const toggleTodo = async (item) => {
    const isExistIndex = dataSelect.find(
      (existingItem) => existingItem === item
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex) {
      setDataSelect([]);
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setDataSelect([item]);
    }
  };

  const handleSubmit = () => {
    navigation.navigate("Chi tiết Checklist lại", {
      ID_ChecklistC: ID_ChecklistC,
      ID_KhoiCV: ID_KhoiCV,
      ID_Hangmuc: dataSelect[0].ID_Hangmuc,
      ID_Khuvuc: ID_Khuvuc,
      Hangmuc: dataSelect[0],
      isScan: 1,
    });
    setDataSelect([]);
  };

  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[
          styles.content,
          {
            backgroundColor:
              dataSelect[0] === item ? COLORS.bg_button : "white",
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginRight: adjust(10),
            }}
          >
            {item.Important === 1 && (
              <Image
                source={require("../../../assets/icons/ic_star.png")}
                style={{
                  tintColor:
                    dataSelect[0] === item ? "white" : COLORS.bg_button,
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
  };

  // format number
  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number == 0) return `0`;
    return number;
  };

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
              <View
                style={{
                  flex: 1,
                  opacity: opacity,
                }}
              >
                <View style={{ margin: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      // onPress={() => handleFilterData(true, 0.5)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "cloumn",
                          gap: 8,
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {decimalNumber(hangMucByKhuVuc?.length)}{" "}
                          hạng mục
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {isLoadingDetail === false &&
                  hangMucByKhuVuc &&
                  hangMucByKhuVuc?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={hangMucByKhuVuc}
                        renderItem={({ item, index, separators }) =>
                          renderItem(item, index)
                        }
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 16 }} />
                        )}
                        keyExtractor={(item, index) =>
                          `${item?.ID_Checklist}_${index}`
                        }
                        showsVerticalScrollIndicator={false}
                      />
                    </>
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
                  {hangMucByKhuVuc?.length > 0 && (
                    <Button
                      text={"Quét Qrcode"}
                      backgroundColor={"white"}
                      color={"black"}
                      onPress={() => handleOpenQrCode()}
                    />
                  )}

                  {dataSelect?.length > 0 && (
                    <Button
                      text={"Vào Checklist"}
                      backgroundColor={COLORS.bg_button}
                      color={"white"}
                      onPress={() => handleSubmit()}
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

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
                setOpacity(1);
              }}
            >
              <View
                style={[styles.centeredView, { width: "100%", height: "80%" }]}
              >
                <View
                  style={[
                    styles.modalView,
                    {
                      width: "80%",
                      height: "auto",
                      maxHeight: "70%",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <ScrollView>
                    <Text allowFontScaling={false} style={styles.modalText}>
                      {tieuChuan}{" "}
                    </Text>
                  </ScrollView>
                  <Button
                    text={"Đóng"}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => {
                      setModalVisible(false);
                      setOpacity(1);
                    }}
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

export default ThucHienHangmucLai;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(18), color: "white", fontWeight: "600" },
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
    fontSize: adjust(16),
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
