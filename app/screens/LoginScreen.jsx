import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  // Image,
  TextInput,
  StyleSheet,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
// import {
//   Invert,
//   Grayscale,
//   Brightness,
//   Contrast
// } from 'react-native-color-matrix-image-filters';
import { Svg, Image, Defs, Filter, FeColorMatrix } from "react-native-svg";
import React, { useEffect, useState, useContext, useRef, useMemo, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { Provider, useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import { COLORS, SIZES } from "../constants/theme";
import Title from "../components/Title";
import ButtonSubmit from "../components/Button/ButtonSubmit";
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import NetInfo from "@react-native-community/netinfo";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adjust from "../adjust";
import { BASE_URL, BASE_URL_NOTI } from "../constants/config";
import NotificationComponent from "../components/Notification/NotificationComponent";
import axios from "axios";

import DataLicense from "../components/PrivacyPolicy";
import Checkbox from "../components/Active/Checkbox";
import ModalForgotPassword from "../components/Modal/ModalForgotPassword";

const version = "2.2.4";

const LoginScreen = ({ navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  const { error, user, message, isLoading } = useSelector((state) => state.authReducer);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(-1);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "50%", "90%"], []);
  const [opacity, setOpacity] = useState(1);

  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [data, setData] = useState({
    UserName: "",
    Password: "",
  });

  const [errorMsg, setErrorMsg] = useState(null);
  const [statusLocation, setStatusLocation] = useState(1);
  const [isConnected, setConnected] = useState(true);
  const [notification, setNotification] = useState(null);
  const [animation, setAnimation] = useState("slideInDown");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isForgotPW, setIsForgotPW] = useState(false);
  const [isLoadingPW, setIsLoadingPW] = useState(false);

  //
  const [deviceInfo, setDeviceInfo] = useState({});
  const [ip, setIp] = useState("");
  const [infoIP, setInfoIP] = useState("");

  useEffect(() => {
    const getDeviceInformation = async () => {
      try {
        const info = {
          brand: Device.brand,
          manufacturer: Device.manufacturer,
          modelName: Device.modelName,
          deviceName: Device.deviceName,
          osName: Device.osName,
          osVersion: Device.osVersion,
          deviceType: Device.deviceType,
        };
        setDeviceInfo(info);
      } catch (error) {
        console.error("Error getting device info:", error);
      }
    };

    getDeviceInformation();
  }, []);

  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        setIp(response.data.ip); // Lưu IP vào state
      })
      .catch((error) => {
        console.error("Error fetching IP:", error);
      });
  }, []);

  useEffect(() => {
    const getIpInfo = async (ip) => {
      const response = await axios.get(`https://ipinfo.io/${ip}/json`);
      const { readme, ...filteredInfo } = response.data;
      setInfoIP(filteredInfo);
    };
    getIpInfo(ip);
  }, [ip]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert("PMC Thông báo", "Không có kết nối mạng", [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]);
      return;
    }

    if (data?.UserName === "" || data?.Password === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin đăng nhập", [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]);
    } else {
      dispatch(login(data?.UserName, data?.Password, deviceInfo, infoIP));
      await AsyncStorage.setItem("Password", data?.Password);
      await AsyncStorage.setItem("UserName", data?.UserName);
      if (isChecked) {
        await AsyncStorage.setItem("UserName", data?.UserName);
        await AsyncStorage.setItem("Password", data?.Password);
      }
    }
  };

  useEffect(() => {
    const handleNoti = async () => {
      try {
        const response = await axios.get(BASE_URL + `/noti?version=${version}&platform=${Platform.OS}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (response.data.status == 1) {
          const data = response.data;
          setNotification(data);
        }
      } catch (err) {
        console.log("err", err);
      }
    };

    handleNoti();
  }, []);

  useEffect(() => {
    if (message) {
      Alert.alert("PMC Thông báo", `${message}`, [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]);
    }
  }, [message, error]);

  useEffect(() => {
    const loadData = async () => {
      const savedUsername = await AsyncStorage.getItem("UserName");
      const savedPassword = await AsyncStorage.getItem("Password");
      if (savedUsername && savedPassword) {
        setData({
          UserName: savedUsername,
          Password: savedPassword,
        });
        setIsChecked(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setData({
        UserName: data?.UserName,
        Password: data?.Password,
      });
    }
  }, [user]);

  const handleToggle = async () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      await AsyncStorage.setItem("UserName", data?.UserName);
      await AsyncStorage.setItem("Password", data?.Password);
    } else {
      await AsyncStorage.removeItem("UserName");
      await AsyncStorage.removeItem("Password");
    }
  };

  const handleChangeText = (key, value) => {
    setData((data) => ({
      ...data,
      [key]: value,
    }));
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setAnimation("slideOutUp");
      }, notification?.data?.time);

      return () => {
        clearTimeout(timer);
        setNotification(null);
      };
    }
  }, [notification]);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current.expand();
    setIsBottomSheetOpen(0); // Open bottomsheet
  }, []);

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(-1);
  };

  const handleCloseModal = () => {
    setUsername("");
    setEmail("");
    setIsForgotPW(false);
  };

  useEffect(() => {
    if (statusLocation === 0) {
      Alert.alert("PMC Thông báo", "Hãy cấp quyền định vị vị trí của bạn!!", [
        {
          text: "Xác nhận",
          onPress: () => {
            setStatusLocation(2);
          },
        },
      ]);
    }
  }, [statusLocation]);

  useEffect(() => {
    (async () => {
      if (statusLocation === 1) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "denied") {
          setStatusLocation(0);
          setErrorMsg("Permission to access location was denied");
          return;
        }
        if (status === "granted") {
          console.log("Đã cấp quyền");
        }
      }

      if (statusLocation === 2) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "denied") {
          setErrorMsg("Permission denied. Please enable location services in settings.");
          Alert.alert("PMC Thông báo", "Bạn cần bật quyền truy cập vị trí trong Cài đặt để tiếp tục sử dụng ứng dụng.", [
            {
              text: "Mở cài đặt",
              onPress: () => Linking.openSettings(), // Open app settings
            },
            { text: "Hủy", style: "cancel" },
          ]);
          return;
        }

        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
        }
      }
    })();
  }, [statusLocation]);

  const handleForgotPassword = async () => {
    if (username == "" || email == "") {
      Alert.alert("Cảnh báo", "Vui lòng nhập nhập đầy đủ thông tin.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Vui lòng nhập email hợp lệ.");
      return;
    }

    try {
      setIsLoadingPW(true);
      const response = await axios.post(
        BASE_URL + `/mail/resetPassword`,
        { UserName: username, Email: email },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      setIsLoadingPW(false);
      if (response.status == 200) {
        Alert.alert("Thành công", "Yêu cầu khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.", [
          { text: "Xác nhận", onPress: () => handleCloseModal() },
        ]);
      } else {
        Alert.alert("Lỗi", response.data.message || "Đã xảy ra lỗi.");
      }
    } catch (err) {
      console.log("err", err.message);
      setIsLoadingPW(false);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ. Vui lòng thử lại.");
    }
  };

  const colorMatrixValues = Platform.OS === 'ios' 
  ? "-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0" // iOS
  : "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"; // Android
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ImageBackground source={require("../../assets/bg_new.png")} resizeMode="cover" style={styles.defaultFlex}>
            <ScrollView contentContainerStyle={[styles.container]} style={{ opacity: opacity }} scrollEnabled={false}>
              {notification?.status == 1 && (
                <NotificationComponent
                  notification={notification}
                  animation={animation}
                  setAnimation={setAnimation}
                  setNotification={setNotification}
                />
              )}
              {/* <Image
                style={{
                  width: adjust(300), // Tăng lên 200
                  height: adjust(200), // Tăng lên 120
                  filter: "invert(1) grayscale(1) brightness(1.8) contrast(2)",
                  resizeMode: "contain",
                }}
                source={require("../../assets/logo_checklist.png")}
              /> */}

              <View style={{ marginHorizontal: 20 }}>
                {/* <Title text={"Đăng nhập"} size={adjust(20)} top={30} /> */}
                {/* <Image
                  style={{
                    width: adjust(300), // Tăng lên 200
                    height: adjust(200), // Tăng lên 120
                    // filter: "invert(1) grayscale(1) brightness(1.8) contrast(2)",
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                  source={require("../../assets/logo_checklist.png")}
                /> */}
                <Svg width={adjust(300)} height={adjust(200)} alignSelf="center">
                  <Defs>
                    <Filter id="colorMatrix">
                      <FeColorMatrix type="matrix" values={colorMatrixValues} />
                    </Filter>
                  </Defs>
                  <Image width={adjust(300)} height={adjust(200)} href={require("../../assets/logo_checklist.png")} filter="url(#colorMatrix)" />
                </Svg>
                <View
                  style={{
                    justifyContent: "flex-start",
                  }}
                >
                  <View style={{ height: adjust(20) }}></View>
                  <View style={styles.action}>
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Nhập tài khoản"
                      placeholderTextColor="gray"
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                      onChangeText={(val) => handleChangeText("UserName", val)}
                      defaultValue={data?.UserName}
                      autoCorrect={false}
                      secureTextEntry={false}
                      underLineColorAndroid="transparent"
                    />
                  </View>

                  <View style={styles.action}>
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Nhập mật khẩu"
                      placeholderTextColor="gray"
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                      value={data?.Password}
                      onChangeText={(val) => handleChangeText("Password", val)}
                      secureTextEntry={!show}
                      // onSubmitEditing={() => handleSubmit()}
                    />
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => setShow(!show)}
                    >
                      {!show ? (
                        <Image
                          style={{
                            width: adjust(28),
                            height: adjust(28),
                            resizeMode: "contain",
                          }}
                          source={require("../../assets/eye.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            width: adjust(28),
                            height: adjust(28),
                            resizeMode: "contain",
                          }}
                          source={require("../../assets/hidden.png")}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: adjust(12),
                    }}
                  >
                    <View style={styles.checkboxContainer}>
                      <Checkbox style={styles.checkbox} isCheck={isChecked} onPress={handleToggle} />
                      <TouchableOpacity>
                        <Text allowFontScaling={false} style={[styles.label, { textDecorationLine: "none" }]}>
                          Lưu thông tin
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Pressable
                      onPress={() => {
                        setIsForgotPW(true);
                      }}
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <Text allowFontScaling={false} style={[styles.label]}>
                        Quên mật khẩu
                      </Text>
                    </Pressable>
                  </View>

                  <View style={{ height: 12 }} />
                  <ButtonSubmit backgroundColor={COLORS.bg_button} text={"Đăng nhập"} isLoading={isLoading} onPress={handleSubmit} />

                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      textAlign: "right",
                      paddingTop: 10,
                    }}
                    allowFontScaling={false}
                  >
                    Phiên bản: {version}
                  </Text>
                </View>
              </View>

              <View style={[styles.checkboxContainer, { marginTop: 30, justifyContent: "center" }]}>
                <TouchableOpacity onPress={handlePresentModalPress}>
                  <Text allowFontScaling={false} style={[styles.label, { textDecorationLine: "none" }]}>
                    Các{" "}
                    <Text allowFontScaling={false} style={styles.label}>
                      điều khoản
                    </Text>{" "}
                    và{" "}
                    <Text allowFontScaling={false} style={styles.label}>
                      điều kiện
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>

              <Modal animationType="slide" transparent={true} visible={isForgotPW} onRequestClose={handleCloseModal}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                  <ModalForgotPassword
                    handleCloseModal={handleCloseModal}
                    username={username}
                    setUsername={setUsername}
                    email={email}
                    setEmail={setEmail}
                    handleForgotPassword={handleForgotPassword}
                    isLoadingPW={isLoadingPW}
                  />
                </KeyboardAvoidingView>
              </Modal>
            </ScrollView>

            <BottomSheet
              ref={bottomSheetModalRef}
              index={isBottomSheetOpen}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              enableDynamicSizing={false}
              enablePanDownToClose={true}
              onClose={handleCloseBottomSheet}
            >
              <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                <DataLicense />
              </BottomSheetScrollView>
            </BottomSheet>
          </ImageBackground>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  defaultFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginEnd: adjust(4),
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    color: "white",
    margin: 4,
    fontWeight: "700",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  action: {
    height: adjust(50),
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
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
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  textInput: {
    paddingLeft: 12,
    color: "#05375a",
    width: "88%",
    fontSize: adjust(16),
    height: adjust(50),
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: adjust(14),
  },

  dropdown: {
    marginTop: 12,
    height: adjust(50),
    paddingHorizontal: 12,
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
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: adjust(16),
  },
  placeholderStyle: {
    fontSize: adjust(16),
    color: "#05375a",
  },
  selectedTextStyle: {
    fontSize: adjust(16),
    color: "#05375a",
  },
  iconStyle: {
    width: adjust(20),
    height: adjust(20),
  },
  inputSearchStyle: {
    height: adjust(40),
    fontSize: adjust(16),
  },
  paragraph: {
    fontSize: adjust(18),
    textAlign: "center",
  },
});
