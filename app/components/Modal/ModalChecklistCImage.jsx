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
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../Button/Button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";

const ModalChecklistCImage = ({
  handlePushDataSave,
  isLoading,
  handleChangeImages,
  dataImages,
  handlePushDataImagesSave,
  newActionCheckList,
}) => {
  const date = new Date();
  const dateHour = moment(date).format("LTS");
  const [image1, setImage1] = useState(newActionCheckList[0]?.Anh1);
  const [image2, setImage2] = useState(newActionCheckList[0]?.Anh2);
  const [image3, setImage3] = useState(newActionCheckList[0]?.Anh3);
  const [image4, setImage4] = useState(newActionCheckList[0]?.Anh4);
  const pickImage = async (text, hour, onPress) => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      handleChangeImages(text, result?.assets[0]);
      handleChangeImages(hour, dateHour);
      onPress(result?.assets[0]);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ margin: 20 }}>
          <View style={{ justifyContent: "space-around", width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Ảnh 1</Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,

                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() => pickImage("Anh1", "Giochupanh1", setImage1)}
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                  {image1 && (
                    <Image
                      source={{ uri: image1.uri ? image1.uri : image1 }}
                      style={styles.image}
                    />
                  )}
                </View>
              </View>

              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Ảnh 2</Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() => pickImage("Anh2", "Giochupanh2", setImage2)}
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                  {image2 && (
                    <Image
                      source={{ uri: image2?.uri ? image2.uri : image2 }}
                      style={styles.image}
                    />
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Ảnh 3</Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,

                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() => pickImage("Anh3", "Giochupanh3", setImage3)}
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                  {image3 && (
                    <Image
                      source={{ uri: image3?.uri ? image3.uri : image3 }}
                      style={styles.image}
                    />
                  )}
                </View>
              </View>

              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Ảnh 4</Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() => pickImage("Anh4", "Giochupanh4", setImage4)}
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                  {image4 && (
                    <Image
                      source={{ uri: image4?.uri ? image4.uri : image4 }}
                      style={styles.image}
                    />
                  )}
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <Button
                text={"Lưu"}
                width={"auto"}
                backgroundColor={COLORS.bg_button}
                color={"white"}
                isLoading={isLoading}
                onPress={() => handlePushDataImagesSave(1)}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalChecklistCImage;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    height: 48,
    paddingHorizontal: 10,
    backgroundColor: "white",
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
  head: {
    backgroundColor: COLORS.bg_main,
    // height: 30
  },
  headText: {
    textAlign: "center",
    color: COLORS.text_main,
  },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  selectedTextStyle: {
    // color: COLORS.bg_button,
    fontWeight: "600",
  },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    backgroundColor: "white",
    zIndex: 1,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
  },
  image: {
    // width: "48%",
    height: 100,
    resizeMode: "center",
    marginVertical: 10,
  },
});
