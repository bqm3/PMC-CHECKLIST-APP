import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";

const ItemGiamSat = ({ index, data }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        marginVertical: 2,
        flexDirection: "row",
        paddingLeft: 20,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <View>
        <Text style={{ paddingVertical: 2 }}>
          Nguyễn Hoàng Nam - Giới tính: Nam
        </Text>
        <Text style={{ paddingVertical: 2 }}>
          Ngày sinh: 1/1/1999 - Số ĐT: 0999999990
        </Text>
      </View>
      <View style={{
         flexDirection: "row",
         marginRight: 20,
         gap: 10
      }}>
        <TouchableOpacity>
        <Feather name="edit" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
        <AntDesign name="delete" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemGiamSat;
