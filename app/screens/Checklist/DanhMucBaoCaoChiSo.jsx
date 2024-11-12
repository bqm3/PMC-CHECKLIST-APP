import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedbackBase,
  TouchableHighlight,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import adjust from "../../adjust";
import ItemChiSo from "../../components/Item/ItemChiSo";
import { baocaochiso_get } from "../../redux/actions/tbActions";
import { COLORS } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";
import ModalChangeTinhTrangSuCo from "../../components/Modal/ModalChangeTinhTrangSuCo";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import { formatDate } from "../../utils/util";
import * as ImagePicker from "expo-image-picker";

const DanhMucBaoCaoChiSo = ({ navigation }) => {
  const dispath = useDispatch();

  const { user, authToken } = useSelector((state) => state.authReducer);
  const { baocaochiso } = useSelector((state) => state.tbReducer);

  const [dataChiSo, setDataChiSo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActionClick, setNewActionClick] = useState([]);

  const init_baocaochiso = async () => {
    await dispath(baocaochiso_get());
  };

  useEffect(() => {
    init_baocaochiso();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (baocaochiso) {
      setDataChiSo(baocaochiso);
      setLoading(false);
    }
    setLoading(false);
  }, [baocaochiso]);

  const toggleTodo = async (item, index) => {
    const isExistIndex = newActionClick.findIndex(
      (existingItem) => existingItem.ID_Baocaochiso === item.ID_Baocaochiso
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionClick((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      setNewActionClick([item]);
    }
  };

  const handleChangeTinhTrang = async (data) => {
    Alert.alert(
      "PMC Thông báo",
      `Bạn muốn xóa báo cáo chỉ số tháng ${data.Month}`,
      [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => handleDelete(data) },
      ]
    );
  };

  const handleDelete = async (data) => {
    await axios
      .put(BASE_URL + `/ent_baocaochiso/delete/${data.ID_Baocaochiso}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        setDataChiSo((prevData) =>
          prevData.filter((item) => item.ID_Baocaochiso !== data.ID_Baocaochiso)
        );
        Alert.alert(
          "PMC Thông báo",
          `Xóa thành công. Lịch sử xóa sẽ được lưu trữ`,
          [{ text: "Xác nhận", onPress: () => console.log("Cancel Pressed") }]
        );
      })
      .catch((error) => {
        Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ]);
      });
  };

  const hanldeDetailSuco = async (data) => {
    navigation.navigate("Thực hiện thay đổi chỉ số", {
      dataChiSo: data,
    });
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
              <View style={[styles.container]}>
                <View style={styles.header}>
                  <View></View>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => navigation.navigate("Thực hiện chỉ số")}
                  >
                    <AntDesign name="pluscircle" size={24} color="white" />
                    <Text
                      style={{
                        fontSize: adjust(16),
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Chỉ số{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  {dataChiSo.length > 0 && loading === false && (
                    <FlatList
                      style={{
                        marginHorizontal: 12,
                      }}
                      data={dataChiSo}
                      renderItem={({ item, index }) => (
                        <ItemChiSo
                          key={index}
                          item={item}
                          toggleTodo={toggleTodo}
                          newActionClick={newActionClick}
                        />
                      )}
                      scrollEventThrottle={16}
                      ListFooterComponent={<View style={{ height: 80 }} />}
                      scrollEnabled={true}
                    />
                  )}
                  {dataChiSo.length == 0 && loading === true && (
                    <ActivityIndicator size="small" />
                  )}

                  {dataChiSo.length == 0 && loading === false && (
                    <Text style={{ textAlign: "center", color: "white" }}>
                      {" "}
                      Không có báo cáo chỉ số nào
                    </Text>
                  )}
                </View>
              </View>

              {newActionClick?.length > 0 && (
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
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: COLORS.bg_red }]}
                    onPress={() => handleChangeTinhTrang(newActionClick[0])}
                  >
                    <Feather name="delete" size={26} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => hanldeDetailSuco(newActionClick[0])}
                  >
                    <Feather name="log-in" size={26} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DanhMucBaoCaoChiSo;

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
    gap: 8,
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
});
