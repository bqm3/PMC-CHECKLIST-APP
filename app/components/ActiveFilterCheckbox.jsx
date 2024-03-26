import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const ActionFilterCheckbox = ({ handleCheckbox, name, filters }) => {
 
  return (
    <TouchableOpacity style={styles.box} onPress={() => handleCheckbox(name,!filters)}>
      {filters && <Entypo name="check" size={16} color={COLORS.color_bg} />}
    </TouchableOpacity>
  );
};

export default ActionFilterCheckbox;

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: COLORS.gray,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
