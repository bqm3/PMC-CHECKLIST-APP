import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import DataContext from "../../context/DataContext";
import adjust from "../../adjust";

const NotHangMucTracuuCa = ({ route, navigation }) => {
  const { hangmucs } = route.params;
  const toggleTodo = async (item) => {
    navigation.navigate("Tổng checklist chưa checklist", {
      checklists: item.checklists,
      hangmuc: item?.ent_hangmuc?.dataValues.Hangmuc
    });
    setDataSelect([]);
  };

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[styles.content]}
        key={index}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: adjust(18),

                fontWeight: "600",
              }}
              numberOfLines={5}
            >
              {item?.ent_hangmuc?.dataValues.Hangmuc}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: adjust(16),

                fontWeight: "500",
              }}
            >
              {item?.ent_hangmuc?.dataValues?.MaQrCode}
            </Text>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              backgroundColor: "gray",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: adjust(16),
                color: "white",
                fontWeight: "600",
              }}
            >
              {item?.checklists.length}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  // opacity: opacity,
                }}
              >
                <View style={{ margin: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      // onPress={() => handleFilterData(true, 0.5)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "cloumn",
                          gap: 8,
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {hangmucs?.length} hạng mục
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <>
                  <FlatList
                    style={{
                      margin: 12,
                      flex: 1,
                      marginBottom: 100,
                    }}
                    data={hangmucs}
                    renderItem={({ item, index, separators }) =>
                      renderItem(item, index)
                    }
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 16 }} />
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                      `${item?.ID_Checklist}_${index}`
                    }
                  />
                </>
              </View>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default NotHangMucTracuuCa;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(18), color: "white", fontWeight: "600" },
  headerTable: {
    color: "white",
  },
  outter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: adjust(16),
    paddingVertical: 10,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
