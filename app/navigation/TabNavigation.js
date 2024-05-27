import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Button, Text, TouchableOpacity, Platform } from "react-native";
import {
  ThucHienChecklist,
  HomeScreen,
  DanhmucCalamviec,
  DanhmucGiamsat,
  DanhmucKhuvuc,
  DetailChecklist,
  Profile,
  DanhmucChecklist,
  DanhmucTracuu,
} from "../screens/Checklist";
import { COLORS } from "../constants/theme";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import QRCodeScreen from "../screens/QRCodeScreen";
import DanhmucToanhaScreen from "../screens/PSH/DanhmucToanhaScreen";
import DanhmucDuanScreen from "../screens/PSH/DanhmucDuanScreen";
import DanhmucUserScreen from "../screens/PSH/DanhmucUserScreen";
import WebViewImage from "../screens/WebViewImage";
import DanhmucHangmuc from "../screens/Checklist/DanhmucHangmuc";
import ThucHienHangmuc from "../screens/Checklist/ThucHienHangmuc";
import ThucHienKhuvuc from "../screens/Checklist/ThuchienKhuvuc";

const Stack = createNativeStackNavigator();

const Back = ({ navigation, title }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        title ? navigation.navigate("Profile") : navigation.goBack()
      }
    >
      <FontAwesome5 name="user-alt" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              CHECKLIST - PMC
            </Text>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <Image
              style={{ width: 80, height: 40, resizeMode: "cover" }}
              source={require("../../assets/pmc_logo.png")}
            />
          ),
          headerRight: () => (
            <Back navigation={navigation} title={"Profile"} />
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Thông tin cá nhân
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
        name="Thực hiện Check list"
        component={ThucHienChecklist}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Thực hiện Checklist
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Hạng mục theo khu vực
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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

          headerTitle: () => (
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Khu vực
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Hạng mục
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Danh mục Khu vực
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Danh mục Check list
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
        name="Danh mục Giám sát"
        component={DanhmucGiamsat}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Danh mục Giám sát
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Danh mục Ca làm việc
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Danh mục tòa nhà
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Quản lý người dùng
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Danh mục dự án
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
        component={DanhmucTracuu}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Thống kê và tra cứu
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
            <Text allowFontScaling={false}
              
              style={{ fontSize: 20, fontWeight: "700", color: "white" }}
            >
              Chi tiết Checklist
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {Platform.OS === "ios" && (
                <Ionicons name="chevron-back" size={28} color="white" />
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
