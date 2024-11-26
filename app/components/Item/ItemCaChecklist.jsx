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
        <View style={{ width: 110 }}>
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
          : {moment(item.Giobd, "HH:mm:ss").format("HH:mm")} -{" "}
          {item.Giokt && moment(item?.Giokt, "HH:mm:ss").format("HH:mm")} (
          {moment(item?.Ngay).format("DD-MM")})
        </Text>
        <Image
          source={
            item.Tinhtrang === 1
              ? require("../../../assets/icons/ic_done.png")
              : require("../../../assets/icons/ic_circle_close.png")
          }
          style={{
            width: adjust(26),
            height: adjust(26),
            marginStart: "auto",
          }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.row}>
        <View style={{ width: 110 }}>
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
          : {item?.ent_user?.Hoten}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 110 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Tên ca
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {item?.ent_calv.Tenca}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 110 }}>
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
