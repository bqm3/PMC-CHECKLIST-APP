import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

const Checkbox = ({ isCheck, onPress }) => {
  
  return (
    <TouchableOpacity style={[styles.box]} onPress={onPress}>
      {isCheck && <Entypo name="check" size={20} color={'white'} />}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor:"white",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
