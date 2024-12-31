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
  RefreshControl,
} from "react-native";
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import adjust from "../../adjust";
import { BASE_URL } from "../../constants/config";
import { COLORS, SIZES } from "../../constants/theme";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import { ReloadContext } from "../../context/ReloadContext";

const numberOfItemsPerPage = 7;

const DanhMucBaoCaoP0 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [isReload, setIsReload] = useState(false);
   const { isReload, setIsReload } = useContext(ReloadContext);

  const flatListRef = React.useRef();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isReload) {
      fetchData();
    }
  }, [isReload]);

  const fetchData = async (reset = false, refresh = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/p0/all-duan?page=${0}&limit=${30}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const newData = res?.data?.data || [];
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Tắt trạng thái refresh
    }
  };

  const toggleTodo = (item) => {
    navigation.navigate("Chi tiết dữ liệu P0", {
      data: item,
    });
    setIsReload(false);
  };

  const handleCreate = () => {
    navigation.navigate("Tạo báo cáo P0", {
      setIsReload,
    });
    setIsReload(false);
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[styles.content, { backgroundColor: "white" }]}
        onPress={() => toggleTodo(item)}
      >
        <View style={styles.row}>
          <View style={{ width: SIZES.width - 60 }}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.title, { color: "black" }]}
            >
              Ngày gửi:{" "}
              <Text style={{ fontWeight: "500" }}>{item?.Ngaybc}</Text>
            </Text>
          </View>

          {item?.ent_user_AN && (
            <View style={{ width: SIZES.width - 60 }}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={[styles.title, { color: "black" }]}
              >
                Người gửi (An ninh):{" "}
                <Text style={{ fontWeight: "500" }}>
                  {item?.ent_user_AN?.Hoten}
                </Text>
              </Text>
            </View>
          )}

          {item?.ent_user_KT && (
            <View style={{ width: SIZES.width - 60 }}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={[styles.title, { color: "black" }]}
              >
                Người gửi (Kế toán):{" "}
                <Text style={{ fontWeight: "500" }}>
                  {item?.ent_user_KT?.Hoten}
                </Text>
              </Text>
            </View>
          )}
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg_new.png")}
              resizeMode="stretch"
              style={{ flex: 1, width: "100%" }}
            >
              {isLoading ? (
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
                <View style={{ flex: 1, width: "100%" }}>
                  <View style={styles.container}>
                    <View style={styles.header}>
                      <TouchableOpacity
                        style={styles.action}
                        onPress={() => handleCreate()}
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

                    <FlatList
                      ref={flatListRef}
                      horizontal={false}
                      contentContainerStyle={{ flexGrow: 1 }}
                      data={data}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      style={{ margin: 10 }}
                      showsVerticalScrollIndicator={false}
                      onEndReachedThreshold={0.95}
                      ListFooterComponent={renderFooter}
                    />
                  </View>
                </View>
              )}
            </ImageBackground>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DanhMucBaoCaoP0;

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
