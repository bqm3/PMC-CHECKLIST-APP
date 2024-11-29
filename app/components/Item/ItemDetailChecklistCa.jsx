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
  headerList,
  dataChecklistCa,
}) {
  const isSelected = newActionCheckList?.ID_Checklist === item.ID_Checklist;
  const isError = item.ent_checklist.Tinhtrang === 1;

  const backgroundColor = isSelected
    ? COLORS.bg_button
    : isError
    ? "#fff2cc"
    : "white";

  const textColor = isSelected ? "white" : "black";

  const getColumnData = (item, index) => {
    switch (index) {
      case 0:
        return moment(item?.tb_checklistc?.Ngay).format("DD-MM-YYYY");
      case 1:
        // Xử lý thêm điều kiện cho cột Checklist
        return (
          <Text>
            {item?.ent_checklist?.Checklist}
            {item?.isCheckListLai == 1 && (
              <Text style={{ color: "red" }}> (CheckList lại)</Text>
            )}
          </Text>
        );
      case 2:
        return item?.Gioht;
      case 3:
        return    item?.tb_checklistc?.ent_user?.Hoten
            ? item?.tb_checklistc?.ent_user?.Hoten
            : dataChecklistCa?.ent_user?.Hoten;
      case 4:
        return item?.Ketqua;
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity key={index} onPress={() => toggleTodo(item)}>
      <DataTable.Row style={[styles.row, { backgroundColor }]}>
        {headerList.map((header, i) => (
          <DataTable.Cell
            key={i}
            style={{ width: header.width, justifyContent: "center" }}
          >
            <Text style={{ color: textColor }}>{getColumnData(item, i)}</Text>
          </DataTable.Cell>
        ))}
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
