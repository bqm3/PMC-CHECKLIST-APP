import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

const ActiveChecklist = ({item, handleToggle, size,index }) => {

  return (
    <TouchableOpacity key={index} style={[styles.box, {width: size, height: size }]} onPress={() => handleToggle ? handleToggle() : {}}>
      {item.valueCheck !== null && <Entypo name="check" size={24} color={'green'} />}
    </TouchableOpacity>
  );
};

export default ActiveChecklist;

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor:COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
