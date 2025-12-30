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
import { hsse_get } from "../../redux/actions/tbActions";
import { check_hsse } from "../../redux/actions/entActions";
import { BASE_URL } from "../../constants/config";
import { COLORS, SIZES } from "../../constants/theme";
import axios from "axios";
import { ReloadContext } from "../../context/ReloadContext";

const DanhMucBaoCaoHSSE = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { data_check_hsse } = useSelector((state) => state.entReducer);
  const { hsse } = useSelector((state) => state.tbReducer);

  const [dataHsse, setDataHsse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);

  // const [isReload, setIsReload] = useState(false);
  const { reloadKey } = useContext(ReloadContext);


  const init_hsse = async () => {
    setLoading(true);
    await dispatch(hsse_get());
  };

  const init_check_hsse = async () => {
    setLoading(true);
    await dispatch(check_hsse());
  };
  
  useEffect(() => {
    init_hsse();
    init_check_hsse();
  }, [dispatch, reloadKey]);

  useEffect(() => {
    if (hsse) {
      setDataHsse(hsse);
    }
    setLoading(false);
  }, [hsse]);

  useFocusEffect(
    React.useCallback(() => {
      const dataRes = async () => {
        await axios
          .get(BASE_URL + "/hsse/find", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((response) => {
            setShowReport(response.data.show);
          })
          .catch((err) => console.log("HSSE"));
      };
      dataRes();

      return () => {};
    }, [])
  );

  const toggleTodo = async (item, index) => {
    navigation.navigate("Chi tiết dữ liệu HSSE", {
      data: item,
    });
  };

  const handleCreate = async () => {
    navigation.navigate("Tạo báo cáo HSSE");
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={[styles.content, { backgroundColor: "white" }]}
        key={index}
        onPress={() => toggleTodo(item)}
      >
        <View style={styles.row}>
          <View style={{ width: SIZES.width -60}}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.title, { color: "black" }]}
            >
              Ngày gửi: <Text style={{fontWeight: "500"}}>{item?.Ngay_ghi_nhan}</Text>
            </Text>
          </View>
          <View style={{ width: SIZES.width -60}}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.title, { color: "black" }]}
            >
              Người gửi: <Text style={{fontWeight: "500"}}>{item?.Nguoi_tao}</Text>
            </Text>
          </View>

          <View
            style={{
              width: SIZES.width - 60,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingRight: adjust(10),
              }}
            >
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Điện CD: <Text style={{fontWeight: "500"}}>{item?.Dien_cu_dan}</Text>
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Nước CD: <Text style={{fontWeight: "500"}}>{item?.Nuoc_cu_dan}</Text>
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Xả thải: <Text style={{fontWeight: "500"}}>{item?.Xa_thai}</Text>
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Điện CĐT: <Text style={{fontWeight: "500"}}>{item?.Dien_cdt}</Text>
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Nước CĐT: <Text style={{fontWeight: "500"}}>{item?.Nuoc_cdt}</Text>
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.title, { color: "black" }]}
              >
                Rác: <Text style={{fontWeight: "500"}}>{item?.Rac_sh}</Text>
              </Text>
            </View>
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
                      {(showReport && data_check_hsse) && (
                        <View style={styles.header}>
                          <TouchableOpacity
                            style={styles.action}
                            onPress={() =>
                              handleCreate()
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
                              Báo cáo{" "}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {dataHsse.length > 0 && loading === false ? (
                        <View style={styles.content}>
                          <FlatList
                            data={dataHsse}
                            renderItem={renderItem}
                            scrollEventThrottle={16}
                            ListFooterComponent={
                              <View style={{ height: 80 }} />
                            }
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                          />
                        </View>
                      ) : (
                        <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 80,
                        }}
                      >
                        <Image
                          source={require("../../../assets/icons/o-05.png")}
                          style={{
                            tintColor: "white",
                            marginBottom: adjust(10),
                            width: 120,
                            height: 120,
                          }}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: adjust(20),
                            fontWeight: "600",
                          }}
                        >
                          Không có báo cáo nào
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

export default DanhMucBaoCaoHSSE;

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
