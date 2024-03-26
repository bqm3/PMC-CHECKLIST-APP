import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const VerticalSelect = ({ value,label, selectedItem }) => {
  const isChecked = value === selectedItem;
  return (
    <View
      style={[
        { backgroundColor: isChecked ? COLORS.bg_button : "white" },
        { justifyContent: "center", paddingLeft: 10, height: 50 },
      ]}
    >
      <Text
        style={
          [styles.customSelect,({ fontWeight: "600" },
          isChecked
            ? {
                color: COLORS.bg_white,
              }
            : {})]
        }
      >
        {label}
      </Text>
    </View>
  );
};

export default VerticalSelect;

const styles = StyleSheet.create({
  customSelect: { fontSize: 14, fontWeight: 700, color: "#637381" },
});
