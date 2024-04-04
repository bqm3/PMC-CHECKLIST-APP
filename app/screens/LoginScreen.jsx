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
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import { COLORS, SIZES } from "../constants/theme";
import Title from "../components/Title";
import ButtonSubmit from "../components/Button/ButtonSubmit";

import LoginContext from "../context/LoginContext";
import CopyRight from "../components/CopyRight";
import { ScrollView } from "react-native";

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    onPress={() => Keyboard.dismiss()}
  >
    {children}
  </TouchableWithoutFeedback>
);

const LoginScreen = ({ navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  const { step, saveStep } = useContext(LoginContext);
  const { error, user, message, isLoading } = useSelector(
    (state) => state.authReducer
  );
  // const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);

  const [data, setData] = useState({
    UserName: "",
    Password: "",
    Emails: "",
    Duan: "",
  });

  const handleSubmit = async () => {
    dispatch(login(data.UserName, data.Password));
  };

  const handleStep = () => {
    saveStep(3);
  };

  useEffect(() => {
    if (user) {
      saveStep(2);
      setData({
        UserName: data.UserName,
        Password: data.Password,
        Emails: user?.Emails,
        Duan: user?.ent_duan?.Duan,
      });
    }
  }, [user]);

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

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <HideKeyboard>
          <ImageBackground
            source={require("../../assets/bg_company.jpg")}
            resizeMode="cover"
            style={styles.defaultFlex}
          >
            <ScrollView contentContainerStyle={styles.container}>
              <Image
                style={{ width: 120, height: 70, resizeMode: "contain" }}
                source={require("../../assets/pmc_logo.png")}
              />
              <View style={{ marginHorizontal: 36 }}>
                <Title text={"Đăng nhập"} size={20} top={30} />

                <View
                  style={{
                    // marginTop: 20,
                    justifyContent: "flex-start",
                  }}
                >
                  <View style={{ height: 20 }}></View>
                  <View>
                    {message !== null && (
                      <Text
                        style={{
                          color: COLORS.bg_red,
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {message}
                      </Text>
                    )}
                  </View>

                  <View style={styles.action}>
                    <TextInput
                      placeholder="Nhập tài khoản"
                      placeholderTextColor="gray"
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                      onChangeText={(val) => handleChangeText("UserName", val)}
                      defaultValue={data.UserName}
                      autoCorrect={false}
                      secureTextEntry={false}
                      underLineColorAndroid="transparent"
                    />
                  </View>

                  <View style={styles.action}>
                    <TextInput
                      placeholder="Nhập mật khẩu"
                      placeholderTextColor="gray"
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                      value={data.Password}
                      onChangeText={(val) => handleChangeText("Password", val)}
                      secureTextEntry={!show}
                      onSubmitEditing={() => handleSubmit()}
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
                            width: 20,
                            height: 20,
                            resizeMode: "contain",
                          }}
                          source={require("../../assets/eye.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            width: 20,
                            height: 20,
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
                      placeholder="Email cá nhân"
                      value={data.Emails}
                      editable={false}
                      selectTextOnFocus={false}
                      placeholderTextColor="gray"
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                    />
                  </View>

                  <View style={styles.action}>
                    <TextInput
                      placeholder="Dự án tham dự"
                      value={data.Duan}
                      editable={false}
                      selectTextOnFocus={false}
                      placeholderTextColor="gray"
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                    />
                  </View>

                  <View style={{ height: 20 }} />
                  <ButtonSubmit
                    backgroundColor={COLORS.bg_button}
                    text={step === 2 ? "Vào trang" : "Đăng Nhập"}
                    // navigationNext={navigationNext}
                    isLoading={isLoading}
                    onPress={step === 2 ? handleStep : handleSubmit}
                  />
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        </HideKeyboard>
        {isKeyboardVisible === true ? (
          <></>
        ) : (
          <>
            <CopyRight />
          </>
        )}
      </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    // backgroundColor: COLORS.bg_white,
    justifyContent: "center",
    alignItems: "center",
  },
  action: {
    height: 50,
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
    fontSize: 16,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },

  dropdown: {
    marginTop: 12,
    height: 50,
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
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#05375a",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#05375a",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
