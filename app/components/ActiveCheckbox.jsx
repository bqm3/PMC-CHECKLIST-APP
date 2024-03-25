import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const ActionCheckbox = ({ newActionCheckList, item, handleToggle }) => {
  const isExistIndex = newActionCheckList?.find(
    (existingItem) => existingItem.ID_Checklist === item.ID_Checklist
  );
  return (
    <TouchableOpacity style={styles.box} onPress={() => handleToggle(item)}>
      {isExistIndex && <Entypo name="check" size={16} color={"blue"} />}
    </TouchableOpacity>
  );
};

export default ActionCheckbox;

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
