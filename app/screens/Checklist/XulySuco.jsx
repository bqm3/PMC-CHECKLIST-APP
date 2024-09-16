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
} from "react-native";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import adjust from "../../adjust";
import ItemSucongoai from "../../components/Item/ItemSucongoai";
import { tb_sucongoai_get } from "../../redux/actions/tbActions";
import { COLORS } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";
import ModalChangeTinhTrangSuCo from "../../components/Modal/ModalChangeTinhTrangSuCo";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";

const XulySuco = ({ navigation }) => {
  const dispath = useDispatch();

  const { user, authToken } = useSelector((state) => state.authReducer);
  const { tb_sucongoai } = useSelector((state) => state.tbReducer);

  const [dataSuCoNgoai, setDataSuCoNgoai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActionClick, setNewActionClick] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [changeStatus, setChangeStatus] = useState({
    status1: false,
    status2: false,
    status3: false,
  });
  const [ngayXuLy, setNgayXuLy] = useState({
    date: moment(new Date()).format("DD-MM-YYYY"),
    isCheck: false,
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const init_sucongoai = async () => {
    await dispath(tb_sucongoai_get());
  };

  const handleChangeDate = (key, value) => {
    setNgayXuLy((data) => ({
      ...data,
      [key]: value,
    }));
  };

  useEffect(() => {
    setLoading(true);
    init_sucongoai();
  }, []);

  const handleChangeStatus = (key, val) => {
    setChangeStatus((prevStatus) => {
      const updatedStatus = Object.keys(prevStatus).reduce(
        (acc, currentKey) => {
          // Đặt tất cả các key khác thành false, chỉ set key hiện tại thành val
          acc[currentKey] = currentKey === key ? val : false;
          return acc;
        },
        {}
      );

      return updatedStatus;
    });
    setSaveStatus(
      key === "status1"
        ? 0
        : key === "status2"
        ? 1
        : key === "status3"
        ? 2
        : null
    );
  };

  useEffect(() => {
    setLoading(true);
    if (tb_sucongoai) {
      setDataSuCoNgoai(tb_sucongoai);
      setLoading(false);
    }
    setLoading(false);
  }, [tb_sucongoai]);

  const toggleTodo = async (item, index) => {
    // setIsCheckbox(true);
    const isExistIndex = newActionClick.findIndex(
      (existingItem) => existingItem.ID_Suco === item.ID_Suco
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionClick((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionClick([item]);
    }
  };

  const handleChangeTinhTrang = async () => {
    setModalVisible(true);
    setOpacity(0.2);
  };

  const hanldeDetailSuco = (data) => {
    navigation.navigate("Chi tiết sự cố", {
      data: data,
    });
  };

  const handleCloseTinhTrang = async (data) => {
    setModalVisible(false);
    setOpacity(1);
  };

  const handleSubmitStatus = async () => {
    if (saveStatus == null) {
      Alert.alert("PMC Thông báo", "Phải chọn trạng thái", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      setLoadingStatus(true);
      await axios
        .put(
          BASE_URL + `/tb_sucongoai/status/${newActionClick[0].ID_Suco}`,
          { Tinhtrangxuly: saveStatus, ngayXuLy: ngayXuLy.date },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
          }
        )
        .then(() => {
          setLoadingStatus(false);
          setChangeStatus({
            status1: false,
            status2: false,
            status3: false,
          });
          setSaveStatus(null);
          handleCloseTinhTrang();
          init_sucongoai();
          Alert.alert("PMC Thông báo", "Cập nhật trạng thái thành công", [
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((error) => {
          setLoadingStatus(false);
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

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View
                    style={[
                      styles.modalView,
                      { width: "80%", height: "auto", minHeight: 350 },
                    ]}
                  >
                    <View style={styles.contentContainer}>
                      <ModalChangeTinhTrangSuCo
                        handleChangeStatus={handleChangeStatus}
                        changeStatus={changeStatus}
                        handleCloseTinhTrang={handleCloseTinhTrang}
                        handleSubmitStatus={handleSubmitStatus}
                        loadingStatus={loadingStatus}
                        handleChangeDate={handleChangeDate}
                        ngayXuLy={ngayXuLy}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
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
                  {(newActionClick[0]?.Tinhtrangxuly == 0 ||
                    newActionClick[0]?.Tinhtrangxuly == 1) && (
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: COLORS.bg_red },
                      ]}
                      onPress={() => handleChangeTinhTrang(newActionClick[0])}
                    >
                      <Feather name="repeat" size={26} color="white" />
                    </TouchableOpacity>
                  )}

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

export default XulySuco;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 12,
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
