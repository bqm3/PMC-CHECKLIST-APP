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
  const isExistIndex = newActionClick.findIndex(
    (existingItem) => existingItem.ID_Suco === item.ID_Suco
  );

  const formattedTime = item?.Giosuco.slice(0,5)
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
        <View style={{ width: 100 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Ngày sự cố
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={[
            styles.title,
            { fontWeight: "500", color: isExistIndex ? "black" : "white" },
          ]}
        >
          : {formattedTime} {moment(item?.Ngaysuco).format("DD/MM/YYYY")}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{ width: 100 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Hạng mục
          </Text>
        </View>
        <View style={{ width: SIZES.width - 160 }}>
          <Text
            allowFontScaling={false}
            style={[
              styles.title,
          //    { fontWeight: "500", color: isExistIndex ? "black" : "white", },
              { fontWeight: "500",   color: isExistIndex
                ? item?.ent_hangmuc?.Hangmuc ? "black" : "red"
                : item?.ent_hangmuc?.Hangmuc ? "white" : "red", },
            ]}
          >
            : {item?.ent_hangmuc?.Hangmuc || 'Chưa có hạng mục'}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ width: 100 }}>
          <Text
            allowFontScaling={false}
            style={[styles.title, { color: isExistIndex ? "black" : "white" }]}
          >
            Người gửi
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
        <View style={{ width: 100 }}>
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
              fontWeight: "600",
              color:
                (item?.Tinhtrangxuly == 0 && "red") ||
                (item?.Tinhtrangxuly == 1 && "orange") ||
                (item?.Tinhtrangxuly == 2 && "green"),
            },
          ]}
        >
          :{" "}
          {(item?.Tinhtrangxuly == 0 && "Chưa xử lý") ||
            (item?.Tinhtrangxuly == 1 && "Đang xử lý") ||
            (item?.Tinhtrangxuly == 2 && "Đã xử lý")}
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