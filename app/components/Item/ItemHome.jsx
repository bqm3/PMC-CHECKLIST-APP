import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

export default function ItemHome({ item, index, roleUser }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.path);
      }}
      style={[
        {
          flexGrow: 1,
          width: "30%",
          position: "relative",
          backgroundColor:
            roleUser === 2 && item?.role === 1
              ? COLORS.bg_active
              : COLORS.bg_white,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
        },
        item.id == 2 && item.id == 5 && { marginHorizontal: 10 },
      ]}
    >
      <View style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center',
        padding: 8
      }}>
      <Image source={item.icon}
      resizeMode="contain" style={{width: 36, height: 36}}/>
      <Text 
        style={{
          color: 'black',
          fontSize: 16,
          fontWeight: "600",
          padding: 4,
          textAlign: "center",
        }}
      >
        {item.path}
      </Text>
      </View>
    </TouchableOpacity>
  );
}
