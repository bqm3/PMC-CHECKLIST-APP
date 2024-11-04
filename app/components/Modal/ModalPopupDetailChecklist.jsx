import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import Button from "../Button/Button";
import { COLORS, SIZES } from "../../constants/theme";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";

const ModalPopupDetailChecklist = ({
  handlePopupClear,
  dataItem,
  index,
  handleItemClick,
  handleClearBottom,
  user,
}) => {
  const ref = useRef(null);
  const [step, setStep] = useState(1);
  const [defaultChecklist, setDefaultChecklist] = useState(
    dataItem?.valueCheck
  );
  const [image, setImage] = useState();
  const [ghichu, setGhichu] = useState();
  const [chiso, setChiso] = useState();

  const pickImage = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    try {
      // Cấu hình các tùy chọn cho ImagePicker
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5, // Giảm chất lượng ảnh (giá trị từ 0.0 đến 1.0, 0.5 là giảm 50% chất lượng)
        base64: false, // Không cần mã hóa ảnh thành base64, nếu không cần thiết
        exif: false, // Bỏ thông tin Exif nếu không cần
      });

      if (!result.canceled) {
        dataItem.Anh = result?.assets[0];
        handleItemClick(result?.assets[0], "option", "Anh", dataItem);
        setImage(result?.assets[0]);
      }
    } catch (error) {
      console.error("Lỗi khi chụp ảnh: ", error);
    }
  };

  const objData = {
    Anh: image,
    GhichuChitiet: ghichu,
    valueCheck: null,
  };

  const setData = () => {
    dataItem.valueCheck = defaultChecklist || chiso;
    dataItem.Anh = image ? image : null;
    dataItem.GhichuChitiet = ghichu ? ghichu : "";
    objData.Anh = image ? image : null;
    objData.GhichuChitiet = ghichu ? ghichu : "";
    objData.valueCheck = defaultChecklist || chiso;
  };

  useEffect(() => {
    setImage(dataItem?.Anh);
    setGhichu(dataItem?.GhichuChitiet);
    setChiso(dataItem?.valueCheck);
  }, [dataItem]);

  const close = () => {
    user.isError !== 1 ? handlePopupClear() : handleClearBottom();
  };

  return (
    <GestureHandlerRootView style={{ height: "auto" }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{ width: SIZES.width, paddingHorizontal: 20, height: "auto" }}
        >
          {step === 1 &&
            (`${dataItem?.isCheck}` === "0" ? (
              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Trạng thái
                </Text>
                <SelectDropdown
                  ref={ref}
                  data={dataItem?.Giatrinhan ? dataItem?.Giatrinhan : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Trạng thái"}
                  buttonTextStyle={styles.customText}
                  defaultValue={defaultChecklist}
                  onSelect={(selectedItem, i) => {
                    dataItem.valueCheck = selectedItem;
                    handleItemClick(
                      selectedItem,
                      "option",
                      "valueCheck",
                      dataItem
                    );
                    setDefaultChecklist(selectedItem);
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <FontAwesome
                        name={isOpened ? "chevron-up" : "chevron-down"}
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
                        <Text allowFontScaling={false} style={[styles.text]}>
                          {selectedItem}
                        </Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item}
                        label={item}
                        key={item}
                        selectedItem={defaultChecklist}
                      />
                    );
                  }}
                />
              </View>
            ) : (
              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Chỉ số
                </Text>
                <TextInput
                  allowFontScaling={false}
                  value={chiso}
                  placeholder="Thêm chỉ số"
                  placeholderTextColor="gray"
                  blurOnSubmit={true}
                  onChangeText={(text) => {
                    setChiso(text);
                  }}
                  style={styles.textInput}
                />
              </View>
            ))}
          {step === 2 && (
            <>
              <View>
                <View>
                  <Text allowFontScaling={false} style={styles.text}>
                    Ghi chú
                  </Text>
                  <TextInput
                    allowFontScaling={false}
                    value={ghichu}
                    placeholder="Thêm ghi chú"
                    placeholderTextColor="gray"
                    multiline={true}
                    blurOnSubmit={true}
                    onChangeText={(text) => {
                      setGhichu(text);
                    }}
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                        height: 80,
                      },
                    ]}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View>
                    <Text allowFontScaling={false} style={styles.text}>
                      Chụp ảnh
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        padding: SIZES.padding,
                        borderRadius: SIZES.borderRadius,
                        borderColor: COLORS.bg_button,
                        borderWidth: 1,
                        width: 80,
                        alignItems: "center",
                        justifyContent: "center",
                        height: 80,
                      }}
                      onPress={pickImage}
                    >
                      <Entypo name="camera" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    {image && (
                      <Image
                        source={{ uri: image?.uri }}
                        style={styles.image}
                      />
                    )}
                    {image && (
                      <TouchableOpacity
                        onPress={() => {
                          setImage(null);
                          handleItemClick(null, "option", "Anh", dataItem);
                        }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <AntDesign
                          name="delete"
                          size={adjust(22)}
                          color="black"
                        />
                        <Text
                          allowFontScaling={false}
                          style={{ fontSize: adjust(16), fontWeight: "600" }}
                        >
                          Xóa
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <Button
                  onPress={() => {
                    setData();
                    handleItemClick(objData, "close", objData, dataItem);
                    close();
                  }}
                  backgroundColor={COLORS.bg_button}
                  border={COLORS.bg_button}
                  color={"white"}
                  text={"Hoàn thành"}
                  width={"100%"}
                />
              </View>
            </>
          )}

          {step === 1 && (
            <>
              <View style={{ marginTop: 10 }}>
                <Button
                  onPress={() => {
                    setStep(2);
                  }}
                  backgroundColor={COLORS.bg_white}
                  border={COLORS.bg_button}
                  color={"black"}
                  text={"Chụp ảnh, Ghi chú"}
                  width={"100%"}
                />
              </View>
            </>
          )}
          {step === 1 && (
            <View style={{ marginTop: 10 }}>
              <Button
                onPress={() => {
                  setData();
                  handleItemClick(objData, "close", objData, dataItem);
                  close();
                }}
                backgroundColor={COLORS.bg_button}
                border={COLORS.bg_button}
                color={"white"}
                text={"Hoàn thành"}
                width={"100%"}
              />
            </View>
          )}
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                step === 1
                  ? close()
                  : (setStep(1),
                    setData(),
                    handleItemClick(objData, "close", objData, dataItem));
                // handleItemClick(image, "option", "Anh", dataItem);
                // handleItemClick(ghichu, "option", "GhichuChitiet", dataItem);
              }}
              backgroundColor={step === 1 ? COLORS.bg_button : COLORS.bg_white}
              border={COLORS.bg_button}
              color={step === 1 ? "white" : "black"}
              text={step === 1 ? "Đóng" : "Quay lại"}
              width={"100%"}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default ModalPopupDetailChecklist;

const styles = StyleSheet.create({
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    backgroundColor: "white",
    zIndex: 1,
  },
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
    paddingLeft: 10,
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
    textAlign: "left",
    paddingLeft: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginVertical: 10,
  },
});
