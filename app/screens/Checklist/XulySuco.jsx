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
import ItemSucongoai from "../../components/Item/ItemSucongoai";
import { tb_sucongoai_get } from "../../redux/actions/tbActions";
import { COLORS } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";
import ModalChangeTinhTrangSuCo from "../../components/Modal/ModalChangeTinhTrangSuCo";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import axiosClient from "../../api/axiosClient";
import { formatDate } from "../../utils/util";
import * as ImagePicker from "expo-image-picker";
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
  const [modalHeight, setModalHeight] = useState(350);
  const [images, setImages] = useState([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const hangmuc = newActionClick[0]?.ent_hangmuc?.Hangmuc;

  const [dataInput, setDataInput] = useState({
    ID_Hangmuc: null,
    Noidungghichu: "",
    Duongdancacanh: [],
  });
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
      key === "status1" && val == true
        ? 0
        : key === "status2" && val == true
        ? 1
        : key === "status3" && val == true
        ? 2
        : null
    );
  };
  useEffect(() => {
    const backAction = () => {
      if (isBottomSheetOpen) {
        handleCloseTinhTrang();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isBottomSheetOpen, opacity]);

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

  // const hanldeDetailSuco = (data) => {
  //   navigation.navigate("Chi tiết sự cố", {
  //     data: data,
  //   });
  // };
  const hanldeDetailSuco = async (data) => {
    try {
      await axios
        .get(
          BASE_URL + `/tb_sucongoai/getDetail/${newActionClick[0].ID_Suco}`,
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

  const handleCloseTinhTrang = async () => {
    setModalVisible(false);
    setOpacity(1);
    setIsBottomSheetOpen(false);
  };

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const resetDataInput = () => {
    setDataInput({
      ID_Hangmuc: null,
      Noidungsuco: "",
      Duongdancacanh: [],
    });
    setChangeStatus({
      status1: false,
      status2: false,
      status3: false,
    });
    setImages([]);
  };

  const handleRemoveImage = (item) => {
    setImages(images.filter((image) => image !== item));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        "Bạn đã từ chối cho phép được sử dụng camera. Vào cài đặt và mở lại!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.5, // Adjust image quality (0 to 1)
    });

    if (!result.canceled) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages, result.assets[0].uri].filter(
          (uri) => uri
        ); // Filter out undefined or null
        return updatedImages;
      });
    }

    // if (result.canceled == true) {
    //   console.log("RUN");
    //   setImages(...prevImages,[]);
    // }
  };
  //result {"assets": null, "canceled": true}

  useEffect(() => {
    let height = 300;
    if (hangmuc === undefined) {
      if (changeStatus.status2) {
        height = 450;
      } else if (changeStatus.status3) {
        height = 600;
      } else {
        height = 450;
      }
    } else if (changeStatus.status3) {
      height = 500;
    }

    setModalHeight(height);
  }, [hangmuc, changeStatus]);

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
          {
            Tinhtrangxuly: saveStatus,
            ngayXuLy: formatDate(ngayXuLy.date),
            ID_Hangmuc: dataInput.ID_Hangmuc,
          },
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
          resetDataInput();
          setNewActionClick([]);
          Alert.alert("PMC Thông báo", "Cập nhật trạng thái thành công", [
            {
              text: "Xác nhận",
              onPress: () => {
                console.log("OK Pressed");
              },
            },
          ]);
        })
        .catch((error) => {
          resetDataInput();
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
  const handleSubmitStatusImage = async () => {
    let formData = new FormData();
    images.map((item, index) => {
      const file = {
        uri: Platform.OS === "android" ? item : item.replace("file://", ""),
        name:
          Math.floor(Math.random() * Math.floor(99999999999999)) +
          index +
          ".jpeg",
        type: "image/jpeg",
      };

      formData.append(`Images`, file);
    });
    formData.append("Tinhtrangxuly", saveStatus);
    formData.append("Ghichu", dataInput.Noidungghichu);
    formData.append("ngayXuLy", formatDate(ngayXuLy.date));
    formData.append("ID_Hangmuc", dataInput.ID_Hangmuc);
    if (saveStatus == null) {
      Alert.alert("PMC Thông báo", "Phải chọn trạng thái", [
        {
          text: "Hủy",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      setLoadingStatus(true);
      await axios
        .put(
          BASE_URL + `/tb_sucongoai/status/${newActionClick[0].ID_Suco}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authToken,
            },
          }
        )
        .then(() => {
          setLoadingStatus(false);
          resetDataInput();
          setChangeStatus({
            status1: false,
            status2: false,
            status3: false,
          });
          setSaveStatus(null);
          handleCloseTinhTrang();
          init_sucongoai();
          setNewActionClick([]);
          Alert.alert("PMC Thông báo", "Cập nhật trạng thái thành công", [
            {
              text: "Xác nhận",
              onPress: () => {
                console.log("OK Pressed");
              },
            },
          ]);
        })
        .catch((error) => {
          setLoadingStatus(false);
          resetDataInput();
          if (error.response) {
            Alert.alert("PMC Thông báo", error.response.data.message, [
              {
                text: "Hủy",
                onPress: () => {
                  console.log("Cancel Pressed");
                },
                style: "cancel",
              },
              {
                text: "Xác nhận",
                onPress: () => {
                  console.log("OK Pressed");
                },
              },
            ]);
          } else if (error.request) {
            Alert.alert(
              "PMC Thông báo",
              "Không nhận được phản hồi từ máy chủ",
              [
                {
                  text: "Hủy",
                  onPress: () => {
                    console.log("Cancel Pressed");
                  },
                  style: "cancel",
                },
                {
                  text: "Xác nhận",
                  onPress: () => {
                    console.log("OK Pressed");
                  },
                },
              ]
            );
          } else {
            // Lỗi khi cấu hình request
            Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
              {
                text: "Hủy",
                onPress: () => {
                  console.log("Cancel Pressed");
                },
                style: "cancel",
              },
              {
                text: "Xác nhận",
                onPress: () => {
                  console.log("OK Pressed");
                },
              },
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
                // onRequestClose={() => {
                //   setModalVisible(!modalVisible);
                // }}
                onRequestClose={() => {
                  handleCloseTinhTrang();
                }}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                  keyboardVerticalOffset={
                    Platform.OS === "ios" && modalVisible ? 0 : 0
                  }
                >
                  <View style={styles.centeredView}>
                    <View
                      style={[
                        styles.modalView,
                        { width: "80%", height: modalHeight, minHeight: 350 },
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
                          handleSubmitStatusImage={handleSubmitStatusImage}
                          images={images}
                          handleRemoveImage={handleRemoveImage}
                          pickImage={pickImage}
                          dataInput={dataInput}
                          handleChangeText={handleChangeText}
                          resetDataInput={resetDataInput}
                          setDataInput={setDataInput}
                          modalHeight={modalHeight}
                          setModalHeight={setModalHeight}
                          newActionClick={newActionClick}
                        />
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
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
                      onPress={() => {
                        handleChangeTinhTrang(newActionClick[0]),
                          setSaveStatus();
                      }}
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
