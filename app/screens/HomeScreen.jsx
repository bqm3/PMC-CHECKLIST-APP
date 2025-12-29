import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, ImageBackground, Image, Platform, Alert, Linking, TouchableOpacity } from "react-native";
import * as Device from "expo-device";
import { useDispatch, useSelector } from "react-redux";
import {
  ent_calv_get,
  ent_hangmuc_get,
  ent_khuvuc_get,
  ent_tang_get,
  ent_toanha_get,
  ent_khoicv_get,
  ent_get_sdt_KhanCap,
} from "../redux/actions/entActions";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { BASE_URL } from "../constants/config";
import ItemHome from "../components/Item/ItemHome";
import adjust from "../adjust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../redux/actions/authActions";
import ExpoTokenContext from "../context/ExpoTokenContext";
import { validatePassword } from "../utils/util";
import { MenuIcons } from '../components/MenuIcons';

// ================== Constants ==================
const MENU_ITEMS = {
  CHECKLIST: { id: 1, path: "Thực hiện Checklist", icon: MenuIcons.checklist, },
  LOOKUP: { id: 2, path: "Tra cứu", icon: MenuIcons.lookup, },
  RECHECK: { id: 3, path: "Checklist Lại", icon: MenuIcons.recheck, },
  INCIDENT: { id: 4, path: "Xử lý sự cố", icon: MenuIcons.incident, title: "Xử lý sự cố" },
  REPORT: {
    id: 5,
    path: "Báo cáo",
    icon: MenuIcons.report,
    isMenu: true,
    children: {
      HSSE: { id: 6, path: "Báo cáo HSSE", icon: MenuIcons.hsse, title: "HSSE" },
      S0: { id: 7, path: "Báo cáo S0", icon: MenuIcons.s0, title: "S0", requireP0: true },
      AN_CONGCU: { id: 9, path: "an_ninh_cong_cu", icon: MenuIcons.security_tool, title: "An ninh công cụ" },
      AN_DAOTAO: { id: 10, path: "an_ninh_dao_tao", icon: MenuIcons.training, title: "Đào tạo giao ca" },
      // AN_VIPHAm: { id: 11, path: "an_ninh_vi_pham", icon: MenuIcons.violation, title: "An ninh vi phạm" },
    },
  },
  CONSTRUCTION: { id: 8, path: "Đăng ký thi công", icon: MenuIcons.construction, },
};

const ROLE_MENUS = {
  1: [MENU_ITEMS.INCIDENT, MENU_ITEMS.LOOKUP, MENU_ITEMS.REPORT, MENU_ITEMS.CONSTRUCTION],
  2: [MENU_ITEMS.CHECKLIST, MENU_ITEMS.LOOKUP, MENU_ITEMS.RECHECK, MENU_ITEMS.INCIDENT, MENU_ITEMS.REPORT, MENU_ITEMS.CONSTRUCTION],
  3: [MENU_ITEMS.CHECKLIST, MENU_ITEMS.LOOKUP, MENU_ITEMS.RECHECK, MENU_ITEMS.INCIDENT, MENU_ITEMS.REPORT, MENU_ITEMS.CONSTRUCTION],
  5: [MENU_ITEMS.LOOKUP, MENU_ITEMS.INCIDENT, MENU_ITEMS.REPORT, MENU_ITEMS.CONSTRUCTION],
  6: [MENU_ITEMS.LOOKUP, MENU_ITEMS.REPORT, MENU_ITEMS.CONSTRUCTION],
  10: [MENU_ITEMS.INCIDENT, MENU_ITEMS.LOOKUP, MENU_ITEMS.REPORT, MENU_ITEMS.CONSTRUCTION],
};

// ================== Notification Config ==================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ================== Helper Functions ==================
const handleRegistrationError = (message) => {
  Alert.alert("Lỗi", message);
};

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    handleRegistrationError("Phải sử dụng thiết bị thật");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Thông báo", "Bạn đã từ chối nhận thông báo. Hãy bật thông báo trong Cài đặt để tiếp tục.", [
      { text: "Mở cài đặt", onPress: () => Linking.openSettings() },
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
    const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return pushTokenString;
  } catch (e) {
    handleRegistrationError(`${e}`);
  }
}

// ================== Custom Hooks ==================
const useInitializeData = (dispatch, authToken, refreshScreen) => {
  useEffect(() => {
    const initAll = async () => {
      await Promise.all([
        dispatch(ent_khuvuc_get()),
        dispatch(ent_hangmuc_get()),
        dispatch(ent_toanha_get()),
        dispatch(ent_khoicv_get()),
        dispatch(ent_tang_get()),
        dispatch(ent_calv_get()),
        dispatch(ent_get_sdt_KhanCap()),
      ]);
    };
    initAll();
  }, [dispatch, refreshScreen]);
};

const useProjectData = (authToken) => {
  const [duan, setDuan] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ent_duan/thong-tin-du-an`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setDuan(response.data.data);
      } catch (error) {
        console.error("Fetch projects error:", error);
      }
    };
    fetchProjects();
  }, [authToken]);

  return duan;
};

const useP0Check = (authToken, setIsLoading) => {
  const [checkP0, setCheckP0] = useState(false);

  useEffect(() => {
    const checkP0Status = async () => {
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
        }
      } catch (error) {
        console.error("P0 check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkP0Status();
  }, [authToken]);

  return checkP0;
};

// ================== Main Component ==================
const HomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { setIsLoading, setColorLoading, fetchNotifications } = route.params;
  const { user, authToken, passwordCore } = useSelector((state) => state.authReducer);
  const { sdt_khancap } = useSelector((state) => state.entReducer);
  const { setToken } = React.useContext(ExpoTokenContext);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [refreshScreen, setRefreshScreen] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  // Custom hooks
  useInitializeData(dispatch, authToken, refreshScreen);
  const duan = useProjectData(authToken);
  const checkP0 = useP0Check(authToken, setIsLoading);

  // ================== Menu Data ==================
  const menuData = useMemo(() => {
    let baseData = ROLE_MENUS[user?.ent_chucvu?.Role] || [];

    const currentDate = new Date();
    const targetDate = new Date("2025-01-01");

    if (currentDate > targetDate) {
      baseData = baseData.map((item) => ({ ...item, status: null }));
    }

    return baseData;
  }, [user?.ent_chucvu?.Role]);

  // ================== Show Multi-Project Selector ==================
  const showProjectSelector = useMemo(() => {
    const role = user?.ent_chucvu?.Role;
    const hasMultipleProjects = user?.arr_Duan && user.arr_Duan.length > 1;
    return role === 5 || role === 10 || (role === 1 && hasMultipleProjects);
  }, [user]);

  // ================== Effects ==================
  useEffect(() => {
    const checkPassword = async () => {
      const password = await AsyncStorage.getItem("Password");
      if (password && !validatePassword(password)) {
        showAlert("Mật khẩu của bạn không đủ mạnh. Vui lòng cập nhật mật khẩu mới với độ bảo mật cao hơn.");
      }
    };
    checkPassword();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [refreshScreen]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // Push notifications
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => console.error("Push token error:", error));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Register device token
  useEffect(() => {
    const registerDevice = async () => {
      if (!expoPushToken) return;

      try {
        await axios.post(
          `${BASE_URL}/ent_user/device-token`,
          {
            deviceToken: expoPushToken,
            deviceName: Device.modelName,
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setToken(expoPushToken);
      } catch (error) {
        console.error("Device registration error:", error);
      }
    };
    registerDevice();
  }, [authToken, expoPushToken]);

  // ================== Handlers ==================
  const handleProjectChange = async (ID_Duan) => {
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

      if (response.status === 200) {
        const UserName = await AsyncStorage.getItem("UserName");
        const Password = await AsyncStorage.getItem("Password");
        dispatch(login(UserName, Password));
        Alert.alert("Thông báo", "Cập nhật dự án thành công!");
        setRefreshScreen((prev) => !prev);
      }
    } catch (error) {
      Alert.alert("Thông báo", "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearProject = async () => {
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

      if (response.status === 200) {
        const UserName = await AsyncStorage.getItem("UserName");
        const Password = await AsyncStorage.getItem("Password");
        dispatch(login(UserName, Password));
        Alert.alert("Thông báo", "Cập nhật dự án thành công!");
        setRefreshScreen((prev) => !prev);
      }
    } catch (error) {
      Alert.alert("Thông báo", "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyCall = () => {
    if (!sdt_khancap) {
      Alert.alert("Thông báo", "Không có số điện thoại khẩn cấp!");
      return;
    }

    setIsLoading(true);
    const phoneUrl = `tel:${sdt_khancap}`;
    Linking.openURL(phoneUrl)
      .then(() => {
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch(() => {
        setIsLoading(false);
        Alert.alert("Thông báo", "Không thể thực hiện cuộc gọi!");
      });
  };

  const showAlert = (message) => {
    Alert.alert("Thông báo", message, [
      { text: "Hủy", style: "cancel" },
      { text: "Xác nhận", onPress: () => navigation.navigate("Profile") },
    ]);
  };

  // ================== Render ==================
  const renderItem = useCallback(
    ({ item, index }) => (
      <ItemHome item={item} index={index} roleUser={user?.ent_chucvu?.Role} passwordCore={passwordCore} showAlert={showAlert} checkP0={checkP0} />
    ),
    [passwordCore, user?.ent_chucvu?.Role, checkP0]
  );

  return (
    <ImageBackground source={require("../../assets/bg_new.png")} resizeMode="stretch" style={styles.background}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          {user?.ent_duan?.Logo ? (
            <Image source={{ uri: user.ent_duan.Logo }} resizeMode="contain" style={styles.logo} />
          ) : (
            <Image source={require("../../assets/pmc_logo.png")} resizeMode="contain" style={styles.logoDefault} />
          )}

          {user?.ent_duan?.Duan && (
            <Text allowFontScaling={false} style={styles.projectName}>
              Dự án: {user.ent_duan.Duan}
            </Text>
          )}

          <Text allowFontScaling={false} style={styles.accountInfo} numberOfLines={1}>
            Tài khoản: {user?.UserName} - {user?.ent_chucvu?.Chucvu}
          </Text>

          {/* Project Selector */}
          {showProjectSelector && (
            <View style={styles.projectSelectorContainer}>
              <SelectDropdown
                data={duan.map((item) => item.Duan)}
                buttonStyle={styles.select}
                dropdownStyle={styles.dropdown}
                defaultButtonText={user?.ent_duan?.Duan || "Chọn dự án"}
                buttonTextStyle={styles.selectText}
                searchable={true}
                onSelect={(selectedItem, index) => {
                  const selectedProject = duan[index]?.ID_Duan;
                  handleProjectChange(selectedProject);
                }}
                renderDropdownIcon={(isOpened) => (
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} color="#637381" size={18} style={styles.dropdownIcon} />
                )}
                dropdownIconPosition="right"
                buttonTextAfterSelection={(selectedItem) => (
                  <Text allowFontScaling={false} style={styles.selectText}>
                    {selectedItem || "Chọn dự án"}
                  </Text>
                )}
                renderCustomizedRowChild={(item, index) => (
                  <View key={index} style={styles.dropdownItem}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.dropdownItemText}>
                      {item}
                    </Text>
                  </View>
                )}
              />

              {(user?.ent_chucvu?.Role === 5 || user?.ent_chucvu?.Role === 10) && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClearProject}>
                  <Text allowFontScaling={false} style={styles.clearButtonText}>
                    Tổng quan dự án
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Menu Grid */}
        <View style={styles.menuContainer}>
          <FlatList
            style={styles.menuList}
            numColumns={2}
            data={menuData}
            extraData={passwordCore}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.menuContent}
            columnWrapperStyle={styles.columnWrapper}
            // showsVerticalScrollIndicator={false}
            // showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Emergency Call Button */}
        <TouchableOpacity onPress={handleEmergencyCall} style={styles.emergencyButton}>
          <Image source={require("../../assets/icons/ic_emergency_call_58.png")} style={styles.emergencyIcon} />
        </TouchableOpacity>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text allowFontScaling={false} style={styles.footerText}>
            Người Giám sát chỉ thực hiện công việc Checklist, Tra cứu và Đổi mật khẩu.
          </Text>
          <Text allowFontScaling={false} style={styles.footerText}>
            Giám đốc Tòa nhà toàn quyền sử dụng.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// ================== Styles ==================
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingBottom: 40,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    height: adjust(70),
    width: adjust(180),
  },
  logoDefault: {
    height: adjust(80),
    width: adjust(200),
  },
  projectName: {
    fontSize: adjust(20),
    color: "white",
    fontWeight: "700",
    textTransform: "uppercase",
    paddingTop: 8,
  },
  accountInfo: {
    color: "white",
    fontSize: adjust(16),
    marginTop: 10,
  },
  projectSelectorContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  select: {
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  selectText: {
    fontSize: 16,
    color: "#4a4a4a",
  },
  dropdown: {
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 5,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownItem: {
    height: 22 * 2 + 20, // = 64
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    includeFontPadding: false,
  },
  clearButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: adjust(14),
    fontWeight: "500",
  },
  menuContainer: {
    width: "100%",
    alignItems: "center",
  },
  menuList: {
    width: "100%",
    paddingHorizontal: 20,
  },
  menuContent: {
    gap: 10,
  },
  columnWrapper: {
    gap: 10,
  },
  separator: {
    // height: 10,
  },
  emergencyButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 9999,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyIcon: {
    width: adjust(50) * 0.8,
    height: adjust(50) * 0.8,
    resizeMode: "contain",
    transform: [{ scaleX: -1 }],
  },
  footer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  footerText: {
    color: "white",
    fontSize: adjust(16),
    marginBottom: 5,
  },
});

export default HomeScreen;
