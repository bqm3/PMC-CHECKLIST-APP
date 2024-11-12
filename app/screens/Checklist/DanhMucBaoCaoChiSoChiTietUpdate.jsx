import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";
import { Provider, useDispatch, useSelector } from "react-redux";
import adjust from "../../adjust";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import SelectDropdown from "react-native-select-dropdown";
import { COLORS, SIZES } from "../../constants/theme";
import VerticalSelect from "../../components/Vertical/VerticalSelect";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import { nowDate } from "../../utils/util";

const listMonth = [
  { value: "1", label: "Tháng 1" },
  { value: "2", label: "Tháng 2" },
  { value: "3", label: "Tháng 3" },
  { value: "4", label: "Tháng 4" },
  { value: "5", label: "Tháng 5" },
  { value: "6", label: "Tháng 6" },
  { value: "7", label: "Tháng 7" },
  { value: "8", label: "Tháng 8" },
  { value: "9", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
];

const listYear = [
  { value: "2024", label: "Năm 2024" },
  { value: "2025", label: "Năm 2025" },
];

const DanhMucBaoCaoChiSoChiTietUpdate = ({ navigation, route }) => {
  const dispath = useDispatch();
  const { dataChiSo } = route.params;

  const { user, authToken } = useSelector((state) => state.authReducer);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [dataInput, setDataInput] = useState({
    Day: dataChiSo?.Day || null,
    Month: dataChiSo?.Month || null,
    Year: dataChiSo?.Year || null,
    Electrical: dataChiSo?.Electrical || null,
    Water: dataChiSo?.Water || null,
    ImageElectrical: dataChiSo?.ImageElectrical || null,
    ImageWater: dataChiSo?.ImageWater || null,
    Ghichu: dataChiSo?.Ghichu || "",
    ID_Duan: dataChiSo?.ID_Duan || null,
    ID_User: dataChiSo?.ID_User || null,
  });

  const defaultMonth = listMonth?.find(
    (item) => item.value == dataChiSo?.Month
  );
  const defaultYear = listYear?.find((item) => item.value == dataChiSo?.Year);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeTextTime = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (key, date, format) => {
    handleChangeText(key, moment(date).format(format));
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleRemoveImage = (key) => {
    setDataInput((data) => ({
      ...data,
      [key]: null,
    }));
    if (key == "ImageWater") {
      setDataInput((data) => ({
        ...data,
        Water: null,
      }));
    } else {
      setDataInput((data) => ({
        ...data,
        Electrical: null,
      }));
    }
  };

  const pickImageElectric = async () => {
    // Request permission to access the camera or gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera or gallery is required!");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0];
      setDataInput((data) => ({
        ...data,
        ImageElectrical: result.assets[0],
      }));
      const formData = new FormData();
      if (imageUri.uri) {
        const file = {
          uri:
            Platform.OS === "android"
              ? imageUri.uri
              : imageUri.uri.replace("file://", ""),
          name:
            imageUri.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
          type: "image/jpeg",
        };

        formData.append("file", file);
      } else {
        alert("Invalid image data");
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle success response
        // setUploadResult(response.data);
        setDataInput((data) => ({
          ...data,
          Electrical: response.data.result[0],
        }));
        console.log(response.data.result[0]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickImageWater = async () => {
    // Request permission to access the camera or gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera or gallery is required!");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0];
      setDataInput((data) => ({
        ...data,
        ImageWater: result.assets[0],
      }));
      const formData = new FormData();
      if (imageUri.uri) {
        const file = {
          uri:
            Platform.OS === "android"
              ? imageUri.uri
              : imageUri.uri.replace("file://", ""),
          name:
            imageUri.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
          type: "image/jpeg",
        };

        formData.append("file", file);
      } else {
        alert("Invalid image data");
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setDataInput((data) => ({
          ...data,
          Water: response.data.result[0],
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetDataInput = () => {
    setDataInput({
      Day: null,
      Month: null,
      Year: null,
      Electrical: null,
      Water: null,
      ImageElectrical: null,
      ImageWater: null,
      Ghichu: "",
      ID_Duan: null,
      ID_User: null,
    });
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    let formData = new FormData();
    try {
      if (
        (dataInput?.ImageElectrical &&
          dataInput?.ImageElectrical !== dataChiSo.ImageElectrical) ||
        (dataInput?.ImageWater &&
          dataInput?.ImageWater !== dataChiSo.ImageWater)
      ) {
        let fileElectrical = null;
        let fileWater = null;
        if (
          dataInput?.ImageElectrical &&
          dataInput?.ImageElectrical !== dataChiSo.ImageElectrical
        ) {
          fileElectrical = {
            uri:
              Platform.OS === "android"
                ? dataInput?.ImageElectrical?.uri
                : dataInput?.ImageElectrical?.uri?.replace("file://", ""),
            name:
              dataInput?.ImageElectrical?.fileName ||
              `${Math.floor(Math.random() * 999999999)}.jpg`,
            type: "image/jpeg",
          };
          formData.append("ImageElectrical", fileElectrical);
        }

        if (
          dataInput?.ImageWater &&
          dataInput?.ImageWater !== dataChiSo.ImageWater
        ) {
          fileWater = {
            uri:
              Platform.OS === "android"
                ? dataInput?.ImageWater?.uri
                : dataInput?.ImageWater?.uri?.replace("file://", ""),
            name:
              dataInput?.ImageWater?.fileName ||
              `${Math.floor(Math.random() * 999999999)}.jpg`,
            type: "image/jpeg",
          };
          formData.append("ImageWater", fileWater);
        }
        console.log("dataInput", dataInput);
        console.log("fileElectrical", fileElectrical);
        console.log("fileWater", fileWater);

        formData.append(
          "ImageElectrical",
          fileElectrical || dataInput.ImageElectrical
        );
        formData.append("ImageWater", fileWater || dataInput.ImageWater);
        formData.append("ID_User", user?.ID_User);
        formData.append("ID_Duan", user.ID_Duan);
        formData.append("Day", dataInput?.Day);
        formData.append("Month", dataInput?.Month);
        formData.append("Year", dataInput?.Year);
        formData.append("Ghichu", dataInput?.Ghichu);
        formData.append("Electrical", dataInput?.Electrical);
        formData.append("Water", dataInput?.Water);
        if (
          dataInput?.Day == null ||
          dataInput?.Month == null ||
          dataInput?.Year == null ||
          dataInput?.Electrical == null ||
          dataInput?.Water == null
        ) {
          Alert.alert("PMC Thông báo", "Vui lòng nhập đầy đủ thông tin", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
          setLoadingSubmit(false);
        } else if (dataInput?.Day > nowDate()) {
          Alert.alert("PMC Thông báo", "Ngày không hợp lệ", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else {
          const response = await axios.put(
            BASE_URL + `/ent_baocaochiso/${dataChiSo.ID_Baocaochiso}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + authToken,
              },
            }
          );
          // resetDataInput();
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
        const response = await axios.put(
          BASE_URL + "/ent_baocaochiso/" + dataChiSo.ID_Baocaochiso,
          dataInput,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authToken,
            },
          }
        );
        // resetDataInput();
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
    } catch (error) {
      console.log(error);
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
    <ImageBackground
      source={require("../../../assets/bg_new.png")}
      resizeMode="stretch"
      style={{ flex: 1, width: "100%", height: "100%" }}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, height: "100%" }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
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
                <View style={{ width: "100%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Ngày báo cáo
                  </Text>
                  <TouchableOpacity onPress={() => showDatePicker("Day")}>
                    <View style={styles.action}>
                      <TextInput
                        allowFontScaling={false}
                        value={dataInput?.Day}
                        placeholder="Nhập ngày báo cáo"
                        placeholderTextColor="gray"
                        style={{
                          paddingLeft: 12,
                          color: "#05375a",
                          width: "85%",
                          fontSize: adjust(16),
                          height: adjust(50),
                        }}
                        pointerEvents="none"
                      />
                      <TouchableOpacity
                        onPress={() => showDatePicker("Day")}
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
                      isVisible={isDatePickerVisible}
                      mode="date"
                      isDarkModeEnabled={true}
                      onConfirm={(date) =>
                        handleConfirm("Day", date, "YYYY-MM-DD")
                      }
                      onCancel={() => hideDatePicker("Day", false)}
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
                      Tháng
                    </Text>
                    {listMonth && listMonth?.length > 0 ? (
                      <SelectDropdown
                        data={listMonth}
                        buttonStyle={styles.select}
                        dropdownStyle={{
                          borderRadius: 8,
                          maxHeight: 400,
                        }}
                        defaultButtonText={"Tháng"}
                        buttonTextStyle={styles.customText}
                        defaultValue={defaultMonth}
                        onSelect={(selectedItem, index) => {
                          handleChangeTextTime("Month", selectedItem.value);
                        }}
                        renderDropdownIcon={(isOpened) => {
                          return (
                            <FontAwesome
                              name={isOpened ? "chevron-up" : "chevron-down"}
                              color={"#637381"}
                              size={14}
                            />
                          );
                        }}
                        dropdownIconPosition={"right"}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return (
                            <Text
                              allowFontScaling={false}
                              style={[styles.text, { color: "black" }]}
                            >
                              {selectedItem?.label}
                            </Text>
                          );
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          return (
                            <VerticalSelect
                              value={item.value}
                              label={item.label}
                              key={index}
                              selectedItem={`${dataInput?.Month}`}
                            />
                          );
                        }}
                      />
                    ) : (
                      <Text allowFontScaling={false} style={styles.errorText}>
                        Không có tháng.
                      </Text>
                    )}
                  </View>

                  <View style={{ width: "49%" }}>
                    <Text allowFontScaling={false} style={styles.text}>
                      Năm
                    </Text>
                    {listYear && listYear?.length > 0 ? (
                      <SelectDropdown
                        data={listYear}
                        buttonStyle={styles.select}
                        dropdownStyle={{
                          borderRadius: 8,
                          maxHeight: 400,
                        }}
                        defaultButtonText={"Năm"}
                        buttonTextStyle={styles.customText}
                        defaultValue={defaultYear}
                        onSelect={(selectedItem, index) => {
                          handleChangeTextTime("Year", selectedItem.value);
                        }}
                        renderDropdownIcon={(isOpened) => {
                          return (
                            <FontAwesome
                              name={isOpened ? "chevron-up" : "chevron-down"}
                              color={"#637381"}
                              size={14}
                            />
                          );
                        }}
                        dropdownIconPosition={"right"}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return (
                            <Text
                              allowFontScaling={false}
                              style={[styles.text, { color: "black" }]}
                            >
                              {selectedItem?.label}
                            </Text>
                          );
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          return (
                            <VerticalSelect
                              value={item.value}
                              label={item.label}
                              key={index}
                              selectedItem={`${dataInput?.Year}`}
                            />
                          );
                        }}
                      />
                    ) : (
                      <Text allowFontScaling={false} style={styles.errorText}>
                        Không có năm.
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Hình ảnh sự cố  */}
                  <View style={{ width: "49%" }}>
                    <View>
                      <Text allowFontScaling={false} style={styles.text}>
                        Hình ảnh điện
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
                          onPress={() => pickImageElectric()}
                        >
                          <Entypo name="camera" size={24} color="black" />
                        </TouchableOpacity>
                        {dataInput?.ImageElectrical && (
                          <View style={{ marginLeft: 10 }}>
                            <Image
                              source={{
                                uri:
                                  dataInput?.ImageElectrical?.uri ||
                                  `https://drive.google.com/thumbnail?id=${dataInput?.ImageElectrical}`,
                              }}
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
                                top: 40,
                                left: 30,
                                width: 50,
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onPress={() =>
                                handleRemoveImage("ImageElectrical")
                              }
                            >
                              <FontAwesome
                                name="remove"
                                size={adjust(30)}
                                color="white"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={{ width: "49%" }}>
                    <View>
                      <Text allowFontScaling={false} style={styles.text}>
                        Hình ảnh nước
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
                          onPress={() => pickImageWater()}
                        >
                          <Entypo name="camera" size={24} color="black" />
                        </TouchableOpacity>
                        {dataInput?.ImageWater && (
                          <View style={{ marginLeft: 10 }}>
                            <Image
                              source={{
                                uri:
                                  dataInput?.ImageWater?.uri ||
                                  `https://drive.google.com/thumbnail?id=${dataInput?.ImageWater}`,
                              }}
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
                                top: 40,
                                left: 30,
                                width: 50,
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onPress={() => handleRemoveImage("ImageWater")}
                            >
                              <FontAwesome
                                name="remove"
                                size={adjust(30)}
                                color="white"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "49%" }}>
                    <View>
                      <Text allowFontScaling={false} style={styles.text}>
                        Chỉ số điện
                      </Text>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Chỉ số điện"
                        placeholderTextColor="gray"
                        textAlignVertical="top"
                        blurOnSubmit={true}
                        defaultValue={`${dataInput?.Electrical}`}
                        value={`${dataInput?.Electrical}`}
                        style={[
                          styles.textInput,
                          {
                            paddingHorizontal: 10,
                          },
                        ]}
                        onChangeText={(text) => {
                          handleChangeText("Electrical", text);
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ width: "49%" }}>
                    <View>
                      <Text allowFontScaling={false} style={styles.text}>
                        Chỉ số nước
                      </Text>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Chỉ số nước"
                        placeholderTextColor="gray"
                        textAlignVertical="top"
                        blurOnSubmit={true}
                        defaultValue={`${dataInput?.Water}`}
                        value={`${dataInput?.Water}`}
                        style={[
                          styles.textInput,
                          {
                            paddingHorizontal: 10,
                          },
                        ]}
                        onChangeText={(text) => {
                          handleChangeText("Water", text);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Ghi chú
                </Text>
                <TextInput
                  allowFontScaling={false}
                  placeholder="Ghi chú"
                  placeholderTextColor="gray"
                  textAlignVertical="top"
                  multiline={true}
                  blurOnSubmit={true}
                  value={dataInput?.Ghichu}
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                      height: 80,
                    },
                  ]}
                  onChangeText={(text) => {
                    handleChangeText("Ghichu", text);
                  }}
                />
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <ButtonSubmit
                text="Gửi"
                onPress={() => handleSubmit()}
                isLoading={loadingSubmit}
                backgroundColor={COLORS.bg_button}
                color="white"
                width="100"
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default DanhMucBaoCaoChiSoChiTietUpdate;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    margin: 10,
    flex: 1,
    height: SIZES.height - 120,
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
});
