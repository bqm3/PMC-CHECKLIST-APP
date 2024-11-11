import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Image,
  Button,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import {
  ThucHienChecklist,
  HomeScreen,
  DanhmucCalamviec,
  DanhmucKhuvuc,
  DetailChecklist,
  Profile,
  DanhmucChecklist,
  DanhmucTracuuVsThongke,
  ChecklistLaiScreen,
  ThuchienKhuvucLai,
  DetailCheckListCa,
  ThucHienHangmucLai,
  DetailChecklistLai,
  NotKhuVuc,
  NotHangMuc,
  NotCheckList,
  ScanKhuVuc,
  ScanHangMuc,
} from "../screens/Checklist";
import { COLORS } from "../constants/theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import DanhmucToanhaScreen from "../screens/PSH/DanhmucToanhaScreen";
import DanhmucDuanScreen from "../screens/PSH/DanhmucDuanScreen";
import DanhmucUserScreen from "../screens/PSH/DanhmucUserScreen";
import DanhmucHangmuc from "../screens/Checklist/DanhmucHangmuc";
import ThucHienHangmuc from "../screens/Checklist/ThucHienHangmuc";
import ThucHienKhuvuc from "../screens/Checklist/ThuchienKhuvuc";
import adjust from "../adjust";
import ChecklistHangNgay from "../screens/Checklist/ChecklistHangNgay";
import Sucongoai from "../screens/Checklist/Sucongoai";
import ThuchienSucongoai from "../screens/Checklist/ThuchienSucongoai";
import DetailSucongoai from "../screens/Checklist/DetailSucongoai";
import XulySuco from "../screens/Checklist/XulySuco";
import YourComponent from "../screens/TestScreen";

const Stack = createNativeStackNavigator();

const Back = ({ navigation, title }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        title ? navigation.navigate("Profile") : navigation.goBack()
      }
    >
      {/* <FontAwesome5 name="user-alt" size={adjust(28)} color="white" /> */}

      <Image
        source={require("../../assets/icons/ic_person.png")}
        style={{
          width: adjust(40),
          height: adjust(40),
          tintColor: "white",
        }}
      />
    </TouchableOpacity>
  );
};

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Trang chính"
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Trang chính"
        component={HomeScreen}
        lazy={false}
        options={({ route, navigation }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
          headerBackTitleVisible: false,
          headerTitle: () => (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: adjust(18),
                fontWeight: "700",
                color: "white",
              }}
            >
              PMC Checklist
            </Text>
          ),
          headerTitleAlign: "center",
          headerRight: () => <Back navigation={navigation} title={"Profile"} />,
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
      {/* Checklist hàng ngày */}
      <Stack.Screen
        name="Checklist hàng ngày"
        component={ChecklistHangNgay}
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Checklist Lại"
        component={ChecklistLaiScreen}
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
              onPress={() => {
                navigation.goBack();
              }}
            >
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
              )}
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
        name="Khu vực chưa check list"
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
              Khu vực chưa check list
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
              )}
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
        component={ThuchienKhuvucLai}
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
              Khu vực
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Danh mục Hạng mục"
        component={DanhmucHangmuc}
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
              Hạng mục
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Danh mục Khu vực"
        component={DanhmucKhuvuc}
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
              Danh mục Khu vực
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Danh mục Check list"
        component={DanhmucChecklist}
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
              Danh mục Check list
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Thông báo sự cố"
        component={Sucongoai}
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
              Thông báo sự cố ngoài
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
            ></Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
            ></Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
            ></Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Danh mục Ca làm việc"
        component={DanhmucCalamviec}
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
              Danh mục Ca làm việc
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Danh mục tòa nhà"
        component={DanhmucToanhaScreen}
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
              Danh mục tòa nhà
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
        name="Tra cứu"
        component={DanhmucTracuuVsThongke}
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={adjust(28)} color="white" />
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
    </Stack.Navigator>
  );
};

export default HomeStack;
