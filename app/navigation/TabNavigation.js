import React, { useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, Platform, Alert, View, Linking, ActivityIndicator, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import adjust from "../adjust";
import { useSelector } from "react-redux";
import { useLoading } from "../context/LoadingContext";

import { ThucHienChecklist, DetailChecklist, ThucHienHangmuc, ThucHienKhuvuc } from "../screens/Checklist";
import { ThucHienChecklistLai, ThucHienKhuvucLai, ThucHienHangmucLai, DetailChecklistLai } from "../screens/ChecklistLai";
import { DanhmucUserScreen, DanhmucDuanScreen } from "../screens/PSH";
import { DetailSucongoai, ThuchienSucongoai, XulySuco, ChangeTinhTrangSuCo } from "../screens/SuCo";
import {
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
import { DanhMucBaoCaoHSSE, HSSENewDetail } from "../screens/HSSE";
import { DanhMucBaoCaoP0, TaoBaoCaoP0, DetailP0 } from "../screens/P0";
import { ListDKTC, ChiTietDKTC } from "../screens/Dangkythicong";
import { NotificationScreen, DetailNotiScreen } from "../screens/Noti";
import { ANDaoTao, ANDaoTaoGiaoCaForm, ANCongCu } from "../screens/Anninh";
import {
  BaotriThietbiScreen,
  TaoPhieuBaotriScreen,
  DanhSachThietbiScreen,
  ChiTietPhieuBaotriScreen,
  ThucHienBaotriThietbiScreen,
} from "../screens/BaotriThietbi";
import HomeScreen from "../screens/HomeScreen.jsx";
import Profile from "../screens/Profile.jsx";
import axios from "axios";
import { BASE_URL } from "../constants/config.js";

const Stack = createNativeStackNavigator();

// ─── Custom Header (100% React Native — không có native iOS button) ────────
const CustomHeader = ({
  title,
  navigation,
  leftType = "back", // 'back' | 'chevron' | 'profile' | 'customBack' | 'none'
  rightType = "none", // 'bell' | 'emergency' | 'none'
  sdt_khancap,
  unreadCount,
  customBackTarget,
}) => {
  const insets = useSafeAreaInsets();
  const { setIsLoading } = useLoading();

  const handleEmergencyCall = useCallback(
    (sdt) => {
      if (!sdt) {
        Alert.alert("Thông báo", "Không có số điện thoại khẩn cấp!", [{ text: "Xác nhận" }]);
        return;
      }
      setIsLoading(true);
      Linking.openURL(`tel:${sdt}`)
        .then(() =>
          setTimeout(() => {
            setIsLoading(false);
          }, 2000),
        )
        .catch(() => {
          setIsLoading(false);
          Alert.alert("Thông báo", "Không thể thực hiện cuộc gọi!");
        });
    },
    [setIsLoading],
  );

  const renderLeft = () => {
    switch (leftType) {
      case "none":
        return <View style={headerStyles.sideSlot} />;

      case "profile":
        return (
          <TouchableOpacity activeOpacity={1} onPressIn={() => navigation.navigate("Profile")} style={headerStyles.sideSlot}>
            <Image source={require("../../assets/icons/ic_person.png")} style={[headerStyles.icon, { tintColor: "white" }]} />
          </TouchableOpacity>
        );

      case "customBack":
        return (
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => navigation.navigate(customBackTarget, { isReload: true })}
            style={headerStyles.sideSlot}
          >
            <Ionicons name="chevron-back" size={adjust(28)} color="white" />
          </TouchableOpacity>
        );

      default: // 'back', 'chevron'
        return (
          <TouchableOpacity activeOpacity={1} onPressIn={() => navigation.goBack()} style={headerStyles.sideSlot}>
            <Ionicons name="chevron-back" size={adjust(28)} color="white" />
          </TouchableOpacity>
        );
    }
  };

  const renderRight = () => {
    switch (rightType) {
      case "emergency":
        return (
          <TouchableOpacity activeOpacity={1} onPressIn={() => handleEmergencyCall(sdt_khancap)} style={headerStyles.sideSlot}>
            <Image source={require("../../assets/icons/ic_emergency_call_58.png")} style={[headerStyles.icon, { transform: [{ scaleX: -1 }] }]} />
          </TouchableOpacity>
        );

      case "bell":
        return (
          <TouchableOpacity activeOpacity={1} onPressIn={() => navigation.navigate("NotificationScreen")} style={headerStyles.sideSlot}>
            {unreadCount > 0 && (
              <View style={headerStyles.badge}>
                <Text style={headerStyles.badgeText} allowFontScaling={false}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
            <Image source={require("../../assets/icons/ic_bell.png")} style={[headerStyles.icon, { tintColor: "white" }]} />
          </TouchableOpacity>
        );

      default:
        return <View style={headerStyles.sideSlot} />;
    }
  };

  return (
    <View style={[headerStyles.container, { paddingTop: Platform.OS === "android" ? insets.top + adjust(10) : insets.top }]}>
      {renderLeft()}
      <Text allowFontScaling={false} numberOfLines={1} style={headerStyles.title}>
        {title}
      </Text>
      {renderRight()}
    </View>
  );
};

const headerStyles = {
  container: {
    backgroundColor: COLORS.bg_button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: adjust(10),
    paddingHorizontal: adjust(8),
  },
  sideSlot: {
    width: adjust(36),
    height: adjust(36),
    alignItems: "center",
    justifyContent: "center",
    // QUAN TRỌNG: không có borderRadius, không có background
    // → không có hiệu ứng tròn iOS 26
    backgroundColor: "transparent",
  },
  icon: {
    width: adjust(26),
    height: adjust(26),
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: adjust(20),
    fontWeight: "700",
    color: "white",
    marginHorizontal: adjust(4),
  },
  badge: {
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
  },
  badgeText: {
    color: "white",
    fontSize: adjust(10),
    fontWeight: "bold",
  },
};

// ─── Loading Overlay ───────────────────────────────────────────────────────
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
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <ActivityIndicator size="large" color={colorLoading} />
    </View>
  );
};

// ─── Screen Configs ────────────────────────────────────────────────────────
// leftType:  'back' | 'chevron' | 'profile' | 'customBack' | 'none'
// rightType: 'bell' | 'emergency' | 'none'
const screenConfigs = [
  // ── Trang chính ──
  { name: "Trang chính", component: HomeScreen, title: "Checklist", leftType: "profile", rightType: "bell" },
  { name: "Profile", component: Profile, title: "Thông tin cá nhân", leftType: "back", rightType: "none" },

  // ── Checklist ──
  { name: "Chi tiết checklist ca", component: DetailCheckListCa, title: "Chi tiết checklist ca", leftType: "back", rightType: "none" },
  { name: "Scan khu vực", component: ScanKhuVuc, title: "Khu vực checklist", leftType: "back", rightType: "none" },
  { name: "Scan hạng mục", component: ScanHangMuc, title: "Hạng mục không quét QrCode", leftType: "back", rightType: "none" },
  { name: "Thực hiện Checklist", component: ThucHienChecklist, title: "Thực hiện Checklist", leftType: "back", rightType: "emergency" },
  { name: "Chi tiết Checklist", component: DetailChecklist, title: "Chi tiết Checklist", leftType: "back", rightType: "emergency" },
  { name: "Checklist chưa kiểm tra", component: NotCheckList, title: "Checklist chưa kiểm tra", leftType: "back", rightType: "none" },

  // ── Checklist Lại ──
  { name: "Checklist Lại", component: ThucHienChecklistLai, title: "Checklist Lại", leftType: "back", rightType: "emergency" },
  { name: "Chi tiết Checklist lại", component: DetailChecklistLai, title: "Chi tiết Checklist lại", leftType: "back", rightType: "emergency" },

  // ── Khu vực ──
  { name: "Thực hiện khu vực", component: ThucHienKhuvuc, title: "Khu vực", leftType: "chevron", rightType: "emergency" },
  { name: "Khu vực chưa checklist", component: NotKhuVuc, title: "Khu vực chưa checklist", leftType: "chevron", rightType: "none" },
  { name: "Tổng khu vực chưa checklist", component: NotKhuVucTracuuCa, title: "Khu vực chưa checklist", leftType: "chevron", rightType: "none" },
  { name: "Thực hiện khu vực lại", component: ThucHienKhuvucLai, title: "Khu vực lại", leftType: "back", rightType: "emergency" },

  // ── Hạng mục ──
  { name: "Thực hiện hạng mục", component: ThucHienHangmuc, title: "Hạng mục theo khu vực", leftType: "back", rightType: "emergency" },
  { name: "Hạng mục chưa checklist", component: NotHangMuc, title: "Hạng mục chưa checklist", leftType: "back", rightType: "none" },
  { name: "Thực hiện hạng mục lại", component: ThucHienHangmucLai, title: "Hạng mục theo khu vực lại", leftType: "back", rightType: "emergency" },
  { name: "Tổng hạng mục chưa checklist", component: NotHangMucTracuuCa, title: "Hạng mục chưa checklist", leftType: "chevron", rightType: "none" },
  {
    name: "Tổng checklist chưa checklist",
    component: NotCheckListTracuuCa,
    title: "Checklist chưa checklist",
    leftType: "chevron",
    rightType: "none",
  },

  // ── Sự cố ──
  { name: "Thực hiện sự cố ngoài", component: ThuchienSucongoai, title: "Sự cố ngoài", leftType: "back", rightType: "emergency" },
  { name: "Xử lý sự cố", component: XulySuco, title: "Xử lý sự cố", leftType: "back", rightType: "emergency" },
  { name: "Chi tiết sự cố", component: DetailSucongoai, title: "Chi tiết sự cố", leftType: "back", rightType: "emergency" },
  { name: "Thay đổi trạng thái", component: ChangeTinhTrangSuCo, title: "Thay đổi trạng thái", leftType: "back", rightType: "emergency" },

  // ── Báo cáo ──
  { name: "Báo cáo chỉ số", component: DanhMucBaoCaoChiSo, title: "Báo cáo chỉ số", leftType: "back", rightType: "none" },
  { name: "Hạng mục chỉ số", component: DanhmucHangMucChiSo, title: "Hạng mục chỉ số", leftType: "back", rightType: "none" },
  { name: "Báo cáo HSSE", component: DanhMucBaoCaoHSSE, title: "Dữ liệu HSSE", leftType: "back", rightType: "none" },
  {
    name: "Tạo báo cáo HSSE",
    component: HSSENewDetail,
    title: "Tạo báo cáo HSSE",
    leftType: "customBack",
    rightType: "none",
    customBackTarget: "Báo cáo HSSE",
  },
  { name: "Báo cáo S0", component: DanhMucBaoCaoP0, title: "Dữ liệu S0", leftType: "back", rightType: "none" },
  {
    name: "Tạo báo cáo S0",
    component: TaoBaoCaoP0,
    title: "Tạo báo cáo S0",
    leftType: "customBack",
    rightType: "none",
    customBackTarget: "Báo cáo S0",
  },

  // ── Tra cứu ──
  { name: "Tra cứu", component: DanhmucTracuuVsThongke, title: "Thống kê và tra cứu", leftType: "back", rightType: "none" },

  // ── PSH ──
  { name: "Quản lý người dùng", component: DanhmucUserScreen, title: "Quản lý người dùng", leftType: "back", rightType: "none" },
  { name: "Danh mục dự án", component: DanhmucDuanScreen, title: "Danh mục dự án", leftType: "back", rightType: "none" },

  // ── Đăng ký thi công ──
  { name: "Đăng ký thi công", component: ListDKTC, title: "Danh sách đăng ký thi công", leftType: "back", rightType: "none" },

  // ── Thông báo ──
  { name: "NotificationScreen", component: NotificationScreen, title: "Thông báo", leftType: "back", rightType: "none" },
  { name: "DetailNotiScreen", component: DetailNotiScreen, title: "Chi tiết thông báo", leftType: "back", rightType: "none" },

  // ── An ninh ──
  { name: "an_ninh_dao_tao", component: ANDaoTao, title: "Đào tạo giao ca", leftType: "back", rightType: "none" },
  {
    name: "an_ninh_dao_tao_form",
    component: ANDaoTaoGiaoCaForm,
    title: "Đào tạo giao ca",
    leftType: "back",
    rightType: "none",
  },
  { name: "an_ninh_cong_cu", component: ANCongCu, title: "An ninh công cụ", leftType: "back", rightType: "none" },

  // ── Bảo trì thiết bị ──
  { name: "bt_thiet_bi", component: BaotriThietbiScreen, title: "Bảo trì thiết bị", leftType: "back", rightType: "none" },
  { name: "tao_phieu_bt", component: TaoPhieuBaotriScreen, title: "Tạo phiếu bảo trì", leftType: "back", rightType: "none" },
  { name: "ds_thiet_bi", component: DanhSachThietbiScreen, title: "Danh sách thiết bị dự án", leftType: "back", rightType: "none" },
  { name: "chi_tiet_phieu_bt", component: ChiTietPhieuBaotriScreen, title: "Chi tiết phiếu bảo trì", leftType: "back", rightType: "none" },
  { name: "thuc_hien_bt_thiet_bi", component: ThucHienBaotriThietbiScreen, title: "Thực hiện bảo trì thiết bị", leftType: "back", rightType: "none" },

  // ── Dynamic title screens ──
  {
    name: "Báo cáo chỉ số tháng năm",
    component: BaoCaoChiSoTheoNamThang,
    dynamicTitle: (route) => `Báo cáo ${route?.params?.data?.monthYear}`,
    leftType: "back",
    rightType: "none",
  },
  {
    name: "Chi tiết dữ liệu HSSE",
    component: HSSENewDetail,
    dynamicTitle: (route) => `Chi tiết ngày ${route?.params?.data?.Ngay_ghi_nhan}`,
    leftType: "back",
    rightType: "none",
  },
  {
    name: "Chi tiết dữ liệu S0",
    component: DetailP0,
    dynamicTitle: (route) => `Chi tiết ngày ${route?.params?.data?.Ngaybc}`,
    leftType: "back",
    rightType: "none",
  },
  {
    name: "ChiTietDKTC",
    component: ChiTietDKTC,
    dynamicTitle: (route) => route?.params?.headerTitle,
    leftType: "back",
    rightType: "none",
  },
];

const HomeStack = () => {
  return <HomeStackContent />;
};

const HomeStackContent = () => {
  const { sdt_khancap } = useSelector((state) => state.entReducer);
  const { authToken } = useSelector((state) => state.authReducer);
  const { isLoading, colorLoading, setIsLoading, setColorLoading } = useLoading();
  const [unreadCount, setUnreadCount] = useState(0);

  // Set default loading color if not set
  React.useEffect(() => {
    setColorLoading(COLORS.bg_button);
  }, [setColorLoading]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ent_noti`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUnreadCount(res.data.unreadCount);
    } catch {
      setUnreadCount(0);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg_button} />
      <Stack.Navigator
        initialRouteName="Trang chính"
        screenOptions={{
          headerShown: false,
        }}
      >
        {screenConfigs.map((config) => {
          let initialParams = {};
          if (config.name === "Trang chính") {
            initialParams = { fetchNotifications };
          }

          return (
            <Stack.Screen
              key={config.name}
              name={config.name}
              component={config.component}
              initialParams={initialParams}
              options={({ route, navigation }) => {
                const title = config.dynamicTitle ? config.dynamicTitle(route) : config.title || config.name;

                return {
                  headerShown: true,
                  header: () => (
                    <CustomHeader
                      title={title}
                      navigation={navigation}
                      leftType={config.leftType || "back"}
                      rightType={config.rightType || "none"}
                      sdt_khancap={sdt_khancap}
                      unreadCount={unreadCount}
                      customBackTarget={config.customBackTarget}
                    />
                  ),
                };
              }}
            />
          );
        })}
      </Stack.Navigator>

      <LoadingOverlay visible={isLoading} colorLoading={colorLoading} />
    </>
  );
};

export default HomeStack;
