import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import { ent_khuvuc_get, ent_toanha_get, ent_hangmuc_get } from "../../redux/actions/entActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { COLORS, SIZES } from "../../constants/theme";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import VerticalSelect from "../../components/Vertical/VerticalSelect";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo, AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import Checkbox from "expo-checkbox";
import adjust from "../../adjust";
import moment from "moment";
import axios from "axios";
import ExpoTokenContext from "../../context/ExpoTokenContext";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { formatDate, getImageUrls } from "../../utils/util";
import { BASE_URL } from "../../constants/config";

const ChangeTinhTrangSuCo = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;

  const dispath = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { ent_khuvuc, ent_khoicv, ent_toanha, ent_hangmuc } = useSelector((state) => state.entReducer);
  const { token } = useContext(ExpoTokenContext);
  const [dataKhuvuc, setDataKhuvuc] = useState([]);
  const [dataHangmuc, setDataHangmuc] = useState([]);
  const [isShowImage, setIsShowImage] = useState(false);
  const [dataImage, setDataImage] = useState(null);
  const [dataCheckKhuvuc, setDataCheckKhuvuc] = useState({
    ID_Toanha: null,
    ID_Khuvuc: null,
  });
  const [isCheckhangmuc, setHangMuc] = useState(item?.ent_hangmuc?.Hangmuc);
  const tinhTrang = item?.Tinhtrangxuly;
  let hangmuc = item?.ent_hangmuc?.Hangmuc;
  const formattedTime = item?.Giosuco != undefined ? `${item?.Giosuco?.slice(0, 5)} ` : "";

  const [images, setImages] = useState([]);
  const imagesSuco = item?.Duongdancacanh ? item.Duongdancacanh.split(",") : [];

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [ngayXuLy, setNgayXuLy] = useState({
    date: moment(new Date()).format("DD-MM-YYYY"),
    isCheck: false,
  });

  const [changeStatus, setChangeStatus] = useState({
    status1: false,
    status2: false,
    status3: false,
  });

  const [dataInput, setDataInput] = useState({
    ID_Hangmuc: null,
    Noidungghichu: "",
    Bienphapxuly: "",
    Duongdancacanh: [],
  });

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  useEffect(() => {
    init_toanha();
    init_hangmuc();
    init_khuvuc();
  }, []);

  useEffect(() => {
    if (ent_khuvuc && dataCheckKhuvuc.ID_Toanha) {
      const filterData = ent_khuvuc.filter((item) => item.ID_Toanha === dataCheckKhuvuc.ID_Toanha);
      setDataKhuvuc(filterData);
      if (filterData.length == 0) {
        dataCheckKhuvuc.ID_Khuvuc = [];
      }
    }

    if (ent_hangmuc && dataCheckKhuvuc?.ID_Khuvuc) {
      const filterData = ent_hangmuc.filter((item) => item.ID_Khuvuc === dataCheckKhuvuc.ID_Khuvuc);
      setDataHangmuc(filterData);
    } else if (dataKhuvuc.length === 0) {
      setDataHangmuc([]);
    }
  }, [ent_khuvuc, ent_hangmuc, dataCheckKhuvuc]);

  const handleChangeStatus = (key, val) => {
    setChangeStatus((prevStatus) => {
      const updatedStatus = Object.keys(prevStatus).reduce((acc, currentKey) => {
        // Đặt tất cả các key khác thành false, chỉ set key hiện tại thành val
        acc[currentKey] = currentKey === key ? val : false;
        return acc;
      }, {});

      return updatedStatus;
    });
    setSaveStatus(key === "status1" && val == true ? 0 : key === "status2" && val == true ? 1 : key === "status3" && val == true ? 2 : null);
  };

  const resetDataInput = () => {
    setDataInput({
      Bienphapxuly: "",
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

  const handleShowImage = (img) => {
    setIsShowImage(true);
    setDataImage(img);
  };

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeDate = (key, value) => {
    setNgayXuLy((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeTextKhuVuc = (key, value) => {
    setDataCheckKhuvuc((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    Alert.alert(
      "Chọn ảnh",
      "Bạn muốn chụp ảnh hay chọn ảnh từ thư viện?",
      [
        {
          text: "Chụp ảnh",
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
              alert("Bạn đã từ chối cho phép sử dụng camera. Vào cài đặt và mở lại!");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              aspect: [4, 3],
              quality: 0.8, // Adjust image quality (0 to 1)
            });

            if (!result.canceled) {
              // Resize the image
              const resizedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 800 } }], // Resize to a width of 800px
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress and save as JPEG
              );

              // Add the resized image URI to state
              setImages((prevImages) => [...prevImages, resizedImage.uri]);
            }
          },
        },
        {
          text: "Chọn từ thư viện",
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
              alert("Bạn đã từ chối cho phép sử dụng thư viện. Vào cài đặt và mở lại!");
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              aspect: [4, 3],
              quality: 0.8, // Adjust image quality (0 to 1)
            });

            if (!result.canceled) {
              // Resize the image
              const resizedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 800 } }], // Resize to a width of 800px
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress and save as JPEG
              );

              // Add the resized image URI to state
              setImages((prevImages) => [...prevImages, resizedImage.uri]);
            }
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveImage = (item) => {
    setImages(images.filter((image) => image !== item));
  };

  const handleAlertUpdate = () => {
    Alert.alert("PMC Thông báo", "Bạn có chắc muốn cập nhật sự cố này ?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => handleSubmit(),
        style: "default",
      },
    ]);
  };

  const handleSubmit = () => {
    if (isCheckhangmuc == undefined && item?.TenHangmuc == null) {
      Alert.alert("PMC Thông báo", "Phải chọn hạng mục", [
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
      if (changeStatus?.status3) {
        handleSubmitStatusImage();
      } else {
        handleSubmitStatus();
      }
    }
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
          BASE_URL + `/tb_sucongoai/status/${item.ID_Suco}`,
          {
            Tinhtrangxuly: saveStatus,
            ngayXuLy: formatDate(ngayXuLy.date),
            ID_Hangmuc: dataInput.ID_Hangmuc != null ? dataInput.ID_Hangmuc : null,
            deviceHandler: token,
            deviceNameHandler: Device.modelName,
            Bienphapxuly: dataInput.Bienphapxuly,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
          }
        )
        .then(() => {
          // setLoadingStatus(false);
          setChangeStatus({
            status1: false,
            status2: false,
            status3: false,
          });
          resetDataInput();
          Alert.alert("PMC Thông báo", "Cập nhật trạng thái thành công", [
            {
              text: "Xác nhận",
              onPress: () => {
                console.log("OK Pressed"), navigation.goBack();
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
        });
    }
  };

  const handleSubmitStatusImage = async () => {
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
      return;
    }

    setLoadingStatus(true);
    let formData = new FormData();

    // Loop through images and resize each one before appending
    for (let index = 0; index < images.length; index++) {
      let item = images[index];

      // Resize the image using expo-image-manipulator
      const resizedImage = await ImageManipulator.manipulateAsync(
        item, // The URI of the image to resize
        [{ resize: { width: 800, height: 600 } }], // Set desired width and height (adjust as needed)
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // Set compression quality and format
      );

      const file = {
        uri: Platform.OS === "android" ? resizedImage.uri : resizedImage.uri.replace("file://", ""),
        name: Math.floor(Math.random() * 99999999999999) + index + ".jpg", // Random filename
        type: "image/jpg",
      };

      formData.append(`Images_${index}`, file);
    }

    // Append other form data
    formData.append("Tinhtrangxuly", saveStatus);
    formData.append("Ghichu", dataInput.Noidungghichu);
    formData.append("ngayXuLy", formatDate(ngayXuLy.date));
    formData.append("ID_Hangmuc", dataInput.ID_Hangmuc != null ? dataInput.ID_Hangmuc : null);
    formData.append("deviceHandler", token);
    formData.append("deviceNameHandler", Device.modelName);
    formData.append("Bienphapxuly", dataInput.Bienphapxuly);

    // Send the request to the server
    try {
      const response = await axios.put(BASE_URL + `/tb_sucongoai/status/${item.ID_Suco}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authToken,
        },
      });

      setLoadingStatus(false);
      resetDataInput();
      Alert.alert("PMC Thông báo", "Cập nhật trạng thái thành công", [
        {
          text: "Xác nhận",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      setLoadingStatus(false);
      Alert.alert("PMC Thông báo", "Có lỗi xảy ra", [
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
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="stretch" style={{ flex: 1, width: "100%" }}>
            <View style={{ flex: 1 }}>
              {isShowImage && (
                <View style={styles.container}>
                  <Image
                    style={{
                      height: "100%",
                      width: "100%",
                      resizeMode: "contain",
                    }}
                    source={{
                      uri: getImageUrls(3, dataImage),
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 50,
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => setIsShowImage(false)}
                  >
                    <AntDesign name="close" size={adjust(40)} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === "ios" ? 120 : 140}
                keyboardOpeningTime={0}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View
                  style={{
                    margin: 10,
                    flex: 1,
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginBottom: adjust(60),
                  }}
                >
                  <View>
                    <View>
                      <Text style={styles.header}>
                        Tình trạng:{" "}
                        {(item.Tinhtrangxuly == 0 && "Chưa xử lý") ||
                          (item.Tinhtrangxuly == 1 && "Đang xử lý") ||
                          (item.Tinhtrangxuly == 2 && "Đã xử lý")}
                      </Text>
                      <Text style={styles.header}>Mức độ: {(item?.Mucdo == 0 && "Bình thường") || (item?.Mucdo == 1 && "Nghiêm trọng")}</Text>
                      {(`${hangmuc}` == `undefined` || `${hangmuc}` == `null`) && `${item?.TenHangmuc}` == `null` ? (
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View style={{ width: "49%" }}>
                              <Text allowFontScaling={false} style={styles.text}>
                                Tòa nhà
                              </Text>
                              {ent_toanha && ent_toanha?.length > 0 ? (
                                <SelectDropdown
                                  data={ent_toanha}
                                  buttonStyle={styles.select}
                                  dropdownStyle={{
                                    borderRadius: 8,
                                    maxHeight: 400,
                                  }}
                                  defaultButtonText={"Tòa nhà"}
                                  buttonTextStyle={styles.customText}
                                  // defaultValue={defaultToaNha}
                                  onSelect={(selectedItem, index) => {
                                    handleChangeTextKhuVuc("ID_Toanha", selectedItem.ID_Toanha);
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} color={"#637381"} size={14} />;
                                  }}
                                  dropdownIconPosition={"right"}
                                  buttonTextAfterSelection={(selectedItem, index) => {
                                    return (
                                      <Text allowFontScaling={false} style={[styles.text, { color: "black" }]}>
                                        {selectedItem?.Toanha}
                                      </Text>
                                    );
                                  }}
                                  renderCustomizedRowChild={(item, index) => {
                                    return (
                                      <VerticalSelect
                                        value={item.ID_Toanha}
                                        label={item.Toanha}
                                        key={index}
                                        selectedItem={dataCheckKhuvuc.ID_Toanha}
                                      />
                                    );
                                  }}
                                />
                              ) : (
                                <Text allowFontScaling={false} style={styles.errorText}>
                                  Không có dữ liệu tòa nhà.
                                </Text>
                              )}
                            </View>

                            <View style={{ width: "49%" }}>
                              <Text allowFontScaling={false} style={styles.text}>
                                Khu vực
                              </Text>
                              {dataKhuvuc && dataKhuvuc?.length > 0 ? (
                                <SelectDropdown
                                  data={dataKhuvuc ? dataKhuvuc : []}
                                  buttonStyle={styles.select}
                                  dropdownStyle={{
                                    borderRadius: 8,
                                    maxHeight: 400,
                                    minWidth: 200,
                                    position: "absolute",
                                    top: 0,
                                    left: 200,
                                  }}
                                  // rowStyle={{ height: 50, justifyContent: "center" }}
                                  defaultButtonText={"Khu vực"}
                                  buttonTextStyle={styles.customText}
                                  // defaultValue={defaultKhuvuc}
                                  onSelect={(selectedItem, index) => {
                                    handleChangeTextKhuVuc("ID_Khuvuc", selectedItem.ID_Khuvuc);
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} color={"#637381"} size={14} />;
                                  }}
                                  dropdownIconPosition={"right"}
                                  buttonTextAfterSelection={(selectedItem, index) => {
                                    return (
                                      <Text allowFontScaling={false} style={[styles.text, { color: "black" }]}>
                                        {selectedItem?.Tenkhuvuc}
                                      </Text>
                                    );
                                  }}
                                  renderCustomizedRowChild={(item, index) => {
                                    return (
                                      <VerticalSelect
                                        value={item.ID_Khuvuc}
                                        label={item.Tenkhuvuc}
                                        key={index}
                                        selectedItem={dataCheckKhuvuc.ID_Khuvuc}
                                      />
                                    );
                                  }}
                                />
                              ) : (
                                <Text allowFontScaling={false} style={styles.errorText}>
                                  Không có dữ liệu khu vực
                                </Text>
                              )}
                            </View>
                          </View>
                          <View style={{ width: "100%" }}>
                            {dataHangmuc && dataHangmuc?.length > 0 && (
                              <View>
                                <Text allowFontScaling={false} style={styles.text}>
                                  Hạng mục
                                </Text>
                                <SelectDropdown
                                  data={dataHangmuc}
                                  buttonStyle={[styles.select]}
                                  dropdownStyle={{
                                    borderRadius: 8,
                                    maxHeight: 400,
                                  }}
                                  defaultButtonText={"Hạng mục"}
                                  buttonTextStyle={[styles.customText]}
                                  // defaultValue={defaultHangmuc}
                                  onSelect={(selectedItem, index) => {
                                    handleChangeText("ID_Hangmuc", selectedItem.ID_Hangmuc);
                                    setHangMuc(selectedItem.ID_Hangmuc);
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <FontAwesome
                                        name={isOpened ? "chevron-up" : "chevron-down"}
                                        color={"black"}
                                        size={14}
                                        style={{ marginRight: 10 }}
                                      />
                                    );
                                  }}
                                  dropdownIconPosition={"right"}
                                  buttonTextAfterSelection={(selectedItem, index) => {
                                    return (
                                      <Text
                                        allowFontScaling={false}
                                        style={[
                                          styles.text,
                                          {
                                            color: "black",
                                            textAlign: "center",
                                          },
                                        ]}
                                      >
                                        {selectedItem?.Hangmuc}
                                      </Text>
                                    );
                                  }}
                                  renderCustomizedRowChild={(item, index) => {
                                    return (
                                      <VerticalSelect value={item.ID_Hangmuc} label={item.Hangmuc} key={index} selectedItem={dataInput.ID_Hangmuc} />
                                    );
                                  }}
                                />
                              </View>
                            )}
                          </View>
                        </View>
                      ) : (
                        <View style={{ width: "100%" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            Hạng mục
                          </Text>

                          <View style={styles.action}>
                            <TextInput
                              allowFontScaling={false}
                              value={item?.TenHangmuc || item?.ent_hangmuc?.Hangmuc || "Chưa có hạng mục"}
                              editable={false}
                              placeholder="Hạng mục"
                              placeholderTextColor="gray"
                              style={{
                                paddingLeft: 12,
                                color: "#05375a",
                                width: "90%",
                                fontSize: adjust(16),
                                height: adjust(50),
                              }}
                              pointerEvents="none"
                            />
                          </View>
                        </View>
                      )}
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Người gửi
                        </Text>
                        <View style={styles.action}>
                          <TextInput
                            allowFontScaling={false}
                            value={`${item?.ent_user?.Hoten} - ${item?.ent_user?.ent_chucvu?.Chucvu}`}
                            editable={false}
                            placeholder="Hạng mục"
                            placeholderTextColor="gray"
                            style={{
                              paddingLeft: 12,
                              color: "#05375a",
                              width: "90%",
                              fontSize: adjust(16),
                              height: adjust(50),
                            }}
                            pointerEvents="none"
                          />
                        </View>
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Ngày giờ sự cố
                        </Text>

                        <View style={styles.action}>
                          <TextInput
                            allowFontScaling={false}
                            value={`${formattedTime}${moment(item?.Ngaysuco).format("DD-MM-YYYY")}`}
                            editable={false}
                            placeholder="Hạng mục"
                            placeholderTextColor="gray"
                            style={{
                              paddingLeft: 12,
                              color: "#05375a",
                              width: "90%",
                              fontSize: adjust(16),
                              height: adjust(50),
                            }}
                            pointerEvents="none"
                          />
                        </View>
                      </View>

                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Nội dung sự cố
                        </Text>
                        <View style={styles.inputs}>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.textInput,
                              {
                                paddingHorizontal: 10,
                                textAlignVertical: "top",
                                minHeight: 70, // Chiều cao tối thiểu, sẽ mở rộng nếu nội dung dài
                                color: "#05375a",
                              },
                            ]}
                          >
                            {item?.Noidungsuco || "Nội dung sự cố"}
                          </Text>
                        </View>
                      </View>

                      {imagesSuco?.length > 0 && (
                        <View style={{ width: "100%" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            Hình ảnh
                          </Text>
                          <FlatList
                            horizontal={true}
                            contentContainerStyle={{
                              flexGrow: 1,
                              gap: 12,
                            }}
                            data={imagesSuco}
                            renderItem={({ item, index }) => (
                              <View>
                                <Image
                                  source={{
                                    uri: getImageUrls(3, item),
                                  }}
                                  style={{
                                    width: 100,
                                    height: 140,
                                    position: "relative",
                                    opacity: 0.9,
                                  }}
                                />
                                <TouchableOpacity
                                  style={{
                                    position: "absolute",
                                    top: 40,
                                    left: 30,
                                    width: 50,
                                    height: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  onPress={() => handleShowImage(item)}
                                >
                                  <Feather name="zoom-in" size={adjust(30)} color="gray" />
                                </TouchableOpacity>
                              </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEventThrottle={16}
                            scrollEnabled={true}
                          />
                        </View>
                      )}

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                      >
                        {tinhTrang != 0 ? (
                          <View style={styles.section}>
                            <Checkbox
                              style={styles.checkbox}
                              value={changeStatus?.status1}
                              onValueChange={() => {
                                handleChangeStatus("status1", !changeStatus?.status1);
                              }}
                              color={changeStatus?.status1 ? "#4630EB" : undefined}
                            />
                            <Text style={styles.paragraph}>Chưa xử lý</Text>
                          </View>
                        ) : null}
                        {tinhTrang != 1 ? (
                          <View style={styles.section}>
                            <Checkbox
                              style={styles.checkbox}
                              value={changeStatus?.status2}
                              onValueChange={() => {
                                handleChangeStatus("status2", !changeStatus?.status2);
                              }}
                              color={changeStatus?.status2 ? "#4630EB" : undefined}
                            />
                            <Text style={styles.paragraph}>Đang xử lý</Text>
                          </View>
                        ) : null}
                        <View style={styles.section}>
                          <Checkbox
                            style={styles.checkbox}
                            value={changeStatus?.status3}
                            onValueChange={() => {
                              handleChangeStatus("status3", !changeStatus?.status3);
                            }}
                            color={changeStatus?.status3 ? "#4630EB" : undefined}
                          />
                          <Text style={styles.paragraph}>Đã xử lý</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ width: "100%" }}>
                      <Text allowFontScaling={false} style={styles.text}>
                        Ngày xử lý
                      </Text>
                      <TouchableOpacity onPress={() => handleChangeDate("isCheck", true)}>
                        <View style={styles.action}>
                          <TextInput
                            allowFontScaling={false}
                            value={ngayXuLy.date}
                            placeholder="Nhập ngày xử lý"
                            placeholderTextColor="gray"
                            style={{
                              paddingLeft: 12,
                              color: "#05375a",
                              width: "80%",
                              fontSize: adjust(16),
                              height: adjust(50),
                            }}
                            pointerEvents="none"
                          />
                          <TouchableOpacity
                            onPress={() => handleChangeDate("isCheck", true)}
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              height: adjust(50),
                              width: adjust(50),
                            }}
                          >
                            <AntDesign name="calendar" size={24} color="black" />
                          </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                          isVisible={ngayXuLy.isCheck}
                          mode="date"
                          isDarkModeEnabled={true}
                          maximumDate={new Date()}
                          date={new Date()}
                          onConfirm={(date) => {
                            handleChangeDate("date", moment(date).format("DD-MM-YYYY"));
                            handleChangeDate("isCheck", false);
                          }}
                          onCancel={() => handleChangeDate("isCheck", false)}
                        />
                      </TouchableOpacity>
                    </View>
                    {changeStatus?.status3 && (
                      <View>
                        {/* Nội dung sự cố */}
                        <Text allowFontScaling={false} style={styles.text}>
                          Biện pháp xử lý
                        </Text>
                        <TextInput
                          allowFontScaling={false}
                          placeholder="Biện pháp xử lý"
                          placeholderTextColor="gray"
                          textAlignVertical="top"
                          multiline={true}
                          blurOnSubmit={true}
                          value={dataInput.Bienphapxuly}
                          style={[
                            styles.textInput,
                            {
                              paddingHorizontal: 10,
                              height: 70,
                            },
                          ]}
                          onChangeText={(text) => {
                            handleChangeText("Bienphapxuly", text);
                          }}
                        />
                        <Text allowFontScaling={false} style={styles.text}>
                          Ghi chú
                        </Text>
                        <TextInput
                          allowFontScaling={false}
                          placeholder="Nội dung"
                          placeholderTextColor="gray"
                          textAlignVertical="top"
                          multiline={true}
                          blurOnSubmit={true}
                          value={dataInput.Noidungghichu}
                          style={[
                            styles.textInput,
                            {
                              paddingHorizontal: 10,
                              height: 50,
                            },
                          ]}
                          onChangeText={(text) => {
                            handleChangeText("Noidungghichu", text);
                          }}
                        />

                        {/* Hình ảnh */}
                        <Text allowFontScaling={false} style={styles.text}>
                          Hình ảnh
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "white",
                              padding: SIZES.padding,
                              borderRadius: SIZES.borderRadius,
                              borderColor: COLORS.bg_button,
                              borderWidth: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              height: 60,
                              width: 60,
                            }}
                            onPress={() => pickImage()}
                          >
                            <Entypo name="camera" size={20} color="black" />
                          </TouchableOpacity>
                          {images.length > 0 && (
                            <FlatList
                              horizontal={true}
                              contentContainerStyle={{ flexGrow: 1 }}
                              data={images}
                              renderItem={({ item, index }) => (
                                <View style={{ marginLeft: 10 }}>
                                  <Image
                                    source={{ uri: item }}
                                    style={{
                                      width: 80,
                                      height: 100,
                                      position: "relative",
                                      opacity: 0.8,
                                    }}
                                  />
                                  <TouchableOpacity
                                    style={{
                                      position: "absolute",
                                      top: 30,
                                      left: 15,
                                      width: 50,
                                      height: 50,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onPress={() => handleRemoveImage(item)}
                                  >
                                    <FontAwesome name="remove" size={adjust(30)} color="white" />
                                  </TouchableOpacity>
                                </View>
                              )}
                              keyExtractor={(item, index) => index.toString()}
                              scrollEventThrottle={16}
                              scrollEnabled={true}
                            />
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </KeyboardAwareScrollView>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                }}
              >
                <ButtonSubmit
                  text={"Cập nhật"}
                  backgroundColor={COLORS.bg_button}
                  color={"white"}
                  onPress={() => handleAlertUpdate()}
                  isLoading={loadingStatus}
                />
              </View>
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ChangeTinhTrangSuCo;

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  checkbox: {
    backgroundColor: "white",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  text2: {
    fontSize: 14,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
    textAlign: "left",
  },
  action: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
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
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: adjust(30),
    paddingVertical: 4,
    backgroundColor: "white",
  },

  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: adjust(50),
  },
  customText: {
    fontWeight: "600",
    fontSize: 14,
    width: "100%",
  },
  errorText: {
    fontWeight: "500",
    fontSize: 15,
    color: "white",
  },
  header: {
    fontSize: adjust(20),
    color: "white",
    fontWeight: "600",
    paddingLeft: 4,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    paddingVertical: 4,
  },
});
