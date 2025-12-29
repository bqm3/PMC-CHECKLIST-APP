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
import { ANDaoTao, ANDaoTaoGiaoCaForm, ANCongCu } from "../screens/Anninh";
import HomeScreen from "../screens/HomeScreen.jsx";
import Profile from "../screens/Profile.jsx";
import axios from "axios";
import { BASE_URL } from "../constants/config.js";

const Stack = createNativeStackNavigator();

// Component tái sử dụng cho headerLeft
const BackButton = ({ navigation }) => (
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

// Component tái sử dụng cho headerTitle
const HeaderTitle = ({ title }) => (
  <Text
    allowFontScaling={false}
    style={{
      fontSize: adjust(20),
      fontWeight: "700",
      color: "white",
    }}
  >
    {title}
  </Text>
);

// Component tái sử dụng cho Chevron Back Button
const ChevronBackButton = ({ navigation }) => (
  <TouchableOpacity onPressIn={() => navigation.goBack()}>
    {Platform.OS === "ios" && <Ionicons name="chevron-back" size={28} color="white" />}
  </TouchableOpacity>
);

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

const EmergencyCallButton = ({ sdt_khancap }) => (
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

let gsetIsLoading = null;
let gsetColorLoading = null;

const handleEmergencyCall = (sdt_khancap) => {
  if (!sdt_khancap) {
    Alert.alert("Thông báo", "Không có số điện thoại khẩn cấp!", [{ text: "Xác nhận" }]);
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
      Alert.alert("Thông báo", "Không thể thực hiện cuộc gọi!");
    });
};

// Định nghĩa danh sách screens
const screenConfigs = [
  {
    name: "Trang chính",
    component: HomeScreen,
    customOptions: (navigation, route, { setIsLoading, setColorLoading, fetchNotifications, unreadCount }) => ({
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.bg_button,
      },
      headerBackTitleVisible: false,
      headerTitle: () => <HeaderTitle title="Checklist" />,
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
    }),
    initialParams: { setIsLoading: null, setColorLoading: null, fetchNotifications: null },
  },
  { name: "Chi tiết checklist ca", component: DetailCheckListCa, title: "Chi tiết checklist ca" },
  { name: "Scan khu vực", component: ScanKhuVuc, title: "Khu vực checklist" },
  { name: "Scan hạng mục", component: ScanHangMuc, title: "Hạng mục không quét QrCode" },
  { name: "Profile", component: Profile, title: "Thông tin cá nhân" },
  { name: "Thực hiện Checklist", component: ThucHienChecklist, title: "Thực hiện Checklist", hasEmergencyCall: true },
  { name: "Checklist Lại", component: ThucHienChecklistLai, title: "Checklist Lại", hasEmergencyCall: true },
  { name: "Báo cáo chỉ số", component: DanhMucBaoCaoChiSo, title: "Báo cáo chỉ số" },
  { name: "Thực hiện hạng mục", component: ThucHienHangmuc, title: "Hạng mục theo khu vực", hasEmergencyCall: true },
  { name: "Hạng mục chưa checklist", component: NotHangMuc, title: "Hạng mục chưa checklist" },
  { name: "Thực hiện hạng mục lại", component: ThucHienHangmucLai, title: "Hạng mục theo khu vực lại", hasEmergencyCall: true },
  {
    name: "Thực hiện khu vực",
    component: ThucHienKhuvuc,
    title: "Khu vực",
    hasEmergencyCall: true,
    customHeaderLeft: true,
  },
  {
    name: "Khu vực chưa checklist",
    component: NotKhuVuc,
    title: "Khu vực chưa checklist",
    customHeaderLeft: true,
  },
  {
    name: "Tổng khu vực chưa checklist",
    component: NotKhuVucTracuuCa,
    title: "Khu vực chưa checklist",
    customHeaderLeft: true,
  },
  {
    name: "Tổng hạng mục chưa checklist",
    component: NotHangMucTracuuCa,
    title: "Hạng mục chưa checklist",
    customHeaderLeft: true,
  },
  {
    name: "Tổng checklist chưa checklist",
    component: NotCheckListTracuuCa,
    title: "Checklist chưa checklist",
    customHeaderLeft: true,
  },
  { name: "Thực hiện khu vực lại", component: ThucHienKhuvucLai, title: "Khu vực lại", hasEmergencyCall: true },
  { name: "Thực hiện sự cố ngoài", component: ThuchienSucongoai, title: "Sự cố ngoài", hasEmergencyCall: true },
  {
    name: "Báo cáo chỉ số tháng năm",
    component: BaoCaoChiSoTheoNamThang,
    dynamicTitle: (route) => `Báo cáo ${route?.params?.data?.monthYear}`,
  },
  { name: "Hạng mục chỉ số", component: DanhmucHangMucChiSo, title: "Hạng mục chỉ số" },
  { name: "Xử lý sự cố", component: XulySuco, title: "Xử lý sự cố", hasEmergencyCall: true },
  { name: "Chi tiết sự cố", component: DetailSucongoai, title: "Chi tiết sự cố", hasEmergencyCall: true },
  { name: "Thay đổi trạng thái", component: ChangeTinhTrangSuCo, title: "Thay đổi trạng thái", hasEmergencyCall: true },
  { name: "Quản lý người dùng", component: DanhmucUserScreen, title: "Quản lý người dùng" },
  { name: "Danh mục dự án", component: DanhmucDuanScreen, title: "Danh mục dự án" },
  { name: "Tra cứu", component: DanhmucTracuuVsThongke, title: "Thống kê và tra cứu", hasInitialParams: true },
  { name: "Chi tiết Checklist", component: DetailChecklist, title: "Chi tiết Checklist", hasEmergencyCall: true },
  { name: "Checklist chưa kiểm tra", component: NotCheckList, title: "Checklist chưa kiểm tra" },
  { name: "Chi tiết Checklist lại", component: DetailChecklistLai, title: "Chi tiết Checklist lại", hasEmergencyCall: true },
  { name: "Báo cáo HSSE", component: DanhMucBaoCaoHSSE, title: "Dữ liệu HSSE" },
  {
    name: "Tạo báo cáo HSSE",
    component: HSSENewDetail,
    title: "Tạo báo cáo HSSE",
    customBackNavigation: "Báo cáo HSSE",
  },
  {
    name: "Chi tiết dữ liệu HSSE",
    component: HSSENewDetail,
    dynamicTitle: (route) => `Chi tiết ngày ${route?.params?.data?.Ngay_ghi_nhan}`,
  },
  { name: "Báo cáo S0", component: DanhMucBaoCaoP0, title: "Dữ liệu S0", hasInitialParams: true },
  {
    name: "Tạo báo cáo S0",
    component: TaoBaoCaoP0,
    title: "Tạo báo cáo S0",
    hasInitialParams: true,
    customBackNavigation: "Báo cáo S0",
  },
  {
    name: "Chi tiết dữ liệu S0",
    component: DetailP0,
    dynamicTitle: (route) => `Chi tiết ngày ${route?.params?.data?.Ngaybc}`,
    hasInitialParams: true,
  },
  { name: "Đăng ký thi công", component: ListDKTC, title: "Danh sách đăng ký thi công", hasInitialParams: true },
  {
    name: "ChiTietDKTC",
    component: ChiTietDKTC,
    dynamicTitle: (route) => route?.params?.headerTitle,
    hasInitialParams: true,
  },
  { name: "NotificationScreen", component: NotificationScreen, title: "Thông báo", hasInitialParams: true },
  { name: "DetailNotiScreen", component: DetailNotiScreen, title: "Chi tiết thông báo", hasInitialParams: true },
  { name: "an_ninh_dao_tao", component: ANDaoTao, title: "Đào tạo giao ca", hasInitialParams: true },
  { name: "an_ninh_dao_tao_form", component: ANDaoTaoGiaoCaForm, title: "Đào tạo giao ca", hasInitialParams: true },
  { name: "an_ninh_cong_cu", component: ANCongCu, title: "An ninh công cụ", hasInitialParams: true }
];

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
        {screenConfigs.map((config) => {
          const getOptions = ({ route, navigation }) => {
            // Nếu có customOptions, sử dụng nó
            if (config.customOptions) {
              return config.customOptions(navigation, route, {
                setIsLoading,
                setColorLoading,
                fetchNotifications,
                unreadCount,
              });
            }

            // Xây dựng title
            const title = config.dynamicTitle ? config.dynamicTitle(route) : config.title || config.name;

            // Xây dựng headerLeft
            let headerLeft;
            if (config.customBackNavigation) {
              headerLeft = () => (
                <TouchableOpacity onPressIn={() => navigation.navigate(config.customBackNavigation, { isReload: true })}>
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
            } else if (config.customHeaderLeft) {
              headerLeft = () => <ChevronBackButton navigation={navigation} />;
            } else {
              headerLeft = () => <BackButton navigation={navigation} />;
            }

            // Xây dựng options
            const options = {
              headerShown: true,
              headerTitle: () => <HeaderTitle title={title} />,
              headerLeft,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
              gestureEnabled: config.gestureEnabled !== false,
            };

            // Thêm emergency call button nếu cần
            if (config.hasEmergencyCall) {
              options.headerRight = () => <EmergencyCallButton sdt_khancap={sdt_khancap} />;
            }

            return options;
          };

          // Xây dựng initialParams
          let initialParams = config.initialParams || {};
          if (config.hasInitialParams) {
            initialParams = {
              setIsLoading,
              setColorLoading,
              ...initialParams,
            };
          }
          if (config.name === "Trang chính") {
            initialParams = {
              setIsLoading,
              setColorLoading,
              fetchNotifications,
            };
          }

          return (
            <Stack.Screen
              key={config.name}
              name={config.name}
              component={config.component}
              initialParams={initialParams}
              lazy={false}
              options={getOptions}
            />
          );
        })}
      </Stack.Navigator>
      <LoadingOverlay visible={isLoading} colorLoading={colorLoading} />
    </>
  );
};

export default HomeStack;