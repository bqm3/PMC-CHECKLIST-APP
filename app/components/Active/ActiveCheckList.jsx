import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import adjust from "../../adjust";

const ActiveChecklist = ({item, handleToggle, size, index }) => {
  return (
    <TouchableOpacity key={index} style={[styles.box, {width: size, height: size }]} onPress={() => handleToggle ? handleToggle() : {}}>
      {item.valueCheck !== null && (
        (item.valueCheck == item.Giatridinhdanh) ? <Entypo name="check" size={adjust(24)} color={'green'}/> :
        <Ionicons name="close" size={24} color="red" />
      ) }
    </TouchableOpacity>
  );
};

export default ActiveChecklist;

const styles = StyleSheet.create({
  box: {
    width: adjust(20),
    height: adjust(20),
    borderWidth: 2,
    borderColor:COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
