import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";
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
import ReportContext from "../../context/ReportContext";

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

const DanhMucBaoCaoChiSoChiTiet = ({ navigation }) => {
  const dispath = useDispatch();

  const { user, authToken } = useSelector((state) => state.authReducer);
  const { showReport } = useContext(ReportContext);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [dataInput, setDataInput] = useState({
    Day: null,
    Month: null,
    Year: null,
    Electrical_CDT: null,
    Water_CDT: null,
    ImageElectrical_CDT: null,
    ImageWater_CDT: null,
    Electrical_CuDan: null,
    Water_CuDan: null,
    ImageElectrical_CuDan: null,
    ImageWater_CuDan: null,
    Electrical_CuDan_Real: null,
    Water_CuDan_Real: null,
    Electrical_CDT_Real: null,
    Water_CDT_Real: null,
    Ghichu: "",
    ID_Duan: null,
    ID_User: null,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleRemoveImage = (key) => {
    setDataInput((data) => ({
      ...data,
      [key]: null,
    }));
    if (key == "ImageWater_CuDan") {
      setDataInput((data) => ({
        ...data,
        Water_CuDan: null,
      }));
    } else if (key == "ImageElectrical_CuDan") {
      setDataInput((data) => ({
        ...data,
        Electrical_CuDan: null,
      }));
    } else if (key == "ImageWater_CDT") {
      setDataInput((data) => ({
        ...data,
        Water_CDT: null,
      }));
    } else if (key == "ImageElectrical_CDT") {
      setDataInput((data) => ({
        ...data,
        Electrical_CDT: null,
      }));
    }
  };

  const pickImageElectricCDT = async () => {
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
        ImageElectrical_CDT: result.assets[0],
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
          Electrical_CDT: response.data.result[0],
          Electrical_CDT_Real: response.data.result[0],
        }));
        console.log(response.data.result[0]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickImageWaterCDT = async () => {
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
        ImageWater_CDT: result.assets[0],
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
          Water_CDT: response.data.result[0],
          Water_CDT_Real: response.data.result[0],
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickImageElectricCuDan = async () => {
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
        ImageElectrical_CuDan: result.assets[0],
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
          Electrical_CuDan: response.data.result[0],
          ElectricaL_CuDan_Real: response.data.result[0],
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickImageWaterCuDan = async () => {
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
        ImageWater_CuDan: result.assets[0],
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
          Water_CuDan: response.data.result[0],
          Water_CuDan_Real: response.data.result[0],
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    let formData = new FormData();
    try {
      const fileElectricalCDT = {
        uri:
          Platform.OS === "android"
            ? dataInput?.ImageElectrical_CDT?.uri
            : dataInput?.ImageElectrical_CDT?.uri?.replace("file://", ""),
        name:
          dataInput?.ImageElectrical_CDT?.fileName ||
          `${Math.floor(Math.random() * 999999999)}.jpg`,
        type: "image/jpeg",
      };

      const fileWaterCDT = {
        uri:
          Platform.OS === "android"
            ? dataInput?.ImageWater_CDT?.uri
            : dataInput?.ImageWater_CDT?.uri?.replace("file://", ""),
        name:
          dataInput?.ImageWater_CDT?.fileName ||
          `${Math.floor(Math.random() * 999999999)}.jpg`,
        type: "image/jpeg",
      };
      
      const fileElectricalCuDan = {
        uri:
          Platform.OS === "android"
            ? dataInput?.ImageElectrical_CuDan?.uri
            : dataInput?.ImageElectrical_CuDan?.uri?.replace("file://", ""),
        name:
          dataInput?.ImageElectrical_CuDan?.fileName ||
          `${Math.floor(Math.random() * 999999999)}.jpg`,
        type: "image/jpeg",
      };

      const fileWaterCuDan = {
        uri:
          Platform.OS === "android"
            ? dataInput?.ImageWater_CuDan?.uri
            : dataInput?.ImageWater_CuDan?.uri?.replace("file://", ""),
        name:
          dataInput?.ImageWater_CuDan?.fileName ||
          `${Math.floor(Math.random() * 999999999)}.jpg`,
        type: "image/jpeg",
      };

      formData.append("ImageElectrical_CDT", fileElectricalCDT);
      formData.append("ImageWater_CDT", fileWaterCDT);
      formData.append("ImageElectrical_CuDan", fileElectricalCuDan);
      formData.append("ImageWater_CuDan", fileWaterCuDan);
      formData.append("ID_User", user?.ID_User);
      formData.append("ID_Duan", user.ID_Duan);
      formData.append("Month", dataInput.Month);
      formData.append("Year", dataInput.Year);
      formData.append("Ghichu", dataInput.Ghichu);
      formData.append("Electrical_CDT", dataInput.Electrical_CDT);
      formData.append("Electrical_CDT_Real", dataInput.Electrical_CDT_Real);
      formData.append("Water_CDT", dataInput.Water_CDT);
      formData.append("Water_CDT_Real", dataInput.Water_CDT_Real);
      formData.append("Electrical_CuDan", dataInput.Electrical_CuDan);
      formData.append("Electrical_CuDan_Real", dataInput.Electrical_CuDan_Real);
      formData.append("Water_CuDan", dataInput.Water_CuDan);
      formData.append("Water_CuDan_Real", dataInput.Water_CuDan_Real);
      if (
        dataInput.Day == null ||
        dataInput.Month == null ||
        dataInput.Year == null ||
        dataInput.Electrical_CDT == null ||
        dataInput.Water_CDT == null ||
        dataInput.Electrical_CuDan == null ||
        dataInput.Water_CuDan == null
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
      } else if (dataInput.Day > nowDate()) {
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
          BASE_URL + "/ent_baocaochiso/create",
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
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Tháng"
                      placeholderTextColor="gray"
                      textAlignVertical="top"
                      editable={false}
                      defaultValue={`Tháng ${showReport.month}`}
                      value={showReport.month == null ? "" : showReport.month}
                      style={[
                        styles.textInput,
                        {
                          paddingHorizontal: 10,
                        },
                      ]}
                    />
                  </View>

                  <View style={{ width: "49%" }}>
                    <Text allowFontScaling={false} style={styles.text}>
                      Năm
                    </Text>
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Năm"
                      placeholderTextColor="gray"
                      textAlignVertical="top"
                      editable={false}
                      defaultValue={`Năm ${showReport.year}`}
                      value={showReport.year == null ? "" : showReport.year}
                      style={[
                        styles.textInput,
                        {
                          paddingHorizontal: 10,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Hình ảnh chủ đầu tư */}
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
                        Hình ảnh điện CĐT
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
                          onPress={() => pickImageElectricCDT()}
                        >
                          <Entypo name="camera" size={24} color="black" />
                        </TouchableOpacity>
                        {dataInput.ImageElectrical_CDT && (
                          <View style={{ marginLeft: 10 }}>
                            <Image
                              source={{
                                uri: dataInput?.ImageElectrical_CDT?.uri,
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
                                handleRemoveImage("ImageElectrical_CDT")
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
                        Hình ảnh nước CĐT
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
                          onPress={() => pickImageWaterCDT()}
                        >
                          <Entypo name="camera" size={24} color="black" />
                        </TouchableOpacity>
                        {dataInput.ImageWater_CDT && (
                          <View style={{ marginLeft: 10 }}>
                            <Image
                              source={{
                                uri: dataInput?.ImageWater_CDT?.uri,
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
                                handleRemoveImage("ImageWater_CDT")
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
                </View>
              </View>
              {/* Thông số chủ đầu tư  */}
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
                        Chỉ số điện CĐT
                      </Text>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Chỉ số điện"
                        placeholderTextColor="gray"
                        textAlignVertical="top"
                        blurOnSubmit={true}
                        value={
                          dataInput.Electrical_CDT == null
                            ? ""
                            : dataInput.Electrical_CDT
                        }
                        style={[
                          styles.textInput,
                          {
                            paddingHorizontal: 10,
                          },
                        ]}
                        onChangeText={(text) => {
                          handleChangeText("Electrical_CDT", text);
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ width: "49%" }}>
                    <View>
                      <Text allowFontScaling={false} style={styles.text}>
                        Chỉ số nước CĐT
                      </Text>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Chỉ số nước "
                        placeholderTextColor="gray"
                        textAlignVertical="top"
                        blurOnSubmit={true}
                        value={
                          dataInput.Water_CDT == null ? "" : dataInput.Water_CDT
                        }
                        style={[
                          styles.textInput,
                          {
                            paddingHorizontal: 10,
                          },
                        ]}
                        onChangeText={(text) => {
                          handleChangeText("Water_CDT", text);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* ===================================================================  */}

              {showReport.show == true && (
                <>
                  {/* Hình ảnh chủ đầu tư */}
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
                            Hình ảnh điện cư dân
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
                              onPress={() => pickImageElectricCuDan()}
                            >
                              <Entypo name="camera" size={24} color="black" />
                            </TouchableOpacity>
                            {dataInput.ImageElectrical_CuDan && (
                              <View style={{ marginLeft: 10 }}>
                                <Image
                                  source={{
                                    uri: dataInput?.ImageElectrical_CuDan?.uri,
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
                                    handleRemoveImage("ImageElectrical_CuDan")
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
                            Hình ảnh nước cư dân
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
                              onPress={() => pickImageWaterCuDan()}
                            >
                              <Entypo name="camera" size={24} color="black" />
                            </TouchableOpacity>
                            {dataInput.ImageWater_CuDan && (
                              <View style={{ marginLeft: 10 }}>
                                <Image
                                  source={{
                                    uri: dataInput?.ImageWater_CuDan?.uri,
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
                                    handleRemoveImage("ImageWater_CuDan")
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
                    </View>
                  </View>
                  {/* Thông số chủ đầu tư  */}
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
                            Chỉ số điện cư dân
                          </Text>
                          <TextInput
                            allowFontScaling={false}
                            placeholder="Chỉ số điện cư dân"
                            placeholderTextColor="gray"
                            textAlignVertical="top"
                            blurOnSubmit={true}
                            value={
                              dataInput.Electrical_CuDan == null
                                ? ""
                                : dataInput.Electrical_CuDan
                            }
                            style={[
                              styles.textInput,
                              {
                                paddingHorizontal: 10,
                              },
                            ]}
                            onChangeText={(text) => {
                              handleChangeText("Electrical_CuDan", text);
                            }}
                          />
                        </View>
                      </View>
                      <View style={{ width: "49%" }}>
                        <View>
                          <Text allowFontScaling={false} style={styles.text}>
                            Chỉ số nước cư dân
                          </Text>
                          <TextInput
                            allowFontScaling={false}
                            placeholder="Chỉ số nước cư dân"
                            placeholderTextColor="gray"
                            textAlignVertical="top"
                            blurOnSubmit={true}
                            value={
                              dataInput.Water_CuDan == null
                                ? ""
                                : dataInput.Water_CuDan
                            }
                            style={[
                              styles.textInput,
                              {
                                paddingHorizontal: 10,
                              },
                            ]}
                            onChangeText={(text) => {
                              handleChangeText("Water_CuDan", text);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              )}

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
                  value={dataInput.Ghichu}
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
                width="100%"
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default DanhMucBaoCaoChiSoChiTiet;

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
