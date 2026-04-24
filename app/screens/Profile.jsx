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
  console.log(user);
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
          Alert.alert("Thông báo", `${err.response.data.message || "Đã xảy ra lỗi."}`, [
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
            
            <View style={styles.profileHeader}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerHoten}>{user?.Hoten}</Text>
                <Text style={styles.headerEmail}>{user?.Email}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tên đăng nhập</Text>
                <Text style={styles.infoValue}>{user?.UserName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Chức vụ</Text>
                <Text style={styles.infoValue}>{user?.ent_chucvu?.Chucvu}</Text>
              </View>
            </View>

            {/* <Title
              text={"Thông tin dự án"}
              size={adjust(18)}
              top={5}
              bottom={10}
            />
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dự án</Text>
                <Text style={[styles.infoValue, { color: COLORS.bg_button }]}>{user?.ent_duan?.Duan}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Chi nhánh</Text>
                <Text style={styles.infoValue}>{user?.ent_duan?.ent_chinhanh?.Tenchinhanh}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Công ty</Text>
                <Text style={styles.infoValue}>{user?.ent_duan?.ent_congty?.ten_cong_ty}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Phân loại</Text>
                <Text style={styles.infoValue} numberOfLines={2}>{user?.ent_duan?.ent_phanloaida?.Phanloai}</Text>
              </View>
            </View> */}

            <Title
              text={"Đổi mật khẩu"}
              size={adjust(18)}
              top={5}
              bottom={10}
            />

            <View style={styles.passwordCard}>
              <View style={styles.inputs}>
                <Text allowFontScaling={false} style={styles.passwordLabel}>
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
                <Text allowFontScaling={false} style={styles.passwordLabel}>
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

              <View style={[styles.inputs, { marginBottom: 0 }]}>
                <Text allowFontScaling={false} style={styles.passwordLabel}>
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: adjust(15),
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  profileLogo: {
    width: adjust(60),
    height: adjust(60),
    borderRadius: adjust(30),
    backgroundColor: "white",
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerHoten: {
    fontSize: adjust(18),
    color: "white",
    fontWeight: "bold",
  },
  headerEmail: {
    fontSize: adjust(14),
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  infoLabel: {
    fontSize: adjust(14),
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    flex: 0.4,
  },
  infoValue: {
    fontSize: adjust(14),
    color: "white",
    fontWeight: "600",
    flex: 0.6,
    textAlign: "right",
  },
  passwordCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  passwordLabel: {
    fontSize: adjust(14),
    color: "white",
    fontWeight: "600",
    marginBottom: 5,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: adjust(45),
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: "#05375a",
    fontSize: adjust(15),
    height: "100%",
  },
});
