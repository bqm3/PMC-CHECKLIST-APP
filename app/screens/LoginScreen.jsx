import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { Provider, useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import { COLORS, SIZES } from "../constants/theme";
import Title from "../components/Title";
import ButtonSubmit from "../components/Button/ButtonSubmit";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adjust from "../adjust";
import { BASE_URL, BASE_URL_NOTI } from "../constants/config";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { Snackbar } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import { PanGestureHandler } from "react-native-gesture-handler";
import NotificationComponent from "../components/Notification/NotificationComponent";
import axios from "axios";

import DataLicense from "../components/PrivacyPolicy";
import Checkbox from "../components/Active/Checkbox";

const alertTypeMap = {
  SUCCESS: ALERT_TYPE.SUCCESS,
  WARNING: ALERT_TYPE.WARNING,
  DANGER: ALERT_TYPE.DANGER,
  INFO: ALERT_TYPE.INFO,
};

const version = "2.0.2";

const LoginScreen = ({ navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  const { error, user, message, isLoading } = useSelector(
    (state) => state.authReducer
  );
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["85%"], []);
  const [opacity, setOpacity] = useState(1);

  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [data, setData] = useState({
    UserName: "",
    Password: "",
  });

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [statusLocation, setStatusLocation] = useState(1);
  const [isConnected, setConnected] = useState(true);
  const [notification, setNotification] = useState(null);
  const [animation, setAnimation] = useState("slideInDown");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert("PMC Thông báo", "Không có kết nối mạng", [
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }

    if (data?.UserName === "" || data?.Password === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin đăng nhập", [
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      dispatch(login(data?.UserName, data?.Password));
      if (isChecked) {
        await AsyncStorage.setItem("UserName", data?.UserName);
        await AsyncStorage.setItem("Password", data?.Password);
      }
    }
  };

  useEffect(() => {
    const handleNoti = async () => {
      try {
        const response = await axios.get(
          BASE_URL + `/noti?version=${version}&platform=${Platform.OS}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

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
      Alert.alert(
        "PMC Thông báo",
        "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!!",
        [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]
      );
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
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

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
    bottomSheetModalRef?.current?.present();
  }, []);

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
          setErrorMsg(
            "Permission denied. Please enable location services in settings."
          );
          Alert.alert(
            "PMC Thông báo",
            "Bạn cần bật quyền truy cập vị trí trong Cài đặt để tiếp tục sử dụng ứng dụng.",
            [
              {
                text: "Mở cài đặt",
                onPress: () => Linking.openSettings(), // Open app settings
              },
              { text: "Hủy", style: "cancel" },
            ]
          );
          return;
        }

        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          console.log("location", location);
        }
      }
    })();
  }, [statusLocation]);

  useEffect(() => {
    clearCacheDirectory();
  }, []);

  const clearCacheDirectory = async () => {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      for (const file of files) {
        await FileSystem.deleteAsync(`${cacheDir}${file}`, {
          idempotent: true,
        });
      }
      console.log("Đã xóa cache khi ứng dụng đóng.");
    } catch (error) {
      console.error("Lỗi khi xóa cache:", error);
    }
  };

  return (
    <>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {notification?.status == 1 && (
            <NotificationComponent
              notification={notification}
              animation={animation}
              setAnimation={setAnimation}
              setNotification={setNotification}
            />
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
          >
            <BottomSheetModalProvider>
              <ImageBackground
                source={require("../../assets/bg_new.png")}
                resizeMode="cover"
                style={styles.defaultFlex}
              >
                <ScrollView
                  contentContainerStyle={[styles.container]}
                  style={{ opacity: opacity }}
                >
                  <Image
                    style={{
                      width: adjust(120),
                      height: adjust(70),
                      resizeMode: "contain",
                    }}
                    source={require("../../assets/pmc_logo.png")}
                  />
                  <View style={{ marginHorizontal: 20 }}>
                    <Title text={"Đăng nhập"} size={adjust(20)} top={30} />

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
                          onChangeText={(val) =>
                            handleChangeText("UserName", val)
                          }
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
                          onChangeText={(val) =>
                            handleChangeText("Password", val)
                          }
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

                      <View style={styles.checkboxContainer}>
                        <Checkbox
                          style={styles.checkbox}
                          isCheck={isChecked}
                          onPress={handleToggle}
                        />
                        <TouchableOpacity>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.label,
                              { textDecorationLine: "none" },
                            ]}
                          >
                            Lưu tài khoản và mật khẩu
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ height: 20 }} />
                      <ButtonSubmit
                        backgroundColor={COLORS.bg_button}
                        text={"Đăng nhập"}
                        isLoading={isLoading}
                        onPress={handleSubmit}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "500",
                          width: "100%",
                          textAlign: "right",
                          padding: 4,
                        }}
                      >
                        Phiên bản: {version}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.checkboxContainer,
                      { marginTop: 30, justifyContent: "center" },
                    ]}
                  >
                    <TouchableOpacity onPress={handlePresentModalPress}>
                      <Text
                        allowFontScaling={false}
                        style={[styles.label, { textDecorationLine: "none" }]}
                      >
                        Các{" "}
                        <Text allowFontScaling={false} style={styles.label}>
                          điều khoản
                        </Text>{" "}
                        và{" "}
                        <Text allowFontScaling={false} style={styles.label}>
                          điều kiện
                        </Text>{" "}
                        của PMC
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </ImageBackground>

              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
              >
                <BottomSheetScrollView style={styles.contentContainer}>
                  <DataLicense />
                </BottomSheetScrollView>
              </BottomSheetModal>
            </BottomSheetModalProvider>
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </PaperProvider>
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
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
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
