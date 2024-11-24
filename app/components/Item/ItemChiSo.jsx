import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import adjust from "../../adjust";
import moment from "moment";
import { COLORS, SIZES } from "../../constants/theme";

export default function ItemSucongoai({
  item,
  index,
  toggleTodo,
  newActionClick,
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
        <View style={{ width: 100 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Ngày gửi
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.title, { fontWeight: "500", color: "black" }]}
        >
          : {moment(item?.Day).format("DD/MM/YYYY")}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 100 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Báo cáo
          </Text>
        </View>
        <View style={{ width: SIZES.width - 160 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { fontWeight: "500", color: "black" }]}
          >
            : Tháng {item?.Month} - Năm {item?.Year}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ width: 100 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Hạng mục
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.title, { fontWeight: "500", color: "black" }]}
        >
          : {item?.ent_hangmuc_chiso?.Ten_Hangmuc_Chiso}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 100 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: "black" }]}
          >
            Người gửi
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.title, { fontWeight: "500", color: "black" }]}
        >
          : {item?.ent_user?.Hoten}
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
