import {
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    View,
    BackHandler,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
  } from "react-native";
  
  import React, {
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
  } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  import { COLORS, SIZES } from "../../constants/theme";
  import axios from "axios";
  import { BASE_URL } from "../../constants/config";
  import moment from "moment";
  import ModalTraCuu from "../../components/Modal/ModalTracuu";
  import ItemCaChecklist from "../../components/Item/ItemCaChecklist";
import ItemTracuuCa from "../../components/Item/ItemTracuuCa";

  
  const numberOfItemsPerPage = 15;
  const DanhmucTraCuuCa = ({ setOpacity, opacity, navigation }) => {
    const dispath = useDispatch();
    const { user, authToken } = useSelector((state) => state.authReducer);
    const { ent_khoicv, ent_calv } = useSelector((state) => state.entReducer);
    const [newActionCheckList, setNewActionCheckList] = useState([]);
  
    const bottomSheetModalRef = useRef(null);
    const snapPoints2 = useMemo(() => ["80%", "80%", "90%"], []);
    const snapPoints1 = useMemo(() => ["70%", "70%", "80%"], []);
    const [page, setPage] = useState(0);
  
    const [isLoading, setIsLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
    const [hasMoreData, setHasMoreData] = useState(true); 
  
    const flatListRef = React.useRef();
  
    const date = new Date();
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment(date).format("YYYY-MM-DD");
  
    const [isDatePickerVisible, setDatePickerVisibility] = useState({
      fromDate: false,
      toDate: false,
    });
  
    const [selectedKhoiCV, setSelectedKhoiCV] = useState(null);
    const [filteredCalv, setFilteredCalv] = useState(ent_calv);
    const [data, setData] = useState([]);
    const [visibleBottom, setVisibleBottom] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false); // Trạng thái refresh
  
    const [filters, setFilters] = useState({
      fromDate: startOfMonth,
      toDate: endOfMonth,
      ID_Calv: null,
      ID_KhoiCV: null,
    });
  
    const handleKhoiSelection = (selectedKhoi) => {
      setSelectedKhoiCV(selectedKhoi?.ID_KhoiCV);
  
      const filtered = ent_calv.filter(
        (ca) => ca?.ent_khoicv?.ID_KhoiCV === selectedKhoi?.ID_KhoiCV
      );
      setFilteredCalv(filtered);
    };
  
    const toggleDatePicker = (key, isCheck) => {
      setDatePickerVisibility((data) => ({
        ...data,
        [key]: isCheck,
      }));
    };
  
    const handleChangeFilters = (key, value) => {
      setFilters((data) => ({
        ...data,
        [key]: value,
      }));
      setIsEnabled(false);
    };
  
    const toggleTodo = (item, index) => {
      navigation.navigate("Tổng khu vực chưa checklist", {
        Date: item.Ngay,
        ID_Calv: item.ID_Calv,
      });
    };
  
  
    const fetchData = async (filter, reset = false, refresh = false) => {
      if (isLoading) return; // Ngăn gọi API khi đang tải hoặc không còn dữ liệu
  
      setIsLoading(true);
      try {
        const currentPage = reset || refresh ? 0 : page;
        const res = await axios.get(
          `${BASE_URL}/tb_checklistc/day?page=${currentPage}&limit=${numberOfItemsPerPage}
          &khoi=${filter.ID_KhoiCV}&ca=${filter.ID_Calv}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`,
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
  
    useEffect(() => {
      fetchData(filters); // Gọi API lần đầu với filters
    }, [page]); // Mỗi lần `page` thay đổi sẽ gọi lại fetchData
  
    const handleRefresh = () => {
      setData([]); // Xóa dữ liệu hiện tại
      setPage(0); // Đặt lại trang
      setHasMoreData(true); // Cho phép tải thêm dữ liệu
      setIsRefreshing(true); // Hiển thị biểu tượng làm mới
  
      // Khởi tạo bộ lọc mới (ví dụ với giá trị mặc định)
      const filterReset = {
        fromDate: startOfMonth,
        toDate: endOfMonth,
        ID_Calv: null,
        ID_KhoiCV: null,
      };
      handleClearCache();
  
      // Gọi API để tải dữ liệu mới
      fetchData(filterReset, true, true);
    };
  

    const handleLoadMore = () => {
      if (data.length < 5 || isLoading) { return; }
      if (hasMoreData && !isLoading) {
        setPage((prevPage) => prevPage + 1); // Tăng trang lên 1
      }
    };
  
    const renderFooter = () => {
      if (!isLoading) return null;
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    };
  
    const toggleSwitch = (isEnabled) => {
      setIsEnabled(!isEnabled);
      if (isEnabled === false) {
        handleClearCache();
      }
    };
  
    const handleClearCache = () => {
      setFilters({
        fromDate: startOfMonth,
        toDate: endOfMonth,
        ID_Calv: null,
        ID_KhoiCV: null,
      });
      setSelectedKhoiCV(null);
      setFilteredCalv(ent_calv);
    };
  
    useEffect(() => {
      const backAction = () => {
        if (isBottomSheetOpen) {
          handlePresentModalClose();
          return true;
        }
        return false;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, [isBottomSheetOpen]);
  
    const handleSheetChanges = useCallback((index) => {
      setIsBottomSheetOpen(index !== -1);
      setOpacity(index === -1 ? 1 : 0.2);
    }, []);
  
    const handlePresentModalPress2 = useCallback(() => {
      setOpacity(0.2);
      bottomSheetModalRef?.current.expand();
      setIsBottomSheetOpen(true);
    }, []);
  
    const handlePresentModalClose = useCallback(() => {
      setOpacity(1);
      setIsBottomSheetOpen(false);
      bottomSheetModalRef?.current?.close();
    }, []);
  
    const decimalNumber = (number) => {
      if (number < 10 && number > 0) return `0${number}`;
      if (number === 0) return `0`;
      return number;
    };
  
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <View
            style={{ flex: 1, opacity: opacity }}
            pointerEvents={isBottomSheetOpen || visibleBottom ? "none" : "auto"}
          >
            {isLoading ? (
              <ActivityIndicator
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                size="large"
                color={COLORS.bg_white}
              ></ActivityIndicator>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between", // Điều chỉnh khoảng cách giữa các phần tử
                    alignItems: "center", // Canh giữa các phần tử theo trục dọc
                    paddingHorizontal: 20,
                  }}
                >
                  {/* Text hiển thị số lượng */}
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Số lượng: {decimalNumber(data?.length)}
                  </Text>
  
                  {/* Button lọc dữ liệu */}
                  <TouchableOpacity
                    onPress={handlePresentModalPress2}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={require("../../../assets/icons/filter_icon.png")}
                      resizeMode="contain"
                      style={{ height: 24, width: 24 }}
                    />
                    <Text allowFontScaling={false} style={styles.text}>
                      Lọc dữ liệu
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  ref={flatListRef}
                  horizontal={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  style={{ margin: 10 }}
                  data={data}
                  renderItem={({ item, index }) => (
                    <ItemTracuuCa
                      key={index}
                      item={item}
                      toggleTodo={toggleTodo}
                      newActionCheckList={newActionCheckList}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEventThrottle={16}
                  onEndReached={handleLoadMore} // Tải thêm khi cuộn đến cuối
                  onEndReachedThreshold={0.95} // Ngưỡng tải thêm (50% cuối màn hình)
                  ListFooterComponent={renderFooter} // Hiển thị loader khi tải thêm
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={handleRefresh}
                    />
                  }
                />
              </>
            )}
          </View>
  
          <BottomSheet
            ref={bottomSheetModalRef}
            index={isBottomSheetOpen ? 1 : -1}
            snapPoints={user?.ID_KhoiCV ? snapPoints1 : snapPoints2}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            enableDynamicSizing={false}
            onClose={handlePresentModalClose}
          >
            <BottomSheetView style={styles.contentContainer}>
              <ModalTraCuu
                handleChangeFilters={handleChangeFilters}
                filters={filters}
                setVisibleBottom={setVisibleBottom}
                setOpacity={setOpacity}
                toggleDatePicker={toggleDatePicker}
                isDatePickerVisible={isDatePickerVisible}
                setIsEnabled={setIsEnabled}
                toggleSwitch={toggleSwitch}
                isEnabled={isEnabled}
                fetchData={fetchData}
                handlePresentModalClose={handlePresentModalClose}
                ent_khoicv={ent_khoicv}
                ent_calv={ent_calv}
                user={user}
                handleKhoiSelection={handleKhoiSelection}
                filteredCalv={filteredCalv}
              />
            </BottomSheetView>
          </BottomSheet>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    );
  };
  
  export default DanhmucTraCuuCa;
  
  const styles = StyleSheet.create({
    container: {
      margin: 12,
      flex: 1,
    },
    danhmuc: {
      fontSize: 25,
      fontWeight: "700",
      color: "white",
    },
    text: { fontSize: 15, color: "white", fontWeight: "600" },
    textModal: { fontSize: 15, color: "black", fontWeight: "600" },
    button: {
      backgroundColor: COLORS.color_bg,
      width: 65,
      height: 65,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonImage: {
      flexDirection: "row",
      backgroundColor: COLORS.bg_button,
      alignContent: "center",
      justifyContent: "center",
      borderRadius: 12,
      marginTop: 10,
    },
    textImage: {
      padding: 12,
      color: "white",
      fontWeight: "700",
      fontSize: 16,
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
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height: SIZES.height * 0.7,
      width: SIZES.width * 0.85,
    },
    modalText: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      paddingVertical: 10,
    },
  });
  