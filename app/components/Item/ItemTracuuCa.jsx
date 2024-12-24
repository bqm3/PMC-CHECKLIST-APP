import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import adjust from "../../adjust";
import moment from "moment";
import { COLORS, SIZES } from "../../constants/theme";

export default function ItemTracuuCa({
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
        <View style={{ width: SIZES.width * 0.3 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Ngày checklist
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {item?.Ngay}
        </Text>
        {/* <Image
          source={
            item.TongC >= item.Tong
              ? require("../../../assets/icons/ic_done.png")
              : require("../../../assets/icons/ic_circle_close.png")
          }
          style={{
            width: adjust(26),
            height: adjust(26),
            marginStart: "auto",
          }}
          resizeMode="contain"
        /> */}
      </View>
      <View style={styles.row}>
        <View style={{ width: SIZES.width * 0.3 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Ca làm việc
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {item?.Ca}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: SIZES.width * 0.3 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Khối công việc
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {item?.KhoiCV}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: SIZES.width * 0.3 }}>
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
          : {item?.TongC}/{item?.Tong}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginVertical: 6,
    padding: 8,
    borderRadius: 12,
  },

  title: {
    paddingTop: 2,
    fontSize: adjust(16),
    paddingVertical: 1,
    color: "black",
    fontWeight: "700",
    textAlign: "left",
  },
  row: {
    marginLeft: 10,
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
