import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import adjust from "../../adjust";
import moment from "moment";
import { COLORS } from "../../constants/theme";

export default function ItemCaChecklist({
  item,
  index,
  toggleTodo,
  newActionCheckList,
}) {
  const isExistIndex = newActionCheckList.findIndex(
    (existingItem) => existingItem.ID_ChecklistC === item.ID_ChecklistC
  );
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isExistIndex ? "white" : COLORS.bg_button,
        },
      ]}
      onPress={() => toggleTodo(item)}
    >
      <View style={styles.row}>
        <View style={{ width: 150 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Ngày nhập
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {moment(item?.Ngay).format("DD/MM/YYYY")}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 150 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Giờ vào - ra
          </Text>
        </View>
        <View style={{ width: 200 }}>
          <Text
            allowFontScaling={false}
            style={[
              styles.title,
              { fontWeight: "500", color: isExistIndex ? "black" : "white" },
            ]}
          >
            : {item?.Giobd} - {item?.Giokt}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ width: 150 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Tên nhân viên
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {item?.ent_giamsat?.Hoten}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 150 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Số lượng
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {item?.Tong}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 150 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Tình trạng
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            {
              fontWeight: "500",
              color: item?.Tinhtrang === 1 ? "green" : "red",
            },
          ]}
        >
          : {item?.Tinhtrang === 1 ? "Xong" : "Đang thực hiện"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginVertical: 8,
    padding: 10,
    borderRadius: 16,
  },

  title: {
    paddingTop: 4,
    fontSize: adjust(16),
    paddingVertical: 2,
    color: "black",
    fontWeight: "700",
    textAlign: "left",
  },
  row: {
    marginLeft: 10,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
