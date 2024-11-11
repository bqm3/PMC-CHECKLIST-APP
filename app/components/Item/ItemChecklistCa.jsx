import React, { useCallback } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { DataTable } from "react-native-paper";
import moment from "moment";
import { COLORS } from "../../constants/theme";

 const ItemChecklistCa = ({selectedItem, item, index, toggleTodo}) => {
    console.log("item",item)
 const isExistIndex = selectedItem === item;
  return (
    <View>
      <TouchableHighlight key={index} onPress={() => toggleTodo(item, index)}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            backgroundColor: isExistIndex ? COLORS.bg_button : "white",
          }}
        >
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 15,
              }}
              numberOfLines={2}
            >
              {moment(item?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <View
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 16,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              numberOfLines={4}
            >
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 16,
                  fontWeight: "700",
                }}
                numberOfLines={2}
              >
                {item?.ent_khoicv?.KhoiCV}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                {item?.ent_calv?.Tenca}
              </Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 15,
              }}
              numberOfLines={2}
            >
              {item?.TongC}/{item?.Tong}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 15,
              }}
              numberOfLines={2}
            >
              {item?.ent_user?.Hoten}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <View
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 15,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              numberOfLines={4}
            >
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                {item?.Giobd}
              </Text>
              <Text allowFontScaling={false}>-</Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                {item?.Giokt}
              </Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 15,
              }}
              numberOfLines={2}
            >
              {" "}
              {item?.Tinhtrang === 1 ? "Xong" : ""}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableHighlight>
    </View>
  );
};

export default ItemChecklistCa;
