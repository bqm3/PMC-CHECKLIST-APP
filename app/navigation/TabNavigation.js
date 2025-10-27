import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Pressable,
  View,
  Linking,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
} from "react-native";
import { COLORS } from "../constants/theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import adjust from "../adjust";
import { useSelector } from "react-redux";

import { ThucHienChecklist, DetailChecklist, ThucHienHangmuc, ThucHienKhuvuc } from "../screens/Checklist";
import { ThucHienChecklistLai, ThucHienKhuvucLai, ThucHienHangmucLai, DetailChecklistLai } from "../screens/ChecklistLai";
import { DanhmucUserScreen, DanhmucDuanScreen } from "../screens/PSH";
import { DetailSucongoai, ThuchienSucongoai, XulySuco, ChangeTinhTrangSuCo } from "../screens/SuCo";

import {
  DanhmucChiTietTracuu,
  DanhmucThongKe,
  DanhmucTracuuVsThongke,
  NotKhuVuc,
  NotHangMuc,
  NotCheckList,
  DetailCheckListCa,
  ScanHangMuc,
  ScanKhuVuc,
  NotKhuVucTracuuCa,
  NotHangMucTracuuCa,
  NotCheckListTracuuCa,
} from "../screens/TraCuuThongKe";
import { BaoCaoChiSoTheoNamThang, DanhMucBaoCaoChiSo, DanhmucHangMucChiSo } from "../screens/Baocaochiso";

import { DanhMucBaoCaoHSSE, TaoBaoCaoHSSE, DetailHSSE, HSSENewDetail } from "../screens/HSSE";
import { DanhMucBaoCaoP0, TaoBaoCaoP0, DetailP0 } from "../screens/P0";
import { ListDKTC, ChiTietDKTC } from "../screens/Dangkythicong";
import { NotificationScreen, DetailNotiScreen } from "../screens/Noti";
import HomeScreen from "../screens/HomeScreen.jsx";
import Profile from "../screens/Profile.jsx";
import axios from "axios";
import { BASE_URL } from "../constants/config.js";

const Stack = createNativeStackNavigator();

const headerLeft = (navigation) => {
  return (
    <TouchableOpacity onPressIn={() => navigation.goBack()}>
      {Platform.OS === "ios" && (
        <Image
          source={require("../../assets/icons/ic_button_back.png")}
          resizeMode="contain"
          style={{
            height: adjust(22),
            width: adjust(22),
            tintColor: "white",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const useCallState = () => {
  const [isLoading, setIsLoading] = useState(false);
  return { isLoading, setIsLoading };
};

const useColorState = () => {
  const [colorLoading, setColorLoading] = useState(COLORS.bg_button);
  return { colorLoading, setColorLoading };
};

const LoadingOverlay = ({ visible, colorLoading }) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
          padding: adjust(20),
          borderRadius: adjust(10),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colorLoading} />
      </View>
    </View>
  );
};

const buttonCall = (sdt_khancap) => {
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        handleEmergencyCall(sdt_khancap);
      }}
    >
      <Image
        source={require("../../assets/icons/ic_emergency_call_58.png")}
        style={{
          width: adjust(25),
          height: adjust(25),
          transform: [{ scaleX: -1 }],
        }}
      />
    </TouchableWithoutFeedback>
  );
};

let gsetIsLoading = null;
let gsetColorLoading = null;

const handleEmergencyCall = (sdt_khancap) => {
  if (!sdt_khancap) {
    Alert.alert("PMC Thông báo", "Không có số điện thoại khẩn cấp!", [{ text: "Xác nhận" }]);
    return;
  }

  if (gsetIsLoading) {
    gsetIsLoading(true);
  }

  const phoneUrl = `tel:${sdt_khancap}`;
  Linking.openURL(phoneUrl)
    .then(() => {
      setTimeout(() => {
        if (gsetIsLoading) {
          gsetIsLoading(false);
        }
      }, 2000);
    })
    .catch((error) => {
      if (gsetIsLoading) {
        gsetIsLoading(false);
      }
      Alert.alert("PMC Thông báo", "Không thể thực hiện cuộc gọi!");
    });
};

const HomeStack = ({ navigation }) => {
  const { sdt_khancap } = useSelector((state) => state.entReducer);
  const { authToken } = useSelector((state) => state.authReducer);
  const { isLoading, setIsLoading } = useCallState();
  const { colorLoading, setColorLoading } = useColorState();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ent_noti`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      setUnreadCount(0);
    }
  };

  gsetIsLoading = setIsLoading;
  gsetColorLoading = setColorLoading;
  return (
    <>
      <Stack.Navigator
        initialRouteName="Trang chính"
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Trang chính"
          component={HomeScreen}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
            fetchNotifications: fetchNotifications,
          }}
          lazy={false}
          options={({ route, navigation, setIsLoading }) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Checklist
              </Text>
            ),
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity
                style={{
                  width: adjust(36),
                  height: adjust(36),
                }}
                onPressIn={() => {
                  navigation.navigate("NotificationScreen");
                }}
              >
                {/* Badge số lượng chưa đọc */}
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "red",
                      minWidth: adjust(18),
                      height: adjust(18),
                      borderRadius: adjust(9),
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 10,
                      paddingHorizontal: adjust(4),
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: adjust(10),
                        fontWeight: "bold",
                      }}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                )}
                <Image
                  source={require("../../assets/icons/ic_bell.png")}
                  style={{
                    width: adjust(36),
                    height: adjust(36),
                    tintColor: "white",
                  }}
                />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  width: adjust(36),
                  height: adjust(36),
                }}
                onPressIn={() => {
                  navigation.navigate("Profile");
                }}
              >
                <Image
                  source={require("../../assets/icons/ic_person.png")}
                  style={{
                    width: adjust(36),
                    height: adjust(36),
                    tintColor: "white",
                  }}
                />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Chi tiết checklist ca"
          component={DetailCheckListCa}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Chi tiết checklist ca
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Scan khu vực"
          component={ScanKhuVuc}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Khu vực checklist
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Scan hạng mục"
          component={ScanHangMuc}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Hạng mục không quét QrCode
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Thông tin cá nhân
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />
        <Stack.Screen
          name="Thực hiện Checklist"
          component={ThucHienChecklist}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Thực hiện Checklist
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Checklist Lại"
          component={ThucHienChecklistLai}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Checklist Lại
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />
        <Stack.Screen
          name="Báo cáo chỉ số"
          component={DanhMucBaoCaoChiSo}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Báo cáo chỉ số
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Thực hiện hạng mục"
          component={ThucHienHangmuc}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Hạng mục theo khu vực
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Hạng mục chưa checklist"
          component={NotHangMuc}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Hạng mục chưa checklist
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Thực hiện hạng mục lại"
          component={ThucHienHangmucLai}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Hạng mục theo khu vực lại
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Thực hiện khu vực"
          component={ThucHienKhuvuc}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,
            gestureEnabled: false,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20, // Adjust font size as needed
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Khu vực
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPressIn={() => {
                  navigation.goBack();
                }}
              >
                {Platform.OS === "ios" && <Ionicons name="chevron-back" size={28} color="white" />}
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button, // Replace with your color
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Khu vực chưa checklist"
          component={NotKhuVuc}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,
            gestureEnabled: false,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20, // Adjust font size as needed
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Khu vực chưa checklist
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPressIn={() => {
                  navigation.goBack();
                }}
              >
                {Platform.OS === "ios" && <Ionicons name="chevron-back" size={28} color="white" />}
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button, // Replace with your color
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Tổng khu vực chưa checklist"
          component={NotKhuVucTracuuCa}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,
            gestureEnabled: false,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20, // Adjust font size as needed
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Khu vực chưa checklist
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPressIn={() => {
                  navigation.goBack();
                }}
              >
                {Platform.OS === "ios" && <Ionicons name="chevron-back" size={28} color="white" />}
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button, // Replace with your color
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Tổng hạng mục chưa checklist"
          component={NotHangMucTracuuCa}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,
            gestureEnabled: false,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20, // Adjust font size as needed
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Hạng mục chưa checklist
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPressIn={() => {
                  navigation.goBack();
                }}
              >
                {Platform.OS === "ios" && <Ionicons name="chevron-back" size={28} color="white" />}
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button, // Replace with your color
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Tổng checklist chưa checklist"
          component={NotCheckListTracuuCa}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,
            gestureEnabled: false,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20, // Adjust font size as needed
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Checklist chưa checklist
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPressIn={() => {
                  navigation.goBack();
                }}
              >
                {Platform.OS === "ios" && <Ionicons name="chevron-back" size={28} color="white" />}
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button, // Replace with your color
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Thực hiện khu vực lại"
          component={ThucHienKhuvucLai}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Khu vực lại
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Thực hiện sự cố ngoài"
          component={ThuchienSucongoai}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Sự cố ngoài
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Báo cáo chỉ số tháng năm"
          component={BaoCaoChiSoTheoNamThang}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Báo cáo {route?.params?.data?.monthYear}
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Hạng mục chỉ số"
          component={DanhmucHangMucChiSo}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Hạng mục chỉ số
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Xử lý sự cố"
          component={XulySuco}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Xử lý sự cố
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Chi tiết sự cố"
          component={DetailSucongoai}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Chi tiết sự cố
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Thay đổi trạng thái"
          component={ChangeTinhTrangSuCo}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Thay đổi trạng thái
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Quản lý người dùng"
          component={DanhmucUserScreen}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Quản lý người dùng
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />
        <Stack.Screen
          name="Danh mục dự án"
          component={DanhmucDuanScreen}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Danh mục dự án
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Tra cứu"
          component={DanhmucTracuuVsThongke}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ navigation, route }) => ({
            headerShown: true,

            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Thống kê và tra cứu
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Chi tiết Checklist"
          component={DetailChecklist}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Chi tiết Checklist
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: true,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Checklist chưa kiểm tra"
          component={NotCheckList}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Checklist chưa kiểm tra
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Chi tiết Checklist lại"
          component={DetailChecklistLai}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Chi tiết Checklist lại
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
            headerRight: () => buttonCall(sdt_khancap),
          })}
        />

        <Stack.Screen
          name="Báo cáo HSSE"
          component={DanhMucBaoCaoHSSE}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Dữ liệu HSSE
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Tạo báo cáo HSSE"
          component={HSSENewDetail}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Tạo báo cáo HSSE
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPressIn={() => navigation.navigate("Báo cáo HSSE", { isReload: true })}>
                {Platform.OS === "ios" && (
                  <Image
                    source={require("../../assets/icons/ic_button_back.png")}
                    resizeMode="contain"
                    style={{
                      height: adjust(22),
                      width: adjust(22),
                      tintColor: "white",
                    }}
                  />
                )}
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Chi tiết dữ liệu HSSE"
          component={HSSENewDetail}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Chi tiết ngày {route?.params?.data?.Ngay_ghi_nhan}
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Báo cáo S0"
          component={DanhMucBaoCaoP0}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Dữ liệu S0
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Tạo báo cáo S0"
          component={TaoBaoCaoP0}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Tạo báo cáo S0
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPressIn={() => navigation.navigate("Báo cáo S0", { isReload: true })}>
                {Platform.OS === "ios" && (
                  <Image
                    source={require("../../assets/icons/ic_button_back.png")}
                    resizeMode="contain"
                    style={{
                      height: adjust(22),
                      width: adjust(22),
                      tintColor: "white",
                    }}
                  />
                )}
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Chi tiết dữ liệu S0"
          component={DetailP0}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Chi tiết ngày {route?.params?.data?.Ngaybc}
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="Đăng ký thi công"
          component={ListDKTC}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Danh sách đăng ký thi công
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="ChiTietDKTC"
          component={ChiTietDKTC}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {route?.params?.headerTitle}
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />

        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Thông báo
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />
        <Stack.Screen
          name="DetailNotiScreen"
          component={DetailNotiScreen}
          initialParams={{
            setIsLoading: setIsLoading,
            setColorLoading: setColorLoading,
          }}
          lazy={false}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(20),
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Chi tiết thông báo
              </Text>
            ),
            headerLeft: () => headerLeft(navigation),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLORS.bg_button,
            },
            headerBackTitleVisible: false,
          })}
        />
      </Stack.Navigator>
      <LoadingOverlay visible={isLoading} colorLoading={colorLoading} />
    </>
  );
};

export default HomeStack;
