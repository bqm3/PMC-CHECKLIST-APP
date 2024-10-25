import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import {
  ent_calv_get,
  ent_hangmuc_get,
  ent_khuvuc_get,
} from "../../redux/actions/entActions";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import { tb_checklistc_get } from "../../redux/actions/tbActions";
import DataContext from "../../context/DataContext";
import adjust from "../../adjust";
import * as Network from "expo-network";

const ThucHienChecklist = ({ navigation }) => {
  const ref = useRef(null);
  const dispath = useDispatch();
  const { ent_calv, ent_hangmuc } = useSelector((state) => state.entReducer);
  const { tb_checklistc } = useSelector((state) => state.tbReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { setDataHangmuc, stepKhuvuc } = useContext(DataContext);
  const [isConnected, setIsConnected] = useState(false);

  const [data, setData] = useState([]);

  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tb_checklistc?.data) {
      const data = tb_checklistc?.data.filter((item) => item.Tinhtrang == 0);
      setData(data);
    }
  }, [tb_checklistc]);

  useEffect(() => {
    if (ent_hangmuc) {
      const hangmucIds = ent_hangmuc.map((item) => item.ID_Hangmuc);
      setDataHangmuc(hangmucIds);
    }
  }, [ent_hangmuc]);

  const int_checklistc = async () => {
    await dispath(tb_checklistc_get({ page: 0, limit: 20 }));
  };

  useEffect(() => {
    int_checklistc();
    int_khuvuc();
    int_hangmuc();
  }, []);

  const int_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const int_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  useEffect(() => {
    if (ent_hangmuc) {
      const hangmucIds = ent_hangmuc.map((item) => item.ID_Hangmuc);
      setDataHangmuc(hangmucIds);
    }
  }, [ent_hangmuc]);

  const toggleTodo = async (item) => {
    // setIsCheckbox(true);
    const isExistIndex = newActionCheckList.findIndex(
      (existingItem) => existingItem.ID_ChecklistC === item.ID_ChecklistC
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionCheckList((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionCheckList([item]);
    }
  };

  const handleChecklistDetail = async (id1, id2, id3, id4) => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(networkState.isConnected);
    if (networkState.isConnected) {
      navigation.navigate("Thực hiện khu vực lại", {
        ID_ChecklistC: id1,
        ID_KhoiCV: id2,
        ID_ThietLapCa: id3,
        ID_Hangmucs: id4,
      });

      setNewActionCheckList([]);
    } else {
      Alert.alert(
        "Không có kết nối mạng",
        "Vui lòng kiểm tra kết nối mạng của bạn."
      );
    }
  };

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[
          styles.content,
          {
            backgroundColor:
              newActionCheckList[0] === item ? COLORS.bg_button : "white",
          },
        ]}
        key={index}
      >
        <View
          style={{
            flexDirection: "column",
            gap: 4,
            width: "80%",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: newActionCheckList[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            Ngày: {item?.Ngay}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: newActionCheckList[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            Ca làm việc: {item?.ent_calv.Tenca}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: newActionCheckList[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            Người giám sát: {item?.ent_user.Hoten}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 40,
                  }}
                >
                  <ActivityIndicator size="large" color={"white"} />
                </View>
              ) : (
                <>
                  {data && data?.length > 0 && (
                    <FlatList
                      style={{
                        margin: 12,
                        flex: 1,
                        marginBottom: 20,
                      }}
                      data={data}
                      renderItem={_renderItem}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                      )}
                      keyExtractor={(item, index) =>
                        `${item?.ID_ChecklistC}_${index}`
                      }
                    />
                  )}
                </>
              )}

              {newActionCheckList?.length > 0 && user?.ID_Chucvu !== 1 && (
                <View
                  style={{
                    width: 60,
                    position: "absolute",
                    right: 20,
                    bottom: 50,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {newActionCheckList[0]?.Tinhtrang === 0 && (
                    <>
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() =>
                          handleChecklistDetail(
                            newActionCheckList[0]?.ID_ChecklistC,
                            newActionCheckList[0]?.ID_KhoiCV,
                            newActionCheckList[0]?.ID_ThietLapCa,
                            newActionCheckList[0]?.ID_Hangmucs
                          )
                        }
                      >
                        <MaterialIcons
                          name="navigate-next"
                          size={adjust(40)}
                          color="white"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </ImageBackground>
          </BottomSheetModalProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
    // paddingVertical: 40,
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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 4,
    // alignItems: "center",
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
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

export default ThucHienChecklist;
