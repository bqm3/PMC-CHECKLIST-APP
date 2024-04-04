import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";

const ItemToanha = ({ index, item, handleEditEnt, handleAlertDelete }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        marginVertical: 8,
        flexDirection: "row",
        paddingLeft: 20,
        padding: 12,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
      }}
    >
      <View>
        <Text style={[styles.title, { fontSize: 18 }]}>
          {item?.Toanha} - Số tầng: {item?.Sotang}
        </Text>
        <Text style={styles.title}>{item?.ent_duan?.Duan}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginRight: 10,
          gap: 16,
        }}
      >
        <TouchableOpacity onPress={() => handleEditEnt(item)}>
          <Image
            source={require("../../../assets/icons/edit_icon.png")}
            resizeMode="contain"
            style={{ height: 26, width: 26 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAlertDelete(item.ID_Toanha)}>
          <Image
            source={require("../../../assets/icons/delete_icon.png")}
            resizeMode="contain"
            style={{ height: 26, width: 26 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemToanha;

const styles = StyleSheet.create({
  title: { paddingVertical: 2, color: "black", fontWeight: "600" },
});
