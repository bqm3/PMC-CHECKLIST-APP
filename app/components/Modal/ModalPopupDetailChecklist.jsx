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
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
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
  const [images, setImages] = useState([]);
  const [ghichu, setGhichu] = useState();
  const [chiso, setChiso] = useState();
  let newImageItem = []

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
  
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5, // Compress during capture
      });
  
      if (!result.canceled) {
        const originalImage = result.assets[0];
  
        // Resize and compress the image
        const resizedImage = await ImageManipulator.manipulateAsync(
          originalImage.uri,
          [{ resize: { width: originalImage.width / 5 } }], // Resize to 70% width
          { compress: 1, format: "png"  } // Compress further
        );
  
        // Update the state with the resized image
        setImages((prevImages) => [...prevImages, resizedImage]);
  
        const newImageItem = [...images, resizedImage];
        handleItemClick(newImageItem, "option", "Anh", dataItem);
      }
    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  };
  

  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    const filterImages = images.filter((_, index) => index !== indexToRemove);
    // Cập nhật dataItem sau khi xóa ảnh
    handleItemClick(filterImages, "option", "Anh", dataItem);
  };

  const objData = {
    Anh: images,
    GhichuChitiet: ghichu,
    valueCheck: defaultChecklist || chiso,
  };


  const setData = () => {
    dataItem.valueCheck = defaultChecklist || chiso;
    dataItem.Anh = images;
    dataItem.GhichuChitiet = ghichu || "";
    objData.Anh = images;
    objData.GhichuChitiet = ghichu || "";
    objData.valueCheck = defaultChecklist || chiso;
  };

  useEffect(() => {
    setImages(dataItem?.Anh || []);
    setGhichu(dataItem?.GhichuChitiet);
    setChiso(dataItem?.valueCheck);
  }, [dataItem]);

  const close = () => {
    handleClearBottom();
  };

  return (
    <GestureHandlerRootView style={{ height: "auto" }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            width: SIZES.width * 0.8,
            height: "auto",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {step == 1 &&
            (`${dataItem?.isCheck}` === "0" ? (
              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Trạng thái
                </Text>
                <SelectDropdown
                  ref={ref}
                  data={
                    dataItem?.Giatrinhan
                      ? dataItem?.Giatrinhan.map((it) => it.trim())
                      : []
                  }
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
                    dataItem.valueCheck = selectedItem.trim();
                    handleItemClick(
                      selectedItem.trim(),
                      "option",
                      "valueCheck",
                      dataItem
                    );
                    setDefaultChecklist(selectedItem.trim());
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

          {step == 1 && (
            <>
              <View style={{ marginTop: 10 }}>
                <Button
                  onPress={() => setStep(2)}
                  backgroundColor={COLORS.bg_white}
                  border={COLORS.bg_button}
                  color={"black"}
                  text={"Chụp ảnh, Ghi chú"}
                  width={"100%"}
                />
              </View>
            </>
          )}
          {step == 1 && (
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
          {step == 2 && (
            <>
              <View
                style={{
                  width: SIZES.width * 0.8,
                  height: "auto",
                  justifyContent: "center",
                  alignContent: "center",
                  // padding
                }}
              >
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
                        height: 70,
                        textAlignVertical: 'top',
                      },
                    ]}
                  />
                </View>
                <View>
                  <Text allowFontScaling={false} style={styles.text}>
                    Chụp ảnh
                  </Text>
                  <View style={{ flexDirection: "row", marginBottom: 5 }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        padding: SIZES.padding,
                        borderRadius: SIZES.borderRadius,
                        borderColor: COLORS.bg_button,
                        borderWidth: 1,
                        width: 60,
                        alignItems: "center",
                        justifyContent: "center",
                        height: 60,
                        marginEnd: 10  
                      }}
                      onPress={() => pickImage()}
                    >
                      <Entypo name="camera" size={15} color="black" />
                    </TouchableOpacity>
                    <ScrollView horizontal>
                      {images.map((img, index) => (
                        <View key={index} style={{ marginEnd: 10 }}>
                          <Image
                            source={{ uri: img.uri }}
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
                            onPress={() => removeImage(index)}
                          >
                            <FontAwesome
                              name="remove"
                              size={adjust(30)}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
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
              </View>
            </>
          )}

          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                step == 1
                  ? close()
                  : (setStep(1),
                    setData(),
                    handleItemClick(objData, "close", objData, dataItem));
              }}
              backgroundColor={step == 1 ? COLORS.bg_button : COLORS.bg_white}
              border={COLORS.bg_button}
              color={step == 1 ? "white" : "black"}
              text={step == 1 ? "Đóng" : "Quay lại"}
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
    width: "100%",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginVertical: 10,
  },
});
