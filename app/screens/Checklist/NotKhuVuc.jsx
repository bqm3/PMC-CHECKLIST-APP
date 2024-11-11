import ChecklistContext from "../../context/ChecklistContext";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Linking,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ent_checklist_mul_hm } from "../../redux/actions/entActions";
import React, { useState, useEffect, useContext } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "../../constants/theme";
import DataContext from "../../context/DataContext";
import adjust from "../../adjust";

const NotKhuVuc = ({ route, navigation }) => {
  const dispath = useDispatch();
  const { ID_ChecklistC, ID_KhoiCV, ID_Calv, ID_Hangmucs, ID_Hangmuc } =
    route.params;
  const { ent_khuvuc, ent_checklist_detail, ent_toanha } = useSelector(
    (state) => state.entReducer
  );
  const {
    setDataChecklists,
    dataHangmuc,
    hangMuc,
    setHangMuc,
    setStepKhuvuc,
    dataChecklists,
    HangMucDefault,
  } = useContext(DataContext);

  const [opacity, setOpacity] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [dataKhuvuc, setDataKhuvuc] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);
  const [dataFilterHandler, setDataFilterHandler] = useState([]);
  const {
    setDataChecklistFilterContext,
  } = useContext(ChecklistContext);

  const init_checklist = async () => {
    setIsLoadingDetail(true);
    await dispath(
      ent_checklist_mul_hm(ID_Hangmucs, ID_Calv, ID_ChecklistC, ID_KhoiCV)
    );
    setIsLoadingDetail(false);
  };

  useEffect(() => {
    const ID_HangmucsArray = Array.isArray(ID_Hangmucs)
      ? ID_Hangmucs
      : ID_Hangmucs.split(",").map(Number);
    setStepKhuvuc(1);

    // Kiểm tra xem mảng ent_khuvuc có dữ liệu không
    if (ent_khuvuc && ent_khuvuc.length > 0) {
      const matchingEntKhuvuc = ent_khuvuc
        .map((item) => {
          // Lọc và đếm số lượng hạng mục khớp với ID_HangmucsArray
          const matchingHangmucs = item.ent_hangmuc.filter((hangmuc) =>
            ID_HangmucsArray.includes(hangmuc.ID_Hangmuc)
          );
          // Trả về đối tượng item cùng với số lượng hạng mục khớp
          return {
            ...item,
          };
        })
        .filter((item) => item.hangmuccount > 0);

      setDataKhuvuc(matchingEntKhuvuc);
    }
  }, [ID_Hangmucs, ent_khuvuc]);

  useEffect(() => {
    if (HangMucDefault && dataChecklists) {
      // Lấy danh sách ID_Hangmuc từ dataChecklists
      const checklistIDs = dataChecklists.map((item) => item.ID_Hangmuc);

      // Lọc filteredByKhuvuc để chỉ giữ lại các mục có ID_Hangmuc tồn tại trong checklistIDs
      const finalFilteredData = HangMucDefault.filter((item) =>
        checklistIDs.includes(item.ID_Hangmuc)
      );
      const validKhuvucIDs = finalFilteredData.map((item) => item.ID_Khuvuc);

      // Lọc danh sách hạng mục dựa trên ID_Khuvuc có trong validKhuvucIDs
      const filteredHangMuc = ent_khuvuc
        .filter((item) => validKhuvucIDs.includes(item.ID_Khuvuc))
        .map((khuvuc) => {
          // Đếm số lượng hạng mục còn lại trong từng khu vực
          const hangMucCount = finalFilteredData.filter(
            (hangmuc) => hangmuc.ID_Khuvuc === khuvuc.ID_Khuvuc
          ).length;

          // Gắn số lượng hạng mục vào từng khu vực
          return {
            ...khuvuc,
            hangMucCount,
          };
        });

      // Cập nhật trạng thái hangMuc với danh sách đã lọc
      setHangMuc(finalFilteredData);
      setDataKhuvuc(filteredHangMuc);
      setDataFilterHandler(finalFilteredData);
    }

    // }
  }, [HangMucDefault, dataChecklists]);

  useEffect(() => {
    init_checklist();
  }, []);

  const loadData = async () => {
    setDataChecklists(ent_checklist_detail);
    setDataChecklistFilterContext(ent_checklist_detail);
  };

  useEffect(() => {
    loadData();
  }, [ent_checklist_detail]);

  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number == 0) return `0`;
    return number;
  };

  const toggleTodo = async (item) => {
    navigation.navigate("Hạng mục chưa checklist", {
      ID_ChecklistC: ID_ChecklistC,
      ID_KhoiCV: ID_KhoiCV,
      ID_Calv: ID_Calv,
      ID_Khuvuc: item.ID_Khuvuc,
     dataFilterHandler: dataFilterHandler,
      Tenkv: `${item?.Tenkhuvuc} - ${item?.ent_toanha?.Toanha}`,
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
            gap: 10,
            width: "90%",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Tenkhuvuc} - {item?.ent_toanha?.Toanha}
          </Text>
        </View>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 50,
            backgroundColor: dataSelect[0] === item ? "white" : "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "black" : "white",
              fontWeight: "600",
            }}
          >
            {item?.hangMucCount}
          </Text>
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
                        {isLoadingDetail == false && (
                          <Text
                            allowFontScaling={false}
                            style={[styles.text, { fontSize: adjust(18) }]}
                          >
                            Số lượng: {decimalNumber(dataKhuvuc?.length)} khu
                            vực
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {isLoadingDetail === false &&
                  dataKhuvuc &&
                  dataKhuvuc?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={dataKhuvuc}
                        renderItem={({ item, index, separators }) =>
                          renderItem(item, index)
                        }
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 16 }} />
                        )}
                        keyExtractor={(item, index) =>
                          `${item?.ID_Checklist}_${index}`
                        }
                      />
                    </>
                  )}

                {isLoadingDetail === false && dataKhuvuc?.length == 0 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 80,
                    }}
                  >
                    <Image
                      source={require("../../../assets/icons/delete_bg.png")}
                      resizeMode="contain"
                      style={{ height: 120, width: 120 }}
                    />
                    <Text
                      allowFontScaling={false}
                      style={[styles.danhmuc, { padding: 10 }]}
                    >
                      Khu vực của ca này đã hoàn thành !
                    </Text>
                  </View>
                )}

                {isLoadingDetail === true && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator
                      style={{
                        marginRight: 4,
                      }}
                      size="large"
                      color={COLORS.bg_white}
                    ></ActivityIndicator>
                  </View>
                )}
              </View>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default NotKhuVuc;

const styles = StyleSheet.create({
  container: {
    margin: 12,
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
    fontSize: adjust(20),
    fontWeight: "600",
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
