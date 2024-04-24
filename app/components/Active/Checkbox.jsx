import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

const Checkbox = ({ isCheck, onPress, color }) => {
  
  return (
    <TouchableOpacity style={[styles.box, {borderColor: color? color: 'white'}]} onPress={onPress}>
      {isCheck && <Entypo name="check" size={20} color={color? color: 'white'} />}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
