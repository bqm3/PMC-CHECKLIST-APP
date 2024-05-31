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
import LoginContext from "../context/LoginContext";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import DataLicense from "../components/PrivacyPolicy";
import Checkbox from "../components/Active/Checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adjust from "../adjust";

const LoginScreen = ({ navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  const { step, saveStep } = useContext(LoginContext);
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
    Emails: "",
    Duan: "",
  });

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async () => {
    if (data?.UserName === "" || data?.Password === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin đăng nhập", [
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      dispatch(login(data?.UserName, data?.Password));
    }
  };

  useEffect(() => {
    if (message) {
      Alert.alert(
        "PMC Thông báo",
        "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!!",
        [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]
      );
    }
  }, [message, error]);

  const handleStep = () => {
    saveStep(3);
  };

  useEffect(() => {
    const loadData = async () => {
      const savedUsername = await AsyncStorage.getItem('UserName');
      const savedPassword = await AsyncStorage.getItem('Password');
      if (savedUsername && savedPassword) {
        setData({
          ...data,
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
      saveStep(2);
      setData({
        UserName: data?.UserName,
        Password: data?.Password,
        Emails: user?.Emails,
        Duan: user?.ent_duan?.Duan,
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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");

        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
                  style={{ width: adjust(120), height: adjust(70), resizeMode: "contain" }}
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
                    {/* <Text allowFontScaling={false} style={styles.paragraph}>{text}</Text> */}
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
                    {/* </HideKeyboard> */}
                    <View style={styles.action}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Email cá nhân"
                        value={data?.Emails}
                        editable={false}
                        selectTextOnFocus={false}
                        placeholderTextColor="gray"
                        style={[styles.textInput]}
                        autoCapitalize="sentences"
                      />
                    </View>

                    <View style={styles.action}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Dự án tham dự"
                        value={data?.Duan}
                        editable={false}
                        selectTextOnFocus={false}
                        placeholderTextColor="gray"
                        style={[styles.textInput]}
                        autoCapitalize="sentences"
                      />
                    </View>

                    <View style={styles.checkboxContainer}>
                      <Checkbox
                        style={styles.checkbox}
                        isCheck={isChecked}
                        onPress={handleToggle}
                      />
                      <TouchableOpacity onPress={handlePresentModalPress}>
                        <Text
                          allowFontScaling={false}
                          style={[styles.label, { textDecorationLine: "none" }]}
                        >
                          Lưu tài khoản và mật khẩu
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ height: 20 }} />
                    <ButtonSubmit
                      backgroundColor={COLORS.bg_button}
                      text={step === 2 ? "Vào trang" : "Đăng Nhập"}
                      isLoading={isLoading}
                      onPress={step === 2 ? handleStep : handleSubmit}
                    />
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
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: adjust(16),
  },
  paragraph: {
    fontSize: adjust(18),
    textAlign: "center",
  },
});
