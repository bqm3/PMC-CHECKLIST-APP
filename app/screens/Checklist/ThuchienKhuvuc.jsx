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
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ent_khuvuc_get,
  ent_toanha_get,
  ent_checklist_mul_hm,
} from "../../redux/actions/entActions";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../../constants/config";
import QRCodeScreen from "../QRCodeScreen";
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";

const ThucHienKhuvuc = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Calv, ID_Toanha } = route.params;
  const { setDataChecklists, dataHangmuc } = useContext(DataContext);
  const { setDataChecklistFilterContext } = useContext(ChecklistContext);

  const dispath = useDispatch();
  const { ent_khuvuc, ent_checklist_detail, ent_toanha } = useSelector(
    (state) => state.entReducer
  );

  const { user, authToken } = useSelector((state) => state.authReducer);

  const [opacity, setOpacity] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [data, setData] = useState([]);

  const [stepKhuvuc, setStepKhuvuc] = useState(0);
  const [checkKhuvuc, setCheckKhuvuc] = useState([]);
  const toanhaIds = checkKhuvuc.map((item) => item.ID_Toanha);

  const init_checklist = async () => {
    await dispath(ent_checklist_mul_hm(dataHangmuc, ID_Calv, ID_ChecklistC));
  };

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  useEffect(() => {
    if (ID_Toanha !== undefined && ID_Toanha !== null) {
      setStepKhuvuc(1);
      const toanhaIdsArray = ID_Toanha.split(", ").map((id) =>
        parseInt(id, 10)
      );

      const matchingEntKhuvuc = ent_khuvuc.filter((item) =>
        toanhaIdsArray.includes(item.ID_Toanha)
      );
      setData(matchingEntKhuvuc);
    } else {
      setStepKhuvuc(0);
      init_toanha();
    }
  }, [ID_Toanha]);

  useEffect(() => {
    if (stepKhuvuc === 1 && toanhaIds.length > 0) {
      const toanhaIdsArray = toanhaIds?.map((id) => parseInt(id, 10));

      const matchingEntKhuvuc = ent_khuvuc.filter((item) =>
        toanhaIdsArray.includes(item.ID_Toanha)
      );
      setData(matchingEntKhuvuc);
    }
  }, [stepKhuvuc]);

  useEffect(() => {
    init_checklist();
  }, [dataHangmuc]);

  useEffect(() => {
    if (ent_checklist_detail) {
      setDataChecklists(ent_checklist_detail);
      setDataChecklistFilterContext(ent_checklist_detail);
    }
  }, [ent_checklist_detail]);

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value
      .replace(/^http:\/\//, "")
      .trim()
      .toLowerCase();

    try {
      const resData = ent_khuvuc.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
      if (resData.length >= 1) {
        navigation.navigate("Thực hiện hạng mục", {
          ID_ChecklistC: ID_ChecklistC,
          ID_KhoiCV: ID_KhoiCV,
          ID_Calv: ID_Calv,
          ID_Khuvuc: resData[0].ID_Khuvuc,
        });
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      } else if (resData.length === 0) {
        Alert.alert(
          "PMC Thông báo",
          "Không tìm thấy khu vực có mã Qr phù hợp",
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
  };

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

  const toggleSelectToanha = async (item) => {
    setCheckKhuvuc((prevDataSelect) => {
      // Kiểm tra xem item đã tồn tại trong mảng chưa
      const isExist = prevDataSelect.includes(item);

      // Nếu item đã tồn tại, xóa item đó đi
      if (isExist) {
        return prevDataSelect.filter((existingItem) => existingItem !== item);
      } else {
        // Nếu item chưa tồn tại, thêm vào mảng
        return [...prevDataSelect, item];
      }
    });
  };

  const handleSubmit = () => {
    navigation.navigate("Thực hiện hạng mục", {
      ID_ChecklistC: ID_ChecklistC,
      ID_KhoiCV: ID_KhoiCV,
      ID_Calv: ID_Calv,
      ID_Khuvuc: dataSelect[0].ID_Khuvuc,
    });
  };

  const handleSubmitKhuvuc = async () => {
    const data = {
      ID_ChecklistC: ID_ChecklistC,
      toanhaIds: toanhaIds.join(", "),
      ID_Calv: ID_Calv,
      ID_User: user.ID_User,
    };

    await axios
      .post(BASE_URL + "/tb_checklistc/toanha", data, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((res) => {
        setLoadingSubmit(false);
        setStepKhuvuc(1);
        // Hiển thị cảnh báo sau khi tất cả các yêu cầu hoàn thành
        Alert.alert("PMC Thông báo", "Chọn khu vực thành công", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((error) => {
        setStepKhuvuc(0);
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
        }
      });
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
            gap: 10,
            width: "80%",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: dataSelect[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Tenkhuvuc} - {item?.ent_toanha?.Toanha}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemToanha = (item, index) => {
    const isCheck = checkKhuvuc.includes(item);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectToanha(item)}
        style={[
          styles.content,
          {
            backgroundColor: isCheck ? COLORS.bg_button : "white",
          },
        ]}
        key={index}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "80%",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: isCheck ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Toanha}
          </Text>
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
              {stepKhuvuc == 1 ? (
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
                      <TouchableOpacity
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
                            Số lượng: {decimalNumber(data?.length)} khu vực
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isLoadingDetail === false && data && data?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={data}
                        renderItem={({ item, index, separators }) =>
                          renderItem(item, index)
                        }
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 16 }} />
                        )}
                        keyExtractor={(item, index) =>
                          `${item?.ID_Checklist}_${index}`
                        }
                      />
                    </>
                  )}

                  {isLoadingDetail === true && ent_khuvuc?.length == 0 && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ActivityIndicator
                        style={{
                          marginRight: 4,
                        }}
                        size="large"
                        color={COLORS.bg_white}
                      ></ActivityIndicator>
                    </View>
                  )}

                  {isLoadingDetail === false && ent_khuvuc?.length == 0 && (
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
                          ? "Không thấy khu vực này"
                          : "Không có khu vực trong ca làm việc này !"}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 40,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      text={"Scan QR Code"}
                      backgroundColor={"white"}
                      color={"black"}
                      onPress={() => {
                        setModalVisibleQr(true);
                        setOpacity(0.2);
                      }}
                    />
                    {dataSelect[0] && (
                      <Button
                        text={"Khu vực"}
                        isLoading={loadingSubmit}
                        backgroundColor={COLORS.bg_button}
                        color={"white"}
                        onPress={() => handleSubmit()}
                      />
                    )}
                  </View>
                </View>
              ) : (
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
                      <TouchableOpacity
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
                            Số lượng: {decimalNumber(ent_toanha?.length)} tòa
                            nhà
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {ent_toanha && ent_toanha?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={ent_toanha}
                        renderItem={({ item, index, separators }) =>
                          renderItemToanha(item, index)
                        }
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 16 }} />
                        )}
                        keyExtractor={(item, index) =>
                          `${item?.ID_Checklist}_${index}`
                        }
                      />
                    </>
                  )}

                  <View
                    style={{
                      position: "absolute",
                      bottom: 40,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      text={"Chọn khu vực"}
                      backgroundColor={COLORS.bg_button}
                      color={"white"}
                      onPress={() => handleSubmitKhuvuc()}
                    />
                  </View>
                </View>
              )}
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

export default ThucHienKhuvuc;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
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
    fontSize: 20,
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
