import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import adjust from "../../adjust";
import { baocaochiso_get } from "../../redux/actions/tbActions";
import ReportContext from "../../context/ReportContext";
import { BASE_URL } from "../../constants/config";
import { COLORS, SIZES } from "../../constants/theme";
import axios from "axios";

const DanhMucBaoCaoChiSo = ({ navigation }) => {
  const dispatch = useDispatch();

  const { setShowReport, showReport } = useContext(ReportContext);

  const { user, authToken } = useSelector((state) => state.authReducer);
  const { baocaochiso } = useSelector((state) => state.tbReducer);

  const [dataChiSo, setDataChiSo] = useState([]);
  const [loading, setLoading] = useState(true);

  const init_baocaochiso = async () => {
    setLoading(true);
    await dispatch(baocaochiso_get());
  };

  useEffect(() => {
    init_baocaochiso();
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      init_baocaochiso();

      return () => {};
    }, [dispatch])
  );

  useEffect(() => {
    if (baocaochiso) {
      setDataChiSo(baocaochiso);
    }
    setLoading(false);
  }, [baocaochiso]);

  useFocusEffect(
    React.useCallback(() => {
      const dataRes = async () => {
        await axios
          .post(BASE_URL + "/date", {
            ID_Duan: user.ID_Duan,
          })
          .then((response) => {
            setShowReport(response.data.data);
          })
          .catch((err) => console.log("err device 1", err.response.data));
      };
      dataRes();

      return () => {};
    }, [])
  );

  const toggleTodo = async (item, index) => {
    navigation.navigate("Báo cáo chỉ số tháng năm", {
      data: item,
    });
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={[styles.content, { backgroundColor: "white" }]}
        key={index}
        onPress={() => toggleTodo(item)}
      >
        <View style={styles.row}>
          <View style={{ width: SIZES.width - 160 }}>
            <Text
              allowFontScaling={false}
              style={[styles.title, { color: "black" }]}
            >
              Báo cáo : {item?.monthYear}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => console.log("run")}
          accessible={false}
        >
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg_new.png")}
              resizeMode="stretch"
              style={{ flex: 1, width: "100%" }}
            >
              {loading == true ? (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <ActivityIndicator
                    size="large"
                    color={COLORS.color_primary}
                  />
                </View>
              ) : (
                <>
                  <View style={{ flex: 1, width: "100%" }}>
                    <View style={[styles.container]}>
                      {showReport?.show && (
                        <View style={styles.header}>
                          <TouchableOpacity
                            style={styles.action}
                            onPress={() =>
                              navigation.navigate("Hạng mục chỉ số")
                            }
                          >
                            <Image
                              source={require("../../../assets/icons/ic_plus.png")}
                              style={styles.closeIcon}
                            />
                            <Text
                              style={{
                                fontSize: adjust(16),
                                color: "white",
                                fontWeight: "600",
                              }}
                            >
                              Chỉ số{" "}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {dataChiSo.length > 0 && loading === false && (
                        <View style={styles.content}>
                          <FlatList
                            data={dataChiSo}
                            renderItem={renderItem}
                            scrollEventThrottle={16}
                            ListFooterComponent={
                              <View style={{ height: 80 }} />
                            }
                            scrollEnabled={true}
                          />
                        </View>
                      )}
                      {dataChiSo.length == 0 && loading === false && (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ textAlign: "center", color: "white" }}>
                            Không có báo cáo chỉ số nào
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </>
              )}
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DanhMucBaoCaoChiSo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    marginStart: 12,
    marginEnd: 12,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 65,
    height: 65,
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
  },
  modalText: {
    fontSize: adjust(20),
    fontWeight: "600",
    paddingVertical: 10,
  },
  content: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: adjust(10),
  },
  title: {
    paddingTop: 4,
    fontSize: adjust(16),
    paddingVertical: 2,
    color: "black",
    fontWeight: "700",
    textAlign: "left",
  },
  closeIcon: {
    tintColor: "white",
  },
});
