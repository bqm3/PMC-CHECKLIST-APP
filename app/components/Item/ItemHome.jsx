import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import adjust from "../../adjust";
import { validatePassword } from "../../utils/util";

export default function ItemHome({ item, index, roleUser, passwordCore, showAlert }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        validatePassword(passwordCore) ? navigation.navigate(item.path) : showAlert("Mật khẩu của bạn không đủ mạnh. Vui lòng cập nhật mật khẩu mới với độ bảo mật cao hơn.");
      }}
      style={[
        {
          flexGrow: 1,
          width: "30%",
          position: "relative",
          backgroundColor:  COLORS.bg_white ,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          display: "flex"
        },
        item.id == 2 && item.id == 5 && { marginHorizontal: 10 },
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
        }}
      >
        <Image
          source={item.icon}
          resizeMode="contain"
          style={{ width: adjust(30), height: adjust(30) }}
        />
        <Text allowFontScaling={false}
        
          style={{
            color: roleUser !== 1 && item?.role === 1 ? 'white' : 'black',
            fontSize: adjust(16),
            fontWeight: "600",
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 10,
            paddingRight: 10,
            textAlign: "center",
          }}
        >
          {item.path} 
          <Text style={{color: 'green', fontWeight: '800'}}> {item.status == null ? '' : `(${item.status})`}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}
