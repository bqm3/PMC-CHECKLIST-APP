//import liraries
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, ImageBackground, Image, Platform, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import * as Device from "expo-device";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  ent_calv_get,
  ent_hangmuc_get,
  ent_khuvuc_get,
  ent_tang_get,
  ent_toanha_get,
  ent_khoicv_get,
  check_hsse,
  ent_get_sdt_KhanCap,
} from "../redux/actions/entActions";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { Alert, Linking } from "react-native";
import Constants from "expo-constants";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { BASE_URL } from "../constants/config";
import ItemHome from "../components/Item/ItemHome";
import adjust from "../adjust";
import ReportContext from "../context/ReportContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../redux/actions/authActions";
import { COLORS } from "../constants/theme";
import ExpoTokenContext from "../context/ExpoTokenContext";
import { validatePassword } from "../utils/util";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const handleRegistrationError = (message) => {
  Alert.alert("Lỗi", message);
};

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Only show the settings alert if finalStatus is not granted
    if (finalStatus !== "granted") {
      Alert.alert("Thông báo", "Bạn đã từ chối nhận thông báo. Hãy bật thông báo trong Cài đặt để tiếp tục.", [
        {
          text: "Mở cài đặt",
          onPress: () => Linking.openSettings(), // Open app settings if the user denies notification permissions
        },
        { text: "Hủy", style: "cancel" },
      ]);
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError("Không tìm thấy thông tin máy");
      return;
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Phải sử dụng thiết bị thật");
  }
}

const dataDanhMuc = [
  {
    id: 1,
    status: null,
    path: "Thực hiện Checklist",
    icon: require("../../assets/icons/o-01.png"),
  },
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../assets/icons/o-02.png"),
  },

  {
    id: 3,
    status: null,
    path: "Checklist Lại",
    icon: require("../../assets/icons/o-01.png"),
  },
  {
    id: 4,
    status: null,
    path: "Xử lý sự cố",
    icon: require("../../assets/icons/o-01.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 6,
    status: "new",
    path: "Báo cáo HSSE",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 7,
    status: "new",
    path: "Báo cáo S0",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 8,
    status: "new",
    path: "Đăng ký thi công",
    icon: require("../../assets/icons/o-04.png"),
  },
];

const dataGD = [
  {
    id: 1,
    status: null,
    path: "Xử lý sự cố",
    icon: require("../../assets/icons/o-01.png"),
  },
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../assets/icons/o-02.png"),
  },
  {
    id: 6,
    status: "new",
    path: "Báo cáo HSSE",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 7,
    status: "new",
    path: "Báo cáo S0",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 8,
    status: "new",
    path: "Đăng ký thi công",
    icon: require("../../assets/icons/o-04.png"),
  },
];

const dataKST = [
  {
    id: 1,
    status: null,
    path: "Thực hiện Checklist",
    icon: require("../../assets/icons/o-01.png"),
  },
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../assets/icons/o-02.png"),
  },
  {
    id: 4,
    status: null,
    path: "Checklist Lại",
    icon: require("../../assets/icons/o-01.png"),
  },

  {
    id: 3,
    status: null,
    path: "Xử lý sự cố",
    icon: require("../../assets/icons/o-01.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 6,
    status: "new",
    path: "Báo cáo HSSE",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 7,
    status: "new",
    path: "Báo cáo S0",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 8,
    status: "new",
    path: "Đăng ký thi công",
    icon: require("../../assets/icons/o-04.png"),
  },
];

//ban quản trị khối
const dataBQTKhoi = [
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../assets/icons/o-02.png"),
  },
  {
    id: 3,
    status: null,
    path: "Xử lý sự cố",
    icon: require("../../assets/icons/o-01.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 6,
    status: "new",
    path: "Báo cáo HSSE",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 7,
    status: "new",
    path: "Báo cáo S0",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 8,
    status: "new",
    path: "Đăng ký thi công",
    icon: require("../../assets/icons/o-04.png"),
  },
];

const dataBQTDuAn = [
  {
    id: 2,
    status: null,
    path: "Tra cứu",
    icon: require("../../assets/icons/o-02.png"),
  },
  {
    id: 5,
    status: "new",
    path: "Báo cáo chỉ số",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 6,
    status: "new",
    path: "Báo cáo HSSE",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 7,
    status: "new",
    path: "Báo cáo S0",
    icon: require("../../assets/icons/o-04.png"),
  },
  {
    id: 8,
    status: "new",
    path: "Đăng ký thi công",
    icon: require("../../assets/icons/o-04.png"),
  },
];

// create a component
const HomeScreen = ({ navigation, route }) => {
  const dispath = useDispatch();
  const setIsLoading = route.params.setIsLoading;
  const setColorLoading = route.params.setColorLoading;
  const fetchNotifications = route.params.fetchNotifications;
  const { user, authToken, passwordCore } = useSelector(
    (state) => state.authReducer
  );
  const { sdt_khancap } = useSelector((state) => state.entReducer);

  const { setToken } = useContext(ExpoTokenContext);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);

  const [duan, setDuan] = useState([]);
  const [refreshScreen, setRefreshScreen] = useState(false);

  const [checkP0, setCheckP0] = useState(false);

  const [arrDuan, setArrDuan] = useState([]);

  const notificationListener = useRef();
  const responseListener = useRef();

  const renderItem = ({ item, index }) => (
    <ItemHome
      ID_Chucvu={user?.ID_Chucvu}
      item={item}
      index={index}
      passwordCore={passwordCore}
      showAlert={showAlert}
    />
  );

  const int_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const int_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_tang = async () => {
    await dispath(ent_tang_get());
  };

  const int_calv = async () => {
    await dispath(ent_calv_get());
  };

  const int_get_sdt_KhanCap = async () => {
    await dispath(ent_get_sdt_KhanCap());
  };

  // const asyncPassword  = async () => {
  //   const data = await AsyncStorage.getItem("Password");
  //   if(data){
  //     setPasswordCore(data);
  //   }
  // }

  useEffect(() => {
    setArrDuan(user?.arr_Duan);
  }, []);

  useEffect(() => {
    // asyncPassword();
    checkPasswordStrength();
  }, []);

  const checkPasswordStrength = async () => {
    const password = await AsyncStorage.getItem("Password");
    if (password && !validatePassword(password)) {
      showAlert(
        "Mật khẩu của bạn không đủ mạnh. Vui lòng cập nhật mật khẩu mới với độ bảo mật cao hơn."
      );
    }
  };

  const funcDuan = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ent_duan/thong-tin-du-an`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDuan(response.data.data);
    } catch (error) {
      Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra vui lòng thử lại", [
        {
          text: "Xác nhận",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    }
  };

  useEffect(() => {
    int_khuvuc();
    int_hangmuc();
    init_toanha();
    init_khoicv();
    init_tang();
    int_calv();
    funcDuan();
    funcCheckP0();
    int_get_sdt_KhanCap();
    fetchNotifications();
  }, [refreshScreen]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    const dataRes = async () => {
      await axios
        .post(
          BASE_URL + "/ent_user/device-token",
          {
            deviceToken: expoPushToken,
            deviceName: Device.modelName,
          },
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        )
        .then((response) => {})
        .catch((err) => console.log("err device", err));
    };
    if (expoPushToken) {
      dataRes();
      setToken(expoPushToken);
    }
  }, [authToken, expoPushToken, Device]);

  const funcHandleDuan = async (ID_Duan) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${BASE_URL}/ent_user/duan/update/${ID_Duan}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Xử lý response nếu thành công
      if (response.status === 200) {
        const UserName = await AsyncStorage.getItem("UserName");
        const Password = await AsyncStorage.getItem("Password");
        dispath(login(UserName, Password));
        Alert.alert("Thông báo", "Cập nhật dự án thành công!");
        setRefreshScreen(true);
      }
    } catch (error) {
      console.log("error", error.message);
      Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra, vui lòng thử lại", [
        {
          text: "Xác nhận",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const funcHandleClearDuan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${BASE_URL}/ent_user/duan/clear`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Xử lý response nếu thành công
      if (response.status === 200) {
        const UserName = await AsyncStorage.getItem("UserName");
        const Password = await AsyncStorage.getItem("Password");
        dispath(login(UserName, Password));
        Alert.alert("Thông báo", "Cập nhật dự án thành công!");
        setRefreshScreen(true);
      }
    } catch (error) {
      console.log("error", error.message);
      Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra, vui lòng thử lại", [
        {
          text: "Xác nhận",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const funcCheckP0 = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/p0/check`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        setCheckP0(response.data.data);
      } else {
        // showAlert("Đã có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (error) {
      // console.error("error", error.message);
      // showAlert("Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyCall = () => {
    if (!sdt_khancap) {
      Alert.alert("PMC Thông báo", "Không có số điện thoại khẩn cấp!", [{ text: "Xác nhận" }]);
      return;
    }
    setIsLoading(true);
    const phoneUrl = `tel:${sdt_khancap}`;
    Linking.openURL(phoneUrl)
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert("PMC Thông báo", "Không thể thực hiện cuộc gọi!");
      });
  };

  const showAlert = (message) => {
    Alert.alert("PMC Thông báo", message, [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xác nhận", onPress: () => navigation.navigate("Profile") },
    ]);
  };

  return (
    <ImageBackground source={require("../../assets/bg_new.png")} resizeMode="stretch" style={{ flex: 1, width: "100%" }}>
      <View style={styles.container}>
        <View style={styles.content}>
          {user?.ent_duan?.Logo ? (
            <Image source={{ uri: user?.ent_duan?.Logo }} resizeMode="contain" style={{ height: adjust(70), width: adjust(180) }} />
          ) : (
            <Image source={require("../../assets/pmc_logo.png")} resizeMode="contain" style={{ height: adjust(80), width: adjust(200) }} />
          )}
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(20),
              color: "white",
              fontWeight: "700",
              textTransform: "uppercase",
              paddingTop: 8,
            }}
          >
            Dự án: {user?.ent_duan?.Duan}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              color: "white",
              fontSize: adjust(16),
              marginTop: 10,
            }}
            numberOfLines={1}
          >
            Tài khoản: {user?.UserName}
          </Text>
          {(user?.ent_chucvu?.Role === 5 ||
            // (user?.ent_chucvu?.Role === 1 && user?.arr_Duan != null && user?.arr_Duan != "" && user?.arr_Duan != undefined)) && (
            (user?.ent_chucvu?.Role === 1 && arrDuan && arrDuan?.length > 1)) && (
            <View style={{ flexDirection: "row" }}>
              <SelectDropdown
                data={duan.map((item) => item.Duan)} // Dữ liệu dự án
                style={{ alignItems: "center", height: "auto" }}
                buttonStyle={styles.select}
                dropdownStyle={styles.dropdown}
                defaultButtonText={user?.ent_duan?.Duan || "Chọn dự án"}
                buttonTextStyle={styles.customText}
                searchable={true}
                onSelect={(selectedItem, index) => {
                  const selectedProject = duan[index]?.ID_Duan;
                  funcHandleDuan(selectedProject);
                }}
                renderDropdownIcon={(isOpened) => (
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} color={"#637381"} size={18} style={{ marginRight: 10 }} />
                )}
                dropdownIconPosition={"right"}
                buttonTextAfterSelection={(selectedItem, index) => (
                  <View
                    key={index}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text allowFontScaling={false} style={styles.selectedText}>
                      {selectedItem || "Chọn dự án"}{" "}
                    </Text>
                  </View>
                )}
                renderCustomizedRowChild={(item, index) => (
                  <View key={index} style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </View>
                )}
                search
              />

              {(user?.ent_chucvu?.Role === 5 || user?.ent_chucvu?.Role === 10) && (
                <TouchableOpacity style={styles.resetButton} onPress={() => funcHandleClearDuan("clear")}>
                  <Text allowFontScaling={false} style={styles.resetButtonText}>
                    Tổng quan dự án
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View
          style={[
            styles.content,
            {
              width: "100%",
              alignContent: "center",
            },
          ]}
        >
          <FlatList
            style={{
              width: "100%",
              paddingHorizontal: 20,
            }}
            numColumns={2}
            data={(() => {
              let baseData;

              switch (user?.ent_chucvu?.Role) {
                case 1:
                  baseData = dataGD;
                  break;
                case 2:
                  baseData = dataKST;
                  break;
                case 3:
                  baseData = dataDanhMuc;
                  break;
                case 5:
                  baseData = dataBQTKhoi;
                  break;
                case 6:
                  baseData = dataBQTDuAn;
                  break;
                default:
                  baseData = []; // hoặc null nếu muốn
              }

              if (!checkP0) {
                baseData = baseData?.filter((item) => item.id !== 7);
              }

              const currentDate = new Date();
              const targetDate = new Date("2025-01-01");

              if (currentDate > targetDate) {
                baseData = baseData?.map((item) => ({
                  ...item,
                  status: null,
                }));
              }

              return baseData;
            })()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
          />
        </View>
        <TouchableOpacity
          onPress={() => handleEmergencyCall()}
          style={{
            position: "absolute", // Đặt vị trí tuyệt đối
            bottom: 10,
            right: 10,
            zIndex: 9999,
            elevation: 9999,
            backgroundColor: "white",
            borderRadius: 50, // Bo tròn background
            padding: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <Image
              source={require("../../assets/icons/ic_emergency_call_58.png")}
              style={{
                width: adjust(50) * 0.8,
                height: adjust(50) * 0.8,
                resizeMode: "contain",
                transform: [{ scaleX: -1 }],
              }}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "column",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: "white",
              fontSize: adjust(16),
            }}
          >
            Người Giám sát chỉ thực hiện công việc Checklist, Tra cứu và Đổi mật khẩu.
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              color: "white",
              fontSize: adjust(16),
            }}
          >
            Giám đốc Tòa nhà toàn quyền sử dụng.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  select: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginTop: adjust(10),
  },
  customText: {
    fontSize: 16,
    color: "#4a4a4a",
  },
  dropdown: {
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 5,
    height: "auto",
  },
  selectedText: {
    fontSize: 16,
    color: "#4a4a4a",
    textAlign: "center",
  },
  dropdownItem: {
    paddingHorizontal: 10,
    height: "auto",
  },
  dropdownItemText: {
    height: "auto",
    fontSize: 16,
    color: "#333",
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  searchIcon: {
    marginLeft: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginLeft: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: adjust(14),
    fontWeight: "500",
    marginLeft: 5,
  },
});

//make this component available to the app
export default HomeScreen;
