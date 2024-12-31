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
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";
import ItemSucongoai from "../../components/Item/ItemSucongoai";
import { tb_sucongoai_get } from "../../redux/actions/tbActions";
import { COLORS } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../../constants/config";

const XulySuco = ({ navigation }) => {
  const dispath = useDispatch();

  const { user, authToken } = useSelector((state) => state.authReducer);
  const { tb_sucongoai } = useSelector((state) => state.tbReducer);

  const [dataSuCoNgoai, setDataSuCoNgoai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActionClick, setNewActionClick] = useState([]);
  const [opacity, setOpacity] = useState(1);
  const [userPhone, setUserPhone] = useState([]);

  const init_sucongoai = async () => {
    await dispath(tb_sucongoai_get());
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
    if(item.Tinhtrangxuly == 2){
      hanldeDetailSuco(item);
    } else {
      handleChangeTinhTrang(item)
    }
  };

  const handleChangeTinhTrang = async (item) => {
    navigation.navigate("Thay đổi trạng thái", {
      item,
    });
  };

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
        Alert.alert("PMC Thông báo", "Có lỗi xảy ra!", [
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
        .get(
          BASE_URL + `/tb_sucongoai/getDetail/${item.ID_Suco}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
            timeout: 10000, // 10 giây
          }
        )
        .then((response) => {
          navigation.navigate("Chi tiết sự cố", {
            data: response.data.data,
          });
        });
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        Alert.alert("PMC Thông báo", "Request bị timeout, vui lòng thử lại!", [
          {
            text: "Xác nhận",
            onPress: () => {
              console.log("OK Pressed");
            },
          },
        ]);
      } else {
        Alert.alert("PMC Thông báo", "Có lỗi xảy ra!", [
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => console.log("run")}
          accessible={false}
        >
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg_new.png")}
              resizeMode="stretch"
              style={{ flex: 1, width: "100%" }}
            >
              <View style={[styles.container, { opacity: opacity }]}>
                <View style={styles.header}>
                  <View></View>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() =>
                      navigation.navigate("Thực hiện sự cố ngoài", {
                        userPhone: userPhone,
                      })
                    }
                  >
                    <Image
                      source={require("../../../assets/icons/ic_plus.png")}
                      style={styles.closeIcon}
                    />
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
                        <ItemSucongoai
                          key={index}
                          item={item}
                          toggleTodo={toggleTodo}
                          newActionClick={newActionClick}
                        />
                      )}
                      showsVerticalScrollIndicator={false}
                      scrollEventThrottle={16}
                      ListFooterComponent={<View style={{ height: 80 }} />}
                      scrollEnabled={true}
                    />
                  )}
                  {dataSuCoNgoai.length == 0 && loading === true && (
                    <ActivityIndicator size="small" />
                  )}

                  {dataSuCoNgoai.length == 0 && loading === false && (
                    <Text style={{ textAlign: "center", color: "white" }}>
                      {" "}
                      Không có sự cố nào
                    </Text>
                  )}
                </View>
              </View>
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
  closeIcon: {
    tintColor: "white",
  },
});
