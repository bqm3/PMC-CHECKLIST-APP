import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";
import ItemSucongoai from "../../components/Item/ItemSucongoai";
import { tb_sucongoai_get } from "../../redux/actions/tbActions";
import { ent_get_sdt_KhanCap } from "../../redux/actions/entActions";
import { COLORS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import ModalCallSucongoai from "../../components/Modal/ModalCallSucongoai";

const XulySuco = ({ navigation }) => {
  const dispath = useDispatch();

  const { user, authToken } = useSelector((state) => state.authReducer);
  const { tb_sucongoai } = useSelector((state) => state.tbReducer);
  const { sdt_khancap } = useSelector((state) => state.entReducer);

  const [dataSuCoNgoai, setDataSuCoNgoai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActionClick, setNewActionClick] = useState([]);
  const [opacity, setOpacity] = useState(1);
  const [userPhone, setUserPhone] = useState([]);

  const [isModalcall, setIsModalcall] = useState(false);
  const [isNghiemTrong, setIsNghiemTrong] = useState(false);

  const init_sucongoai = async () => {
    dispath(tb_sucongoai_get());
    dispath(ent_get_sdt_KhanCap());
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      init_sucongoai();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    if (tb_sucongoai) {
      setDataSuCoNgoai(tb_sucongoai);
      setLoading(false);
    }
    setLoading(false);
  }, [tb_sucongoai]);

  const toggleTodo = async (item, index) => {
    if (item.Tinhtrangxuly == 2) {
      hanldeDetailSuco(item);
    } else {
      handleChangeTinhTrang(item);
    }
  };

  const handleChangeTinhTrang = async (item) => {
    navigation.navigate("Thay đổi trạng thái", {
      item,
    });
  };

  const handleSCNghiemtrong = () => {
    setIsNghiemTrong(!isNghiemTrong);
    setDataSuCoNgoai(
      !isNghiemTrong 
        ? tb_sucongoai.filter((item) => item?.Mucdo === 1)
        : tb_sucongoai
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ent_user/getPhone`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          timeout: 10000,
        });

        setUserPhone(response.data.data);
      } catch (error) {
        console.error("Error fetching user phone:", error);
        Alert.alert("Thông báo", "Có lỗi xảy ra!", [
          {
            text: "Xác nhận",
            onPress: () => {
              console.log("OK Pressed");
            },
          },
        ]);
      }
    };

    fetchData();
  }, []);

  const hanldeDetailSuco = async (item) => {
    try {
      await axios
        .get(BASE_URL + `/tb_sucongoai/getDetail/${item.ID_Suco}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
          timeout: 10000, // 10 giây
        })
        .then((response) => {
          navigation.navigate("Chi tiết sự cố", {
            data: response.data.data,
          });
        });
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        Alert.alert("Thông báo", "Request bị timeout, vui lòng thử lại!", [
          {
            text: "Xác nhận",
            onPress: () => {
              console.log("OK Pressed");
            },
          },
        ]);
      } else {
        Alert.alert("Thông báo", "Có lỗi xảy ra!", [
          {
            text: "Xác nhận",
            onPress: () => {
              console.log("OK Pressed");
            },
          },
        ]);
      }
    }
  };

  const handleEmergencyCall = () => {
    if (!sdt_khancap) {
      Alert.alert("Thông báo", "Không có số điện thoại khẩn cấp!", [{ text: "Xác nhận" }]);
      return;
    }

    const phoneUrl = `tel:${sdt_khancap}`;
    Linking.openURL(phoneUrl).catch((error) => {
      Alert.alert("Thông báo", "Không thể thực hiện cuộc gọi!");
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => console.log("run")} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="stretch" style={{ flex: 1, width: "100%" }}>
              <View style={[styles.container, { opacity: opacity }]}>
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.warningSection}
                    onPress={handleSCNghiemtrong}
                  >
                    <Image source={require("../../../assets/icons/ic_warning_triangle.png")} style={styles.warningIcon} />
                    <Text style={{ fontSize: adjust(16), color: "white", fontWeight: "600" }}>Nghiêm trọng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.action]}
                    onPress={() =>
                      navigation.navigate("Thực hiện sự cố ngoài", {
                        userPhone: userPhone,
                      })
                    }
                  >
                    <Image source={require("../../../assets/icons/ic_plus.png")} style={{ tintColor: "white" }} />
                    <Text
                      style={{
                        fontSize: adjust(16),
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Sự cố{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  {dataSuCoNgoai.length > 0 && loading === false && (
                    <FlatList
                      style={{
                        marginHorizontal: 12,
                      }}
                      data={dataSuCoNgoai}
                      renderItem={({ item, index }) => (
                        <ItemSucongoai key={index} item={item} toggleTodo={toggleTodo} newActionClick={newActionClick} />
                      )}
                      showsVerticalScrollIndicator={false}
                      scrollEventThrottle={16}
                      ListFooterComponent={<View style={{ height: 80 }} />}
                      scrollEnabled={true}
                    />
                  )}
                  {dataSuCoNgoai.length == 0 && loading === true && <ActivityIndicator size="small" />}

                  {dataSuCoNgoai.length == 0 && loading === false && <Text style={{ textAlign: "center", color: "white" }}> Không có sự cố nào</Text>}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleEmergencyCall()}
                // onPress={() => setIsModalcall(true)}
                style={{
                  position: "absolute", // Đặt vị trí tuyệt đối
                  bottom: 10, // Điều chỉnh vị trí theo ý muốn
                  right: 10, // Điều chỉnh vị trí theo ý muốn
                  zIndex: 9999, // Đưa lên trên cùng
                  elevation: 9999, // Đảm bảo trên Android
                }}
              >
                <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
                  <Image
                    source={require("../../../assets/icons/ic_phone_green_2.png")}
                    style={{
                      width: adjust(80) * 0.8,
                      height: adjust(80) * 0.8,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalcall}
                onRequestClose={() => {
                  setIsModalcall(false);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={[styles.modalView, { width: "80%", height: "70%" }]}>
                    <ModalCallSucongoai userPhone={userPhone} setIsModalcall={setIsModalcall} />
                  </View>
                </View>
              </Modal>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default XulySuco;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 12,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  closeIcon: {
    tintColor: "white",
  },
  warningSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  warningIcon: {
    width: adjust(24),
    height: adjust(24),
  },
});
