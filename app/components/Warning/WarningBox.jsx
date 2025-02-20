import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

// const WarningBox = ({ title, content, style }) => {
  const WarningBox = ({ title = "Cảnh báo", content = "", style = {} }) => {
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions(); // Lấy chiều rộng màn hình để hiển thị HTML phù hợp

  return (
    <View style={[styles.warningContainer, style]}>
      <View style={styles.warningHeader}>
        <MaterialIcons name="error-outline" size={20} color="#D32F2F" />
        <Text style={styles.warningTitle}>{title}</Text>
      </View>

      {/* Hiển thị nội dung HTML nếu expanded = true */}
      {expanded && (
        <RenderHTML
          contentWidth={width}
          source={{ html: content }}
          baseStyle={styles.warningText}
        />
      )}

      {/* Nút "Chi tiết..." / "Thu gọn" */}
      {content && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.toggleText}>{expanded ? "Thu gọn" : "Chi tiết ..."}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// CSS Styles
const styles = StyleSheet.create({
  warningContainer: {
    backgroundColor: "#FFEBE5",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  warningTitle: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  warningText: {
    color: "#A63A3A",
    fontSize: 14,
    marginBottom: 4,
  },
  toggleText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textDecorationLine: "underline",
  },
});

export default WarningBox;
