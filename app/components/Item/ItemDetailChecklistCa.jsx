import { Text, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import React from "react";
import { DataTable } from "react-native-paper";
import adjust from "../../adjust";
import moment from "moment";
import { COLORS } from "../../constants/theme";

export default function ItemDetailChecklistCa({
  item,
  index,
  toggleTodo,
  newActionCheckList,
}) {
  const isSelected = newActionCheckList?.ID_Checklist === item.ID_Checklist;
  const isError = item.ent_checklist.Tinhtrang === 1;

  const backgroundColor = isSelected
    ? COLORS.bg_button
    : isError
    ? "#fff2cc"
    : "white";

  return (
    // <TouchableOpacity key={index} onPress={() => toggleTodo(item)}>
    //   <DataTable.Row style={[styles.row, { backgroundColor }]}>
    //     {/* {headerList.map((header, i) => ( */}
    //       <DataTable.Cell
    //         key={i}
    //         style={{ width: header.width, justifyContent: "center" }}
    //       >
    //         <Text style={{ color: textColor }}>{getColumnData(item, i)}</Text>
    //       </DataTable.Cell>
    //     {/* ))} */}
    //   </DataTable.Row>
    // </TouchableOpacity>
    <TouchableOpacity key={index} onPressIn={() => toggleTodo(item)}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            backgroundColor: backgroundColor,
          }}
        >
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isSelected ? "white" : "black" }}
              numberOfLines={2}
            >
              {moment(item?.tb_checklistc?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 200, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isSelected ? "white" : "black" }}
              numberOfLines={3}
            >
              {item?.ent_checklist?.Checklist}
              {item?.isCheckListLai == 1 && (
              <Text style={{ color: "red" }}> (CheckList lại)</Text>
            )}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isSelected ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Gioht}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isSelected ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.tb_checklistc?.ent_user?.Hoten}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isSelected ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Ketqua}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     marginVertical: 6,
//     padding: 8,
//     borderRadius: 12,
//   },

//   title: {
//     paddingTop: 2,
//     fontSize: adjust(16),
//     paddingVertical: 1,
//     color: "black",
//     fontWeight: "700",
//     textAlign: "left",
//   },
//   row: {
//     marginLeft: 10,
//     width: "95%",
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//   },
});
