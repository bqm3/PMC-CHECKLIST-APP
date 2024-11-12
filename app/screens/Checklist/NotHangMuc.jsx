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
  ScrollView
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import DataContext from "../../context/DataContext";
import adjust from "../../adjust";

const NotHangMuc = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Khuvuc, dataFilterHandler} =
    route.params;
  const { dataChecklists, setHangMuc, hangMuc, HangMucDefault } =
    useContext(DataContext);

  const [opacity, setOpacity] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tieuChuan, setTieuChuan] = useState();
  const [dataSelect, setDataSelect] = useState([]);

  useEffect(() => {
    if (HangMucDefault && dataChecklists) {
      // Lọc các mục có ID_Khuvuc trùng khớp
      const filteredByKhuvuc = HangMucDefault?.filter(
        (item) => item.ID_Khuvuc == ID_Khuvuc
      );

      if (dataFilterHandler.length > 0) {
        const checklistIDs = dataFilterHandler?.map((item) => item.ID_Hangmuc);

        // Lọc filteredByKhuvuc để chỉ giữ lại các mục có ID_Hangmuc tồn tại trong checklistIDs
        const finalFilteredData = filteredByKhuvuc?.filter((item) =>
          checklistIDs.includes(item.ID_Hangmuc)
        );

        if (finalFilteredData.length == 0 && filteredByKhuvuc.length == 0) {
          navigation.goBack();
        } else {
          setHangMuc(finalFilteredData);
        }
      } else {
        // Lấy danh sách ID_Hangmuc từ dataChecklists
        const checklistIDs = dataChecklists?.map((item) => item.ID_Hangmuc);

        // Lọc filteredByKhuvuc để chỉ giữ lại các mục có ID_Hangmuc tồn tại trong checklistIDs
        const finalFilteredData = filteredByKhuvuc?.filter((item) =>
          checklistIDs.includes(item.ID_Hangmuc)
        );

        if (finalFilteredData.length == 0 && filteredByKhuvuc.length == 0) {
          navigation.goBack();
        } else {
          setHangMuc(finalFilteredData);
        }
      }
    }
  }, [ID_Khuvuc, HangMucDefault, dataChecklists]);

  const handlePopupActive = (item, index) => {
    setModalVisible(true);
    setOpacity(0.2);
    setTieuChuan(item.Tieuchuankt);
  };

  // toggle Data select
  const toggleTodo = async (item) => {
    console.log("item",item)
    navigation.navigate("Checklist chưa kiểm tra", {
      ID_ChecklistC: ID_ChecklistC,
      ID_KhoiCV: ID_KhoiCV,
      ID_Hangmuc: item.ID_Hangmuc,
      hangMuc: hangMuc,
      ID_Khuvuc: ID_Khuvuc,
      Hangmuc: item,
      isScan: 1,
    });
    setDataSelect([]);
  };

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[
          styles.content,
          {
            backgroundColor:
              dataSelect[0] === item ? COLORS.bg_button : "white",
          },
        ]}
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
                color: dataSelect[0] === item ? "white" : "black",
                fontWeight: "600",
              }}
              numberOfLines={5}
            >
              {item?.Hangmuc}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: adjust(16),
                color: dataSelect[0] === item ? "white" : "black",
                fontWeight: "500",
              }}
            >
              {item?.MaQrCode}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginRight: adjust(10),
            }}
          >
            {item.Important === 1 && (
              <Image
                source={require("../../../assets/icons/ic_star.png")}
                style={{
                  tintColor:
                    dataSelect[0] === item ? "white" : COLORS.bg_button,
                }}
              />
            )}
            {item.Tieuchuankt !== "" && item.Tieuchuankt !== null && (
              <TouchableOpacity onPress={() => handlePopupActive(item, index)}>
                <Image
                  source={require("../../../assets/icons/ic_certificate.png")}
                  style={{
                    tintColor: dataSelect[0] === item ? "white" : "black",
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
                setOpacity(1);
              }}
            >
              <View
                style={[styles.centeredView, { width: "100%", height: "80%" }]}
              >
                <View
                  style={[
                    styles.modalView,
                    {
                      width: "80%",
                      height: "auto",
                      maxHeight: "70%",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <ScrollView>
                    <Text allowFontScaling={false} style={styles.modalText}>
                      {tieuChuan}{" "}
                    </Text>
                  </ScrollView>
                  <Button
                    text={"Đóng"}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => {
                      setModalVisible(false);
                      setOpacity(1);
                    }}
                  />
                </View>
              </View>
            </Modal>
        </View>
      </TouchableOpacity>
    );
  };

  // format number
  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number == 0) return `0`;
    return number;
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
                  opacity: opacity,
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
                          Số lượng: {decimalNumber(hangMuc?.length)} hạng mục
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {isLoadingDetail === false && hangMuc && hangMuc?.length > 0 ? (
                  <>
                    <FlatList
                      style={{
                        margin: 12,
                        flex: 1,
                        marginBottom: 100,
                      }}
                      data={hangMuc}
                      renderItem={({ item, index, separators }) =>
                        renderItem(item, index)
                      }
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                      )}
                      showsHorizontalScrollIndicator = {false}
                      keyExtractor={(item, index) =>
                        `${item?.ID_Checklist}_${index}`
                      }
                    />
                  </>
                ) : (
                  navigation.goBack()
                )}
              </View>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default NotHangMuc;

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
