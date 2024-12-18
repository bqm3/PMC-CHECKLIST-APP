import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";

const HSSE = [
  { id: 0, title: "Điện cư dân", key: "Dien_cu_dan", value: "0" },
  { id: 1, title: "Điện chủ đầu tư", key: "Dien_cdt", value: "0" },
  { id: 2, title: "Nước cư dân", key: "Nuoc_cu_dan", value: "0" },
  { id: 3, title: "Nước chủ đầu tư", key: "Nuoc_cdt", value: "0" },
  { id: 4, title: "Nước xả thải", key: "Xa_thai", value: "0" },
  { id: 5, title: "Rác sinh hoạt", key: "Rac_sh", value: "0" },
  { id: 6, title: "Muối điện phân", key: "Muoi_dp", value: "0" },
  { id: 7, title: "PAC", key: "PAC", value: "0" },
  { id: 8, title: "NaHSO3", key: "NaHSO3", value: "0" },
  { id: 9, title: "NaOH", key: "NaOH", value: "0" },
  { id: 10, title: "Mật rỉ đường", key: "Mat_rd", value: "0" },
  { id: 11, title: "Polymer Anion", key: "Polymer_Anion", value: "0" },
  { id: 12, title: "Chlorine bột", key: "Chlorine_bot", value: "0" },
  { id: 13, title: "Chlorine viên", key: "Chlorine_vien", value: "0" },
  { id: 14, title: "Methanol", key: "Methanol", value: "0" },
  { id: 15, title: "Dầu máy phát", key: "Dau_may", value: "0" },
  { id: 16, title: "Túi rác 240L", key: "Tui_rac240", value: "0" },
  { id: 17, title: "Túi rác 120L", key: "Tui_rac120", value: "0" },
  { id: 18, title: "Túi rác 20L", key: "Tui_rac20", value: "0" },
  { id: 19, title: "Túi rác 10L", key: "Tui_rac10", value: "0" },
  { id: 20, title: "Túi rác 5L", key: "Tui_rac5", value: "0" },
  { id: 21, title: "Giấy vệ sinh 235mm", key: "giayvs_235", value: "0" },
  { id: 22, title: "Giấy vệ sinh 120mm", key: "giaivs_120", value: "0" },
  { id: 23, title: "Giấy lau tay", key: "giay_lau_tay", value: "0" },
  { id: 24, title: "Hóa chất làm sạch", key: "hoa_chat", value: "0" },
  { id: 25, title: "Nước rửa tay", key: "nuoc_rua_tay", value: "0" },
  { id: 26, title: "Nhiệt độ", key: "nhiet_do", value: "0" },
  { id: 27, title: "Nước bù bể", key: "nuoc_bu", value: "0" },
  { id: 28, title: "Clo", key: "clo", value: "0" },
  { id: 29, title: "Nồng độ PH", key: "PH", value: "0" },
  { id: 30, title: "Poolblock", key: "Poolblock", value: "0" },
  { id: 31, title: "Trạt thải", key: "trat_thai", value: "0" },
  { id: 32, title: "pH Minus", key: "pHMINUS", value: "0" },
  { id: 33, title: "Axit", key: "axit", value: "0" },
  { id: 34, title: "PN180", key: "PN180", value: "0" },
  { id: 35, title: "Chỉ số CO2", key: "chiSoCO2", value: "0" },
  { id: 36, title: "Clorin", key: "clorin", value: "0" },
  { id: 37, title: "NaOCL", key: "NaOCL", value: "0" },
];

const DetailHSSE = ({ navigation, route }) => {
  const { data } = route.params;
  const [hsseData, setHsseData] = useState(HSSE);

  useEffect(() => {
    const updatedHSSE = HSSE.map((item) => ({
      ...item,
      value:
        data[item.key] !== undefined ? data[item.key].toString() : item.value,
    }));
    setHsseData(updatedHSSE);
  }, [data]);

  const groupedData = useMemo(() => {
    const result = [];
    for (let i = 0; i < hsseData.length; i += 2) {
      result.push([hsseData[i], hsseData[i + 1] || null]);
    }
    return result;
  }, [hsseData]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        {item.map((subItem) => {
          if (!subItem) return null;
          return (
            <View key={subItem.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{subItem.title}</Text>
              <Text style={styles.input}>{subItem.value.toString()}</Text>
            </View>
          );
        })}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item, index) => `group-${index}`, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ImageBackground
          source={require("../../../assets/bg.png")}
          resizeMode="cover"
          style={styles.flex}
        >
          <FlatList
            data={groupedData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTitle: {
    fontSize: adjust(14),
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: COLORS.bg_button,
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});

export default DetailHSSE;
