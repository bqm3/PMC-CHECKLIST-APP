import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import adjust from "../../adjust";
import moment from "moment";
import { COLORS, SIZES } from "../../constants/theme";

export default function ItemTracuuCa({
  item,
  toggleTodo,
}) {

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: "white",
        },
      ]}
      onPress={() => toggleTodo(item)}
    >
      <View style={styles.row}>
        <View style={{ width: SIZES.width * 0.3 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Ngày checklist
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: "black" },
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
            style={[styles.title, { color: "black" }]}
          >
            Ca làm việc
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: "black" },
          ]}
        >
          : {item?.Ca}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: SIZES.width * 0.3 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Khối công việc
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: "black" },
          ]}
        >
          : {item?.KhoiCV}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: SIZES.width * 0.3 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Số lượng
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: "black" },
          ]}
        >
          : {item?.TongC}/{item?.Tong}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: SIZES.width * 0.3 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Chu kỳ
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: "black", flexShrink: 1 },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          : {item?.Chuky}
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
    alignItems: "center",
  },
});
