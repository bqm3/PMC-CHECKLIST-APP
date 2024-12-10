import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import adjust from "../../adjust";

const ActiveChecklist = ({ item, handleToggle, size, index }) => {
  return (
    <TouchableOpacity
      key={index}
      style={[styles.box, { width: size, height: size }]}
      onPress={() => (handleToggle ? handleToggle() : {})}
    >
      {item.valueCheck !== null &&
        (`${item?.valueCheck}` == `${item?.Giatriloi}` ? (
          <Image
            source={require("../../../assets/icons/ic_close.png")}
            style={{
              width: adjust(24),
              height: adjust(24),
              tintColor: "red",
            }}
            resizeMode="contain"
          />
        ) : (
          <Image
          source={require("../../../assets/icons/ic_checkbox.png")}
          style={{
            width: adjust(24),
            height: adjust(24),
            tintColor: "green"
          }}
          resizeMode="contain"
        />
        ))}
    </TouchableOpacity>
  );
};

export default ActiveChecklist;

const styles = StyleSheet.create({
  box: {
    width: adjust(20),
    height: adjust(20),
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
