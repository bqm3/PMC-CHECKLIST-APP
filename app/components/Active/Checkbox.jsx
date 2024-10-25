import React from "react";
import { Text, View, TouchableOpacity, StyleSheet,Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import adjust from "../../adjust";

const Checkbox = ({ isCheck, onPress, color, size }) => {
  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          borderColor: color ? color : "white",
          width: size ? adjust(30) : adjust(24),
          height: size ? adjust(30) : adjust(24),
        },
      ]}
      onPress={onPress}
    >
      {isCheck && (
        <Image
          source={require("../../../assets/icons/ic_checkbox.png")}
          style={{
            width: adjust(size ? size * 0.9 : 20),
            height: adjust(size ? size * 0.9 : 20),
            tintColor: color ? color : "white", 
          }}
          resizeMode="contain"
        />
        // <Entypo
        //   name="check"
        //   size={adjust(size ? size * 0.9 : 20)}
        //   color={color ? color : "black"}
        // />
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  box: {
    width: adjust(24),
    height: adjust(24),
    borderWidth: 2,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
