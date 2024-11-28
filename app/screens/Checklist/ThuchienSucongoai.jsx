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
  TextInput,
  Image,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";
import { Provider, useDispatch, useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import adjust from "../../adjust";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import {
  ent_tang_get,
  ent_khuvuc_get,
  ent_toanha_get,
  ent_khoicv_get,
  ent_hangmuc_get,
} from "../../redux/actions/entActions";
import SelectDropdown from "react-native-select-dropdown";
import { COLORS, SIZES } from "../../constants/theme";
import ItemSucongoai from "../../components/Item/ItemSucongoai";
import VerticalSelect from "../../components/Vertical/VerticalSelect";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import { axiosClient } from "../../api/axiosClient";
import { nowDate } from "../../utils/util";
import ModalCallSucongoai from "../../components/Modal/ModalCallSucongoai";

const ThuchienSucongoai = ({ navigation, route }) => {
  const dispath = useDispatch();
  const { userPhone } = route.params;
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { ent_khuvuc, ent_khoicv, ent_toanha, ent_hangmuc } = useSelector(
    (state) => state.entReducer
  );

  const [dataKhuvuc, setDataKhuvuc] = useState([]);
  const [dataHangmuc, setDataHangmuc] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isModalcall, setIsModalcall] = useState(false);

  const [dataInput, setDataInput] = useState({
    ID_KV_CV: null,
    ID_Hangmuc: null,
    Ngaysuco: null,
    Giosuco: null,
    Noidungsuco: "",
    Duongdancacanh: [],
  });

  const [dataCheckKhuvuc, setDataCheckKhuvuc] = useState({
    ID_Toanha: null,
    ID_Khuvuc: null,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    Ngaysuco: false,
    Giosuco: false,
  });

  const [images, setImages] = useState([]);

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
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

  const showDatePicker = (key) => {
    setDatePickerVisibility((data) => ({
      ...data,
      [key]: true,
    }));
  };

  const handleConfirm = (key, date, format) => {
    handleChangeText(key, moment(date).format(format));
    hideDatePicker(key, false);
  };

  const hideDatePicker = (key, da) => {
    setDatePickerVisibility((data) => ({
      ...data,
      [key]: da,
    }));
  };

  const handleRemoveImage = (item) => {
    setImages(images.filter((image) => image !== item));
  };

  const pickImage = async () => {
    Alert.alert(
      "Chọn ảnh",
      "Bạn muốn chụp ảnh hay chọn ảnh từ thư viện?",
      [
        {
          text: "Chụp ảnh",
          onPress: async () => {
            const permissionResult =
              await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
              alert(
                "Bạn đã từ chối cho phép sử dụng camera. Vào cài đặt và mở lại!"
              );
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              aspect: [4, 3],
              quality: 0.5, // Adjust image quality (0 to 1)
            });

            if (!result.canceled) {
              setImages((prevImages) => [...prevImages, result.assets[0].uri]);
            }
          },
        },
        {
          text: "Chọn từ thư viện",
          onPress: async () => {
            const permissionResult =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
              alert(
                "Bạn đã từ chối cho phép sử dụng thư viện. Vào cài đặt và mở lại!"
              );
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              aspect: [4, 3],
              quality: 0.5, // Adjust image quality (0 to 1)
            });

            if (!result.canceled) {
              setImages((prevImages) => [...prevImages, result.assets[0].uri]);
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
      const filterData = ent_khuvuc.filter(
        (item) => item.ID_Toanha === dataCheckKhuvuc.ID_Toanha
      );
      setDataKhuvuc(filterData);
    }

    if (ent_hangmuc && dataCheckKhuvuc.ID_Khuvuc) {
      const filterData = ent_hangmuc.filter(
        (item) => item.ID_Khuvuc === dataCheckKhuvuc.ID_Khuvuc
      );
      setDataHangmuc(filterData);
    }
  }, [ent_khuvuc, ent_hangmuc, dataCheckKhuvuc]);

  const resetDataInput = () => {
    setDataInput({
      ID_KV_CV: null,
      ID_Hangmuc: null,
      Ngaysuco: null,
      Giosuco: null,
      Noidungsuco: "",
      Duongdancacanh: [],
    });
    setDataCheckKhuvuc({
      ID_Toanha: null,
      ID_Khuvuc: null,
    });
    setImages([]);
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    let formData = new FormData();
    try {
      if (images.length > 0) {
        images.map((item, index) => {
          const file = {
            uri: Platform.OS === "android" ? item : item.replace("file://", ""),
            name:
              Math.floor(Math.random() * Math.floor(99999999999999)) +
              index +
              ".jpg",
            type: "image/jpg",
          };

          // Append image file to formData
          formData.append(`Images`, file);
          // formData.append(`Anh1`, file?.name);
        });
        formData.append("ID_Hangmuc", dataInput.ID_Hangmuc);
        formData.append("Ngaysuco", dataInput.Ngaysuco);
        formData.append("Giosuco", dataInput.Giosuco);
        formData.append("Noidungsuco", dataInput.Noidungsuco);
        formData.append("ID_User", user.ID_User);
        formData.append("Tinhtrangxuly", 0);
        if (dataInput.Ngaysuco == null || dataInput.Giosuco == null) {
          Alert.alert("PMC Thông báo", "Vui lòng nhập đầy đủ thông tin", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
          setLoadingSubmit(false);
          resetDataInput();
        } else if (dataInput.Ngaysuco > nowDate()) {
          Alert.alert("PMC Thông báo", "Ngày không hợp lệ", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else {
          const response = await axios.post(
            BASE_URL + "/tb_sucongoai/create",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + authToken,
              },
            }
          );
          resetDataInput();
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        }
      } else {
        const data = {
          ID_Hangmuc: dataInput.ID_Hangmuc,
          Ngaysuco: dataInput.Ngaysuco,
          Giosuco: dataInput.Giosuco,
          Noidungsuco: dataInput.Noidungsuco,
          ID_User: user.ID_User,
          Tinhtrangxuly: 0,
        };
        if (data.Ngaysuco == null || data.Giosuco == null) {
          Alert.alert("PMC Thông báo", "Vui lòng nhập đầy đủ thông tin", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
          setLoadingSubmit(false);
          resetDataInput();
        } else if (data.Ngaysuco > nowDate()) {
          Alert.alert("PMC Thông báo", "Ngày không hợp lệ", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else {
          const response = axios.post(BASE_URL + "/tb_sucongoai/create", data, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
          });
          setLoadingSubmit(false);
          resetDataInput();
          Alert.alert("PMC Thông báo", "Gửi sự cố thành công!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }
    } catch (error) {
      setLoadingSubmit(false);
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
        console.log(error);
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg_new.png")}
              resizeMode="stretch"
              style={{ flex: 1, width: "100%" }}
            >
              <ScrollView contentContainerStyle={[styles.container]}>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <View>
                    {/* Ngày giờ sự cố  */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "48%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Ngày sự cố
                        </Text>
                        <TouchableOpacity
                          onPress={() => showDatePicker("Ngaysuco")}
                        >
                          <View style={styles.action}>
                            <TextInput
                              allowFontScaling={false}
                              value={dataInput.Ngaysuco}
                              placeholder="Nhập ngày sự cố"
                              placeholderTextColor="gray"
                              style={{
                                paddingLeft: 12,
                                color: "#05375a",
                                width: "75%",
                                fontSize: adjust(16),
                                height: adjust(50),
                              }}
                              pointerEvents="none"
                            />
                            <TouchableOpacity
                              onPress={() => showDatePicker("Ngaysuco")}
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: adjust(50),
                                width: adjust(50),
                              }}
                            >
                              <AntDesign
                                name="calendar"
                                size={24}
                                color="black"
                              />
                            </TouchableOpacity>
                          </View>
                          <DateTimePickerModal
                            isVisible={isDatePickerVisible.Ngaysuco}
                            mode="date"
                            isDarkModeEnabled={true}
                            onConfirm={(date) =>
                              handleConfirm("Ngaysuco", date, "YYYY-MM-DD")
                            }
                            onCancel={() => hideDatePicker("Ngaysuco", false)}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: "48%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Giờ sự cố
                        </Text>
                        <TouchableOpacity
                          onPress={() => showDatePicker("Giosuco")}
                        >
                          <View style={styles.action}>
                            <TextInput
                              allowFontScaling={false}
                              value={dataInput.Giosuco}
                              placeholder="Nhập giờ sự cố"
                              placeholderTextColor="gray"
                              style={{
                                paddingLeft: 12,
                                color: "#05375a",
                                width: "75%",
                                fontSize: adjust(16),
                                height: adjust(50),
                              }}
                              pointerEvents="none"
                            />
                            <TouchableOpacity
                              onPress={() => showDatePicker("Giosuco")}
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: adjust(50),
                                width: adjust(50),
                              }}
                            >
                              <AntDesign
                                name="calendar"
                                size={24}
                                color="black"
                              />
                            </TouchableOpacity>
                          </View>
                          <DateTimePickerModal
                            isVisible={isDatePickerVisible.Giosuco}
                            mode="time"
                            isDarkModeEnabled={true}
                            onConfirm={(date) =>
                              handleConfirm("Giosuco", date, "LT")
                            }
                            onCancel={() => hideDatePicker("Giosuco", false)}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* Chọn khu vực hạng mục xảy ra sự cố  */}
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
                                handleChangeTextKhuVuc(
                                  "ID_Toanha",
                                  selectedItem.ID_Toanha
                                );
                              }}
                              renderDropdownIcon={(isOpened) => {
                                return (
                                  <FontAwesome
                                    name={
                                      isOpened ? "chevron-up" : "chevron-down"
                                    }
                                    color={"#637381"}
                                    size={14}
                                  />
                                );
                              }}
                              dropdownIconPosition={"right"}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index
                              ) => {
                                return (
                                  <Text
                                    allowFontScaling={false}
                                    style={[styles.text, { color: "black" }]}
                                  >
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
                            <Text
                              allowFontScaling={false}
                              style={styles.errorText}
                            >
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
                              }}
                              // rowStyle={{ height: 50, justifyContent: "center" }}
                              defaultButtonText={"Khu vực"}
                              buttonTextStyle={styles.customText}
                              // defaultValue={defaultKhuvuc}
                              onSelect={(selectedItem, index) => {
                                handleChangeTextKhuVuc(
                                  "ID_Khuvuc",
                                  selectedItem.ID_Khuvuc
                                );
                              }}
                              renderDropdownIcon={(isOpened) => {
                                return (
                                  <FontAwesome
                                    name={
                                      isOpened ? "chevron-up" : "chevron-down"
                                    }
                                    color={"#637381"}
                                    size={14}
                                  />
                                );
                              }}
                              dropdownIconPosition={"right"}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index
                              ) => {
                                return (
                                  <Text
                                    allowFontScaling={false}
                                    style={[styles.text, { color: "black" }]}
                                  >
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
                            <Text
                              allowFontScaling={false}
                              style={styles.errorText}
                            >
                              Không có dữ liệu khu vực
                            </Text>
                          )}
                        </View>
                      </View>

                      <View style={{ width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                          Hạng mục
                        </Text>
                        {dataHangmuc && dataHangmuc?.length > 0 && (
                          <SelectDropdown
                            data={dataHangmuc}
                            buttonStyle={styles.select}
                            dropdownStyle={{
                              borderRadius: 8,
                              maxHeight: 400,
                            }}
                            defaultButtonText={"Hạng mục"}
                            buttonTextStyle={styles.customText}
                            // defaultValue={defaultHangmuc}
                            onSelect={(selectedItem, index) => {
                              handleChangeText(
                                "ID_Hangmuc",
                                selectedItem.ID_Hangmuc
                              );
                            }}
                            renderDropdownIcon={(isOpened) => {
                              return (
                                <FontAwesome
                                  name={
                                    isOpened ? "chevron-up" : "chevron-down"
                                  }
                                  color={"#637381"}
                                  size={14}
                                  style={{ marginRight: 10 }}
                                />
                              );
                            }}
                            dropdownIconPosition={"right"}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              return (
                                <View
                                  style={{
                                    justifyContent: "center",
                                    alignContent: "center",
                                    height: 50,
                                  }}
                                >
                                  <Text
                                    allowFontScaling={false}
                                    style={[styles.text, { color: "black" }]}
                                  >
                                    {selectedItem?.Hangmuc}
                                  </Text>
                                </View>
                              );
                            }}
                            renderCustomizedRowChild={(item, index) => {
                              return (
                                <VerticalSelect
                                  value={item.ID_Hangmuc}
                                  label={item.Hangmuc}
                                  key={index}
                                  selectedItem={dataInput.ID_Hangmuc}
                                />
                              );
                            }}
                          />
                        )}
                      </View>
                    </View>
                    {/* Nội dung sự cố  */}
                    <View>
                      <Text allowFontScaling={false} style={styles.text}>
                        Nội dung sự cố
                      </Text>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Nội dung"
                        placeholderTextColor="gray"
                        textAlignVertical="top"
                        multiline={true}
                        blurOnSubmit={true}
                        value={dataInput.Noidungsuco}
                        style={[
                          styles.textInput,
                          {
                            paddingHorizontal: 10,
                            height: 100,
                          },
                        ]}
                        onChangeText={(text) => {
                          handleChangeText("Noidungsuco", text);
                        }}
                      />
                    </View>

                    {/* Hình ảnh sự cố  */}
                    <View>
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
                            height: 80,
                            width: 80,
                          }}
                          onPress={() => pickImage()}
                        >
                          <Entypo name="camera" size={24} color="black" />
                        </TouchableOpacity>

                        <FlatList
                          horizontal={true}
                          contentContainerStyle={{ flexGrow: 1 }}
                          data={images}
                          renderItem={({ item, index }) => (
                            <View style={{ marginLeft: 10 }}>
                              <Image
                                source={{ uri: item }}
                                style={{
                                  width: 100,
                                  height: 140,
                                  position: "relative",
                                  opacity: 0.8,
                                }}
                              />
                              <TouchableOpacity
                                style={{
                                  position: "absolute",
                                  top: 45,
                                  left: 25,
                                  width: 50,
                                  height: 50,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                onPress={() => handleRemoveImage(item)}
                              >
                                <Image
                                  source={require("../../../assets/icons/ic_close.png")}
                                  style={styles.closeIcon}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          scrollEventThrottle={16}
                          scrollEnabled={true}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{ marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => setIsModalcall(true)}>
                      <View
                        style={{ alignItems: "flex-end", marginBottom: 10 }}
                      >
                        <Image
                          source={require("../../../assets/icons/ic_phone.png")}
                          style={{
                            width: adjust(80) * 0.8,
                            height: adjust(80) * 0.8,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                    <ButtonSubmit
                      text="Gửi"
                      onPress={() => handleSubmit()}
                      isLoading={loadingSubmit}
                      backgroundColor={COLORS.bg_button}
                      color="white"
                      width="100%"
                    />
                  </View>
                </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalcall}
                  onRequestClose={() => {
                    setIsModalcall(false);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View
                      style={[
                        styles.modalView,
                        { width: "80%", height: "70%" },
                      ]}
                    >
                      <ModalCallSucongoai
                        userPhone={userPhone}
                        setIsModalcall={setIsModalcall}
                      />
                    </View>
                  </View>
                </Modal>
              </ScrollView>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ThuchienSucongoai;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    margin: 10,
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: "white",
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
    height: 50,
    paddingVertical: 4,
    backgroundColor: "white",
  },

  dropdown: {
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 50,
  },
  customText: {
    fontWeight: "600",
    fontSize: 14,
    width: "100%",
    textAlign: "left",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: adjust(15),
    color: "white",
    fontWeight: "500",
  },
  checkbox: {
    margin: 8,
    width: 24,
    height: 24,
  },
  image: {
    height: 100,
    resizeMode: "center",
    marginVertical: 10,
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
  closeIcon: {
    tintColor: "white",
  },
});
