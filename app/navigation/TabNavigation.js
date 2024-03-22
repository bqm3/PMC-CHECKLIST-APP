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
} from "../screens/Checklist";
import { COLORS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import DanhmucChecklist from "../screens/Checklist/DanhmucChecklist";

const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Trang chính">
      <Stack.Screen
        name="Trang chính"
        component={HomeScreen}
        lazy={false}
        options={({ route }) => ({
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
        })}
      />
      <Stack.Screen
        name="Thực hiện Check list"
        component={ThucHienChecklist}
        lazy={false}
        options={({ route }) => ({
          headerShown: true,

          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
              Thực hiện Checklist
            </Text>
          ),
          headerTitleAlign: "center",
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
        name="Chi tiết Checklist"
        component={DetailChecklist}
        lazy={false}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "700", color: "black" }}>
              Chi tiết Checklist
            </Text>
          ),
          headerBackTitle: "Quay lại",
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
};

// const TabNavigation = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="Trang chủ"
//         lazy={true}
//         component={HomeStack}
// options={({ route }) => ({
//   headerShown: false,
//   // unmountOnBlur: true,
//   tabBarIcon: ({ focused, color, size }) => {
//     let iconName;
//     // if (route.name === "Trang chủ") {
//     //   iconName = !focused
//     //     ? require("../../assets/Icon-bottom/Trang_Chu.png")
//     //     : require("../../assets/Icon-bottom/Trang_Chu_Xanh.png");
//     // }
//     return (
//       <Image
//         source={iconName}
//         style={{ width: 24, height: 24 }}
//         resizeMode="stretch"
//       />
//     );
//   },
//   // tabBarActiveTintColor: COLORS.green,
//   // tabBarInactiveTintColor: COLORS.gray,
// })}
//       />

//     </Tab.Navigator>
//   );
// };

export default HomeStack;
