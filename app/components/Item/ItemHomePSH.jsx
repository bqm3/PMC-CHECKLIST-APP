import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

export default function ItemHomePSH({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.path);
      }}
      style={[
        {
          flexGrow: 1,
          width: "40%",
          position: "relative",
          backgroundColor: COLORS.bg_button,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "700",
            padding: 8,
            textAlign: "center",
          }}
        >
          {item.path}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
