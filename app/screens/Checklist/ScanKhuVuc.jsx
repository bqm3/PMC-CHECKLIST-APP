import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../../constants/config";
import { COLORS, SIZES } from "../../constants/theme";
import adjust from "../../adjust";

const ScanKhuVuc = ({ navigation, route }) => {
  const { ID_ChecklistC } = route.params;
  const [opacity, setOpacity] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [dataKhuvuc, setDataKhuvuc] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);
  const [data, setData] = useState([]);
  const { user, authToken } = useSelector((state) => state.authReducer);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingDetail(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/tb_checklistc/ca/${ID_ChecklistC}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchData();
  }, [ID_ChecklistC, authToken]);

  useEffect(() => {
    if (data && data.length > 0) {
      const groupedData = data.reduce((acc, item) => {
        const khuVuc = item?.ent_checklist?.ent_khuvuc?.Tenkhuvuc;
        const toaNha = item?.ent_checklist?.ent_khuvuc?.ent_toanha?.Toanha;
        const hangMuc = item?.ent_checklist?.ent_hangmuc?.Hangmuc;

        if (khuVuc) {
          // Nếu khu vực chưa tồn tại trong acc, thì tạo mới
          if (!acc[khuVuc]) {
            acc[khuVuc] = {
              khuVucName: khuVuc,
              toaNhaName: toaNha,
              hangMucs: {},
            };
          }

          // Nếu hạng mục chưa tồn tại trong khu vực, thì tạo mới
          if (!acc[khuVuc].hangMucs[hangMuc]) {
            acc[khuVuc].hangMucs[hangMuc] = {
              hangMucName: hangMuc,
              items: [],
            };
          }

          // Thêm mục vào nhóm hạng mục tương ứng
          acc[khuVuc].hangMucs[hangMuc].items.push({
            ...item,
          });
        }
        return acc;
      }, {});

      // Chuyển đổi các hạng mục từ đối tượng sang mảng và lưu vào state
      const formattedData = Object.values(groupedData).map((khuVuc) => ({
        ...khuVuc,
        hangMucs: Object.values(khuVuc.hangMucs),
      }));

      setDataKhuvuc(formattedData);
    }
  }, [data]);

  const decimalNumber = (number) => {
    return number < 10 ? `0${number}` : number.toString();
  };

  const toggleTodo = async (item) => {
    navigation.navigate("Scan hạng mục", {
      data: item,
    });
    setDataSelect([]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleTodo(item)}
      style={[
        styles.content,
        {
          backgroundColor: dataSelect[0] === item ? COLORS.bg_button : "white",
        },
      ]}
    >
      <View style={styles.itemRow}>
        <Text
          allowFontScaling={false}
          style={[
            styles.itemText,
            { color: dataSelect[0] === item ? "white" : "black" },
          ]}
          numberOfLines={1}
        >
          {item?.khuVucName} - {item?.toaNhaName}
        </Text>
      </View>
      {/* {item.some(
              (i) => i?.ent_checklist?.ent_hangmuc?.isScan == 1
            ) && (
              <View style={styles.qrWrapper}>
              <Image
                source={require("../../../assets/icons/ic_qrcode_30x30.png")}
              />
              <View style={[styles.diagonalLine1]} />
              <View style={[styles.diagonalLine2]} />
            </View>
            )} */}
      <View
        style={[
          styles.countContainer,
          { backgroundColor: dataSelect[0] === item ? "white" : "gray" },
        ]}
      >
        <Text
          style={{
            fontSize: adjust(16),
            color: dataSelect[0] === item ? "black" : "white",
            fontWeight: "600",
          }}
        >
          {item.hangMucs.length}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
              style={styles.backgroundImage}
            >
              <View style={{ flex: 1, opacity: opacity }}>
                <View style={{ flex: 1, opacity }}>
                  {isLoadingDetail ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={COLORS.bg_white} />
                    </View>
                  ) : (
                    <>
                      {dataKhuvuc?.length > 0 ? (
                        <>
                          <View style={styles.headerContainer}>
                            <Text
                              allowFontScaling={false}
                              style={[styles.text, { fontSize: adjust(18) }]}
                            >
                              Số lượng: {decimalNumber(dataKhuvuc.length)} khu
                              vực
                            </Text>
                          </View>
                          <FlatList
                            style={styles.flatList}
                            data={dataKhuvuc}
                            renderItem={renderItem}
                            ItemSeparatorComponent={() => (
                              <View style={styles.separator} />
                            )}
                            keyExtractor={(item, index) => `${item?.ID_Checklist}_${index}`}
                          />
                        </>
                      ) : (
                        <View style={styles.emptyContainer}>
                          <Image
                            source={require("../../../assets/icons/delete_bg.png")}
                            resizeMode="contain"
                            style={styles.emptyImage}
                          />
                          <Text
                            allowFontScaling={false}
                            style={styles.emptyText}
                          >
                            Khu vực của ca này chưa checklist!
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ScanKhuVuc;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  headerContainer: {
    margin: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  flatList: {
    margin: 12,
    flex: 1,
    marginBottom: 100,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
  emptyImage: {
    height: 120,
    width: 120,
  },
  emptyText: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "90%",
  },
  itemText: {
    fontSize: adjust(16),
    fontWeight: "600",
  },
  countContainer: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
