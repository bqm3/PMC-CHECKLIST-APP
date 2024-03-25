import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const ActionCheckboxAll = ({ status,toggleTodo }) => {
  
  return (
    <TouchableOpacity style={styles.box} onPress={() => toggleTodo()}>
      {status && <Entypo name="check" size={16} color={"blue"} />}
    </TouchableOpacity>
  );
};

export default ActionCheckboxAll;

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "COLORS.gray",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
