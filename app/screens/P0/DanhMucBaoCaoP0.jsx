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
  RefreshControl
} from "react-native";
import React, { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import adjust from "../../adjust";
import { BASE_URL } from "../../constants/config";
import { COLORS, SIZES } from "../../constants/theme";
import axios from "axios";

const numberOfItemsPerPage = 7;

const DanhMucBaoCaoP0 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page]); 

  useEffect(() => {
    if (isReload) {
      fetchData();
    }
  }, [isReload]);

  const fetchData = async ( reset = false, refresh = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const currentPage = reset || refresh ? 0 : page;
      const res = await axios.get(
        `${BASE_URL}/p0/all-duan?page=${currentPage}&limit=${numberOfItemsPerPage}1`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const newData = res?.data?.data || [];
      if (reset) {
        // Tải lại dữ liệu (khi scroll top)
        setData(newData);
        setPage(0);
        setHasMoreData(true); // Cho phép tải thêm dữ liệu sau khi reset
      } else {
        // Cộng thêm dữ liệu mới vào danh sách hiện tại
        setData((prevData) => [...prevData, ...newData]);
        setHasMoreData(true);
        if (newData.length === 0) setHasMoreData(false); // Không còn dữ liệu
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Tắt trạng thái refresh
    }
  };

  const handleLoadMore = () => {
    if (data.length < 5 || isLoading) { return; }
    if (hasMoreData && !isLoading) {
      setPage((prevPage) => prevPage + 1); // Tăng trang lên 1
    }
  };

  
  const handleRefresh = () => {
    setData([]); // Xóa dữ liệu hiện tại
    setPage(0); // Đặt lại trang
    setHasMoreData(true); // Cho phép tải thêm dữ liệu
    setIsRefreshing(true); // Hiển thị biểu tượng làm mới
    fetchData(true, true);
  };

  const toggleTodo = (item) => {
    navigation.navigate("Chi tiết dữ liệu P0", {
      data: item,
      setIsReload,
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
            <Text allowFontScaling={false} numberOfLines={1} style={[styles.title, { color: "black" }]}>
              Ngày gửi: <Text style={{ fontWeight: "500" }}>{item?.Ngaybc}</Text>
            </Text>
          </View>

          {item?.ent_user_AN && (
            <View style={{ width: SIZES.width - 60 }}>
              <Text allowFontScaling={false} numberOfLines={1} style={[styles.title, { color: "black" }]}>
                Người gửi (An ninh): <Text style={{ fontWeight: "500" }}>{item?.ent_user_AN?.Hoten}</Text>
              </Text>
            </View>
          )}

          {item?.ent_user_KT && (
            <View style={{ width: SIZES.width - 60 }}>
              <Text allowFontScaling={false} numberOfLines={1} style={[styles.title, { color: "black" }]}>
                Người gửi (Kế toán): <Text style={{ fontWeight: "500" }}>{item?.ent_user_KT?.Hoten}</Text>
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
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground source={require("../../../assets/bg_new.png")} resizeMode="stretch" style={{ flex: 1, width: "100%" }}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.color_primary} />
                </View>
              ) : (
                <View style={{ flex: 1, width: "100%" }}>
                  <View style={styles.container}>
                    <View style={styles.header}>
                      <Text allowFontScaling={false}    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "600",
                    }}>
                        Số lượng: {data?.length}
                      </Text>
                      <TouchableOpacity style={styles.action} onPress={handleCreate}>
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
                      data={data}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      style={{ margin: 10 }}
                      showsVerticalScrollIndicator={false}
                      onEndReached={handleLoadMore}
                      onEndReachedThreshold={0.95}
                      ListFooterComponent={renderFooter} 
                      refreshControl={
                        <RefreshControl
                          refreshing={isRefreshing}
                          onRefresh={handleRefresh}
                        />
                      }
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
    marginTop: 12,
    marginStart: 12,
    marginEnd: 12,
    justifyContent: "space-between",
    alignItems: "center",
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
