import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../constants/config";
import { Ionicons } from "@expo/vector-icons";
import Title from "../components/Title";
import ButtonSubmit from "../components/Button/ButtonSubmit";
import { logoutAction } from "../redux/actions/authActions";
import { COLORS } from "../constants/theme";
import LoginContext from "../context/LoginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adjust from "../adjust";
import { validatePassword } from "../utils/util";

const Profile = () => {
  const { user, authToken } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  const [isCheckSecurity, setIsCheckSecurity] = useState({
    password: true,
    newpassword: true,
    re_newpassword: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [dataPassword, setDataPassword] = useState({
    password: "",
    newpassword: "",
    re_newpassword: "",
  });

  const handleChangeSecurityPassword = (key, value) => {
    setIsCheckSecurity((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeDataPassword = (key, value) => {
    setDataPassword((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    setDataPassword({
      password: "",
      newpassword: "",
      re_newpassword: "",
    });
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    if (dataPassword.newpassword !== dataPassword.re_newpassword) {
      Alert.alert("Thông báo", "Mật khẩu phải trùng nhau", [
        { text: "Xác nhận", onPress: () => console.log("Cancel Pressed") },
      ]);
      setIsLoading(false);
      return;
    }

    if (!validatePassword(dataPassword.newpassword)) {
      Alert.alert(
        "Thông báo",
        "Mật khẩu ít nhất 6 ký tự và bao gồm ít nhất một chữ cái.",
        [{ text: "Xác nhận", onPress: () => console.log("Invalid password") }]
      );
      setIsLoading(false);
    } else {
      await axios
        .post(
          BASE_URL + `/ent_user/change-password/`,
          {
            currentPassword: dataPassword.password,
            newPassword: dataPassword.newpassword,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
          }
        )
        .then((response) => {
          handleAdd();
          setIsLoading(false);
          Alert.alert("Thông báo", response.data.message, [
            { text: "Xác nhận", onPress: () => logout() },
          ]);
        })
        .catch((err) => {
          setIsLoading(false);
          Alert.alert("Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        });
    }
  };

  const logout = async () => {
    dispatch(logoutAction());
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === "ios" ? 120 : 140}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ImageBackground
          source={require("../../assets/thumbnail.png")}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1, margin: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Title
              text={"Thông tin cá nhân"}
              size={adjust(18)}
              top={10}
              bottom={10}
            />
            <View style={styles.inputs}>
              <TextInput
                allowFontScaling={false}
                value={user?.UserName}
                editable={false}
                placeholder="Nhập tên ca thực hiện checklist"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
              />
            </View>
            <View style={styles.inputs}>
              <TextInput
                allowFontScaling={false}
                value={user?.Email}
                editable={false}
                placeholder="Nhập email cá nhân"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
              />
            </View>
            <View style={styles.inputs}>
              <TextInput
                allowFontScaling={false}
                value={user?.ent_chucvu?.Chucvu}
                editable={false}
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
              />
            </View>
            <View style={styles.inputs}>
              <TextInput
                allowFontScaling={false}
                value={user?.ent_duan?.Duan}
                editable={false}
                placeholder="Tên dự án"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
              />
            </View>
            <Title
              text={"Đổi mật khẩu"}
              size={adjust(18)}
              top={10}
              bottom={10}
            />

            <View style={styles.inputs}>
              <Text allowFontScaling={false} style={styles.text}>
                Mật khẩu cũ
              </Text>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  placeholder="Mật khẩu cũ"
                  placeholderTextColor="gray"
                  secureTextEntry={isCheckSecurity.password}
                  onChangeText={(searchString) => {
                    handleChangeDataPassword("password", searchString);
                  }}
                  underlineColorAndroid="transparent"
                  autoCapitalize="sentences"
                />
                <TouchableOpacity
                  onPress={() =>
                    handleChangeSecurityPassword(
                      "password",
                      !isCheckSecurity.password
                    )
                  }
                >
                  <Ionicons
                    style={styles.searchIcon}
                    name={isCheckSecurity.password ? "eye" : "eye-off"}
                    size={adjust(20)}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputs}>
              <Text allowFontScaling={false} style={styles.text}>
                Mật khẩu mới
              </Text>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  placeholder="Mật khẩu mới"
                  placeholderTextColor="gray"
                  secureTextEntry={isCheckSecurity.newpassword}
                  onChangeText={(searchString) => {
                    handleChangeDataPassword("newpassword", searchString);
                  }}
                  underlineColorAndroid="transparent"
                  autoCapitalize="sentences"
                />
                <TouchableOpacity
                  onPress={() =>
                    handleChangeSecurityPassword(
                      "newpassword",
                      !isCheckSecurity.newpassword
                    )
                  }
                >
                  <Ionicons
                    style={styles.searchIcon}
                    name={isCheckSecurity.newpassword ? "eye" : "eye-off"}
                    size={adjust(20)}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputs}>
              <Text allowFontScaling={false} style={styles.text}>
                Nhập lại mật khẩu
              </Text>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="gray"
                  secureTextEntry={isCheckSecurity.re_newpassword}
                  onChangeText={(searchString) => {
                    handleChangeDataPassword("re_newpassword", searchString);
                  }}
                  underlineColorAndroid="transparent"
                  autoCapitalize="sentences"
                />
                <TouchableOpacity
                  onPress={() =>
                    handleChangeSecurityPassword(
                      "re_newpassword",
                      !isCheckSecurity.re_newpassword
                    )
                  }
                >
                  <Ionicons
                    style={styles.searchIcon}
                    name={isCheckSecurity.re_newpassword ? "eye" : "eye-off"}
                    size={adjust(20)}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <ButtonSubmit
              backgroundColor={COLORS.bg_button}
              text={"Lưu"}
              isLoading={isLoading}
              onPress={() => handleSubmit()}
            />
            <View style={{ height: 12 }}></View>
            <ButtonSubmit
              backgroundColor={COLORS.bg_red}
              text={"Đăng xuất"}
              onPress={() => logout()}
            />
          </ScrollView>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </GestureHandlerRootView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  inputs: {
    marginBottom: 10,
  },
  text: {
    fontSize: adjust(15),
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  textInput: {
    color: "#05375a",
    fontSize: adjust(16),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: adjust(50),
    paddingVertical: 4,
    backgroundColor: "#eeeeee",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#05375a",
    fontSize: adjust(16),
    borderRadius: 8,
    height: adjust(50),
    paddingVertical: 4,
  },
});
