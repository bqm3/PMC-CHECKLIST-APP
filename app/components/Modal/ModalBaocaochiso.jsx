import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";

import Button from "../Button/Button";
import { COLORS, SIZES } from "../../constants/theme";
import { BASE_URL } from "../../constants/config";

const ModalBaocaochiso = ({
  dataItem,
  arrayItem,
  setArrayItem,
  selectedItemData,
  handleCloseBottomSheet,
}) => {
  const [chiso, setChiso] = useState("");
  const [ghichu, setGhichu] = useState("");
  const [opacity, setOpacity] = useState(1);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    if (selectedItemData) {
      setChiso(selectedItemData?.Chiso || "");
      setGhichu(selectedItemData?.Ghichu || "");
    }
  }, [selectedItemData]);

  const handleChiso = (value) => {
    setChiso(value);
    selectedItemData.Chiso = value;
  };

  const handleGhichu = (value) => {
    setGhichu(value);
    selectedItemData.Ghichu = value;
  };

  const handleSubmit = () => {
    
    const chisoFloat = parseFloat(selectedItemData.Chiso);

    if (isNaN(chisoFloat)) {
      Alert.alert("Lỗi", "Số tiêu thụ phải là một số hợp lệ.");
      return;
    }

    const existingIndex = arrayItem.findIndex(
      (item) => item.ID_Hangmuc_Chiso === selectedItemData.ID_Hangmuc_Chiso
    );

    setArrayItem((prevItems) => {
      if (existingIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingIndex] = selectedItemData;
        return newItems;
      }
      return [...prevItems, selectedItemData];
    });

    handleCloseBottomSheet();
  };

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0];
      selectedItemData.Image = imageUri;

      const formData = new FormData();
      const file = {
        uri:
          Platform.OS === "android"
            ? imageUri.uri
            : imageUri.uri.replace("file://", ""),
        name:
          imageUri.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
        type: "image/jpg",
      };

      formData.append("file", file);

      try {
        setIsLoadingImage(true);
        setOpacity(0.2);
        const { data } = await axios.post(
          `${BASE_URL}/image/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const recognizedValue = data.result[0];
        setChiso(recognizedValue);
        selectedItemData.Chiso = recognizedValue;
        selectedItemData.Chiso_Read_Img = recognizedValue;
        setIsLoadingImage(false);
        setOpacity(1);
      } catch (error) {
        setIsLoadingImage(false);
        setOpacity(1);
        console.error("Image upload error:", error);
        showAlert("Có lỗi xảy ra vui lòng thử lại")
      }
    }
  };

  const showAlert = (message) => {
    Alert.alert("PMC Thông báo", message, [
      {
        text: "Xác nhận",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  return (
    <GestureHandlerRootView style={[styles.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={[styles.content, , { opacity: opacity}]}  pointerEvents={isLoadingImage ? "none" : "auto"}>
            <Text style={styles.text}>Chụp ảnh</Text>
            <View style={styles.imageSection}>
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Entypo name="camera" size={15} color="black" />
              </TouchableOpacity>
              {selectedItemData?.Image?.uri && (
                <Image
                  source={{ uri: selectedItemData?.Image?.uri }}
                  style={styles.image}
                />
              )}
            </View>
            <Text style={styles.text}>Số tiêu thụ</Text>
            <TextInput
              value={chiso}
              keyboardType="numeric"
              placeholder="Số tiêu thụ"
              placeholderTextColor="gray"
              onChangeText={handleChiso}
              style={styles.textInput}
              editable={selectedItemData?.Image?.uri !== undefined }
            />
            <Text style={styles.text}>Ghi chú</Text>
            <TextInput
              value={ghichu}
              placeholder="Thêm ghi chú"
              placeholderTextColor="gray"
              multiline
              onChangeText={handleGhichu}
              style={[styles.textInput, styles.multilineTextInput]}
            
            />
            <View style={styles.buttonContainer}>
              <Button
                backgroundColor={COLORS.bg_button}
                border={COLORS.bg_button}
                color="white"
                text="Lưu"
                width="100%"
                onPress={handleSubmit}
              />
            </View>
          </View>

          {isLoadingImage && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <ActivityIndicator size="large" color="blue" />
              <Text>Đang đọc dữ liệu ...</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default React.memo(ModalBaocaochiso);

const styles = StyleSheet.create({
  container: {
    height: "auto",
  },
  content: {
    width: SIZES.width,
    paddingHorizontal: 20,
    height: "auto",
  },
  imageSection: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cameraButton: {
    backgroundColor: "white",
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    borderColor: COLORS.bg_button,
    borderWidth: 1,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "white",
    textAlign: "left",
  },
  multilineTextInput: {
    height: 80,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
