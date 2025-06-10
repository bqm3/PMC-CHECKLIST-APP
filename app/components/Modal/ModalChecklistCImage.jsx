import { ScrollView, StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Modal } from "react-native";
import { WebView } from "react-native-webview";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../Button/Button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ModalChecklistCImage = ({ handlePushDataSave, isLoading, handleChangeImages, dataImages, handlePushDataImagesSave, newActionCheckList }) => {
  const date = new Date();
  const dateHour = moment(date).format("LTS");
  const [image1, setImage1] = useState(newActionCheckList[0]?.Anh1 || null);
  const [image2, setImage2] = useState(newActionCheckList[0]?.Anh2 || null);
  const [image3, setImage3] = useState(newActionCheckList[0]?.Anh3 || null);
  const [image4, setImage4] = useState(newActionCheckList[0]?.Anh4 || null);
  // const [openImage1, setOpenImage1] = useState(false);
  // const [openImage2, setOpenImage2] = useState(false);
  // const [openImage3, setOpenImage3] = useState(false);
  // const [openImage4, setOpenImage4] = useState(false);

  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadImagesFromStorage();
  }, []);

  useEffect(() => {
    if (newActionCheckList[0]) {
      if (newActionCheckList[0].Anh1) {
        setImage1(newActionCheckList[0].Anh1);
        // setOpenImage1(true);
      }
      if (newActionCheckList[0].Anh2) {
        setImage2(newActionCheckList[0].Anh2);
        // setOpenImage2(true);
      }
      if (newActionCheckList[0].Anh3) {
        setImage3(newActionCheckList[0].Anh3);
        // setOpenImage3(true);
      }
      if (newActionCheckList[0].Anh4) {
        setImage4(newActionCheckList[0].Anh4);
        // setOpenImage4(true);
      }
    }
  }, [newActionCheckList]);

  useEffect(() => {
    if (image1 || image2 || image3 || image4) {
      saveImagesToStorage();
    }
  }, [image1, image2, image3, image4, dataImages]);

  const pickImage = async (text, hour, onPress, setOpen) => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Adjust image quality (0 to 1)
    });

    if (!result.canceled) {
      const assetFile = result?.assets[0];
      handleChangeImages(text, assetFile);
      handleChangeImages(hour, dateHour);
      onPress(assetFile);
      setOpen(true);
    }
  };

  const onPressLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    // Get the current location
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    // Convert location to address
    let { coords } = currentLocation;
    let reverseGeocodedAddress = await Location.reverseGeocodeAsync(coords);
    setAddress(reverseGeocodedAddress);
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const handleWebView = (image) => {
    setModalVisible(true);
    setImage(image);
  };

  const handleDeleteImage = async (imageNumber) => {
    try {
      switch (imageNumber) {
        case 1:
          setImage1(null);
          handleChangeImages("Anh1", null);
          handleChangeImages("Giochupanh1", null);
          break;
        case 2:
          setImage2(null);
          handleChangeImages("Anh2", null);
          handleChangeImages("Giochupanh2", null);
          break;
        case 3:
          setImage3(null);
          handleChangeImages("Anh3", null);
          handleChangeImages("Giochupanh3", null);
          break;
        case 4:
          setImage4(null);
          handleChangeImages("Anh4", null);
          handleChangeImages("Giochupanh4", null);
          break;
      }

      // Xóa dữ liệu trong AsyncStorage
      const savedImages = await AsyncStorage.getItem("tempChecklistImages");
      if (savedImages) {
        const imagesData = JSON.parse(savedImages);
        const updatedImagesData = {
          ...imagesData,
          [`image${imageNumber}`]: null,
          dataImages: {
            ...imagesData.dataImages,
            [`Anh${imageNumber}`]: null,
            [`Giochupanh${imageNumber}`]: null,
          },
        };
        await AsyncStorage.setItem("tempChecklistImages", JSON.stringify(updatedImagesData));
      }
    } catch (error) {
      console.error("Error deleting image from storage:", error);
    }
  };

  const saveImagesToStorage = async () => {
    try {
      if (
        (image1 && typeof image1 !== "string") ||
        (image2 && typeof image2 !== "string") ||
        (image3 && typeof image3 !== "string") ||
        (image4 && typeof image4 !== "string")
      ) {
        const imagesData = {
          image1: image1,
          image2: image2,
          image3: image3,
          image4: image4,
          // openImage1: openImage1,
          // openImage2: openImage2,
          // openImage3: openImage3,
          // openImage4: openImage4,
          dataImages: dataImages,
        };
        await AsyncStorage.setItem("tempChecklistImages", JSON.stringify(imagesData));
      }
    } catch (error) {
      console.error("Error saving images:", error);
    }
  };

  const loadImagesFromStorage = async () => {
    try {
      const savedImages = await AsyncStorage.getItem("tempChecklistImages");
      if (savedImages) {
        const imagesData = JSON.parse(savedImages);
        if (!newActionCheckList[0]?.Anh1 && imagesData.image1) setImage1(imagesData.image1);
        if (!newActionCheckList[0]?.Anh2 && imagesData.image2) setImage2(imagesData.image2);
        if (!newActionCheckList[0]?.Anh3 && imagesData.image3) setImage3(imagesData.image3);
        if (!newActionCheckList[0]?.Anh4 && imagesData.image4) setImage4(imagesData.image4);

        // if (imagesData.image1) setOpenImage1(true);
        // if (imagesData.image2) setOpenImage2(true);
        // if (imagesData.image3) setOpenImage3(true);
        // if (imagesData.image4) setOpenImage4(true);

        if (imagesData.dataImages) {
          Object.keys(imagesData.dataImages).forEach((key) => {
            handleChangeImages(key, imagesData.dataImages[key]);
          });
        }
      }
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
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
                <Text allowFontScaling={false} style={styles.text}>
                  Ảnh 1
                </Text>
                <View style={styles.container}>
                  {image1 === null ? (
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={() => {
                        pickImage("Anh1", "Giochupanh1", setImage1);
                        onPressLocation();
                      }}
                    >
                      <Entypo name="camera" size={24} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.imageContainer} onPress={() => handleWebView(image1)} activeOpacity={0.7}>
                      <Image source={{ uri: typeof image1 === "string" ? image1 : image1?.uri }} style={styles.image} />
                      {typeof image1 !== "string" && (
                        <>
                          <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={() => {
                              pickImage("Anh1", "Giochupanh1", setImage1);
                              onPressLocation();
                            }}
                          >
                            <Text style={styles.retakeText}>Chụp lại</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(1)}>
                            <Text style={styles.deleteText}>X</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Ảnh 2
                </Text>
                <View style={styles.container}>
                  {image2 === null ? (
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={() => {
                        pickImage("Anh2", "Giochupanh2", setImage2);
                        onPressLocation();
                      }}
                    >
                      <Entypo name="camera" size={24} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.imageContainer} onPress={() => handleWebView(image2)} activeOpacity={0.7}>
                      <Image source={{ uri: typeof image2 === "string" ? image2 : image2?.uri }} style={styles.image} />
                      {typeof image2 !== "string" && (
                        <>
                          <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={() => {
                              pickImage("Anh2", "Giochupanh2", setImage2);
                              onPressLocation();
                            }}
                          >
                            <Text style={styles.retakeText}>Chụp lại</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(2)}>
                            <Text style={styles.deleteText}>X</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </TouchableOpacity>
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
                <Text allowFontScaling={false} style={styles.text}>
                  Ảnh 3
                </Text>
                <View style={styles.container}>
                  {image3 === null ? (
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={() => {
                        pickImage("Anh3", "Giochupanh3", setImage3);
                        onPressLocation();
                      }}
                    >
                      <Entypo name="camera" size={24} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.imageContainer} onPress={() => handleWebView(image3)} activeOpacity={0.7}>
                      <Image source={{ uri: typeof image3 === "string" ? image3 : image3?.uri }} style={styles.image} />
                      {typeof image3 !== "string" && (
                        <>
                          <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={() => {
                              pickImage("Anh3", "Giochupanh3", setImage3);
                              onPressLocation();
                            }}
                          >
                            <Text style={styles.retakeText}>Chụp lại</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(3)}>
                            <Text style={styles.deleteText}>X</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Ảnh 4
                </Text>
                <View style={styles.container}>
                  {image4 === null ? (
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={() => {
                        pickImage("Anh4", "Giochupanh4", setImage4);
                        onPressLocation();
                      }}
                    >
                      <Entypo name="camera" size={24} color="black" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.imageContainer} onPress={() => handleWebView(image4)} activeOpacity={0.7}>
                      <Image source={{ uri: typeof image4 === "string" ? image4 : image4?.uri }} style={styles.image} />
                      {typeof image4 !== "string" && (
                        <>
                          <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={() => {
                              pickImage("Anh4", "Giochupanh4", setImage4);
                              onPressLocation();
                            }}
                          >
                            <Text style={styles.retakeText}>Chụp lại</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(4)}>
                            <Text style={styles.deleteText}>X</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </TouchableOpacity>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            //Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text allowFontScaling={false} style={styles.modalText}>
                Hình ảnh checklist
              </Text>

              <Image
                style={{
                  width: "90%",
                  height: "90%",
                  resizeMode: "cover",
                  justifyContent: "center",
                  alignContent: "center",
                }}
                source={{ uri: typeof image4 === "string" ? image4 : image4?.uri }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setImage(null);
              }}
              style={styles.buttonImage}
            >
              <Text allowFontScaling={false} style={styles.textImage}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  buttonImage: {
    flexDirection: "row",
    backgroundColor: COLORS.bg_button,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  textImage: {
    padding: 12,
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: SIZES.height * 0.6,
    width: SIZES.width * 0.8,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
  },
  container: {
    width: "100%",
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
    height: 100,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: SIZES.borderRadius,
  },
  retakeButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 5,
  },
  retakeText: {
    color: "white",
    fontSize: 12,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,0,0,0.7)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraButton: {
    backgroundColor: "white",
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    borderColor: COLORS.bg_button,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
});
