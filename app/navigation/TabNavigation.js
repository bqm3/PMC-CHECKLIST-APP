import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Button, Text, TouchableOpacity } from "react-native";
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

const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Trang chính">
      <Stack.Screen
        name="Trang chính"
        component={HomeScreen}
        lazy={false}
        options={({ route, navigation }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              CHECKLIST- PMC
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
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <FontAwesome5 name="user-alt" size={24} color="white" />
            </TouchableOpacity>
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
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Thông tin cá nhân
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />
      <Stack.Screen
        name="Thực hiện Check list"
        component={ThucHienChecklist}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Thực hiện Checklist
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />
      <Stack.Screen
        name="Danh mục Khu vực"
        component={DanhmucKhuvuc}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Danh mục Khu vực
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />
      <Stack.Screen
        name="Danh mục Check list"
        component={DanhmucChecklist}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Danh mục Check list
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />
      <Stack.Screen
        name="Danh mục Giám sát"
        component={DanhmucGiamsat}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Danh mục Giám sát
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />

      <Stack.Screen
        name="Danh mục Ca làm việc"
        component={DanhmucCalamviec}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Danh mục Ca làm việc
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />

      <Stack.Screen
        name="Danh mục tòa nhà"
        component={DanhmucToanhaScreen}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Danh mục tòa nhà
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />

      <Stack.Screen
        name="Quản lý người dùng"
        component={DanhmucUserScreen}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Quản lý người dùng
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />
      <Stack.Screen
        name="Danh mục dự án"
        component={DanhmucDuanScreen}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Danh mục dự án
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />

      <Stack.Screen
        name="Tra cứu"
        component={DanhmucTracuu}
        lazy={false}
        options={({ navigation, route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Thống kê và tra cứu
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />

      <Stack.Screen
        name="Chi tiết Checklist"
        component={DetailChecklist}
        lazy={false}
        options={({ route, navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
              Chi tiết Checklist
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.bg_button,
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
