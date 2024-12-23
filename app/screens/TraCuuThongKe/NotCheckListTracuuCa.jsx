import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import adjust from "../../adjust";
import { useHeaderHeight } from "@react-navigation/elements";

const NotCheckListTracuuCa = ({ route, navigation }) => {
  const { checklists, hangmuc } = route.params;
  const headerHeight = useHeaderHeight();
  const renderItem = (item, index) => {
    return (
      <View
        style={[
          styles.content,
          {
            backgroundColor: `${item?.Tinhtrang}` === "1" ? "#ea9999" : "white",
          },
        ]}
        key={item?.ID_Checklist}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            position: "relative", // Quan trọng để đặt vị trí cho con
          }}
        >
          {/* Nội dung bên trái */}
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ width: "90%" }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(16),
                  color: "black",
                  fontWeight: "600",
                }}
                numberOfLines={5}
              >
                {index}. {item?.Checklist}
              </Text>
            </View>
          </View>
  
          {item.isImportant === 1 && (
            <Image
              source={require("../../../assets/icons/ic_star.png")}
              style={{
                position: "absolute",
                alignContent: "center",
                right: 0,
                tintColor: COLORS.bg_button,
              }}
            />
          )}
        </View>
      </View>
    );
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <BottomSheetModalProvider>
          <ImageBackground
            source={require("../../../assets/bg.png")}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={[styles.text, { fontSize: 17 }]}
                        >
                          Hạng mục: {hangmuc}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {checklists?.length} Checklist
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <>
                <FlatList
                  style={{
                    margin: 12,
                    flex: 1,
                    marginBottom: 80,
                  }}
                  data={checklists}
                  renderItem={({ item, index, separators }) =>
                    renderItem(item, index)
                  }
                  ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) =>
                    `${item?.ID_Checklist}_${index}`
                  }
                />
              </>
            </View>
          </ImageBackground>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default NotCheckListTracuuCa;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(15), color: "white", fontWeight: "600" },
  headerTable: {
    color: "white",
  },
  outter: {
    width: adjust(20),
    height: adjust(20),
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
    // flex: 1,
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
    fontSize: adjust(20),
    fontWeight: "600",
    paddingVertical: 10,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
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
