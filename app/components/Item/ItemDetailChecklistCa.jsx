import React from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";

const ItemDetailChecklistCa = React.memo(({ item, index, toggleTodo, newActionCheckList }) => {
  const isSelected =
    newActionCheckList?.ID_Checklist === item.ID_Checklist &&
    newActionCheckList?.index === index;
  const isError = item.ent_checklist.Tinhtrang === 1;

  const backgroundColor = isSelected
    ? COLORS.bg_button
    : isError
    ? "#fff2cc"
    : "white";

  const textColor = isSelected ? "white" : "black";

  return (
    <TouchableOpacity
      onPressIn={() => toggleTodo(item, index)}
      style={styles.touchable}
    >
      <View style={[styles.container, { backgroundColor }]}>
        {/* Image Column */}
        <View style={styles.imageContainer}>
          {item.Anh && (
            <Image
              source={require("../../../assets/icons/ic_image.png")}
              resizeMode="contain"
              style={styles.image}
            />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text allowFontScaling={false} style={[styles.text, { color: textColor }]} numberOfLines={3}>
            {item?.ent_checklist?.Checklist}
          </Text>
          {item?.isCheckListLai === 1 && (
            <Text style={styles.redText}>(CheckList lại)</Text>
          )}
        </View>

        <View style={styles.centeredContainer}>
          <Text allowFontScaling={false} style={[styles.text, { color: textColor }]} numberOfLines={2}>
            {item?.Gioht}
          </Text>
        </View>

        <View style={styles.centeredContainer}>
          <Text allowFontScaling={false} style={[styles.text, { color: textColor }]} numberOfLines={2}>
            {item?.Ketqua}
          </Text>
        </View>
      </View>
     </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
  },
  container: {
    width: "100%",
    paddingVertical: adjust(10),
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    flex: 0.5,
  },
  image: {
    height: adjust(25),
    width: adjust(25),
    paddingStart: adjust(5),
  },
  textContainer: {
    flex: 3,
    paddingStart: adjust(5),
  },
  text: {
    flexWrap: "wrap",
  },
  redText: {
    color: "red",
  },
  centeredContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ItemDetailChecklistCa;