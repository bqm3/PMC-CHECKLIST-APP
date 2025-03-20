import {
  Text,
  StyleSheet,
  View,
  BackHandler,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "../../constants/theme";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import ModalTraCuu from "../../components/Modal/ModalTracuu";
import ItemTracuuCa from "../../components/Item/ItemTracuuCa";


const dataFilter = {
  fromDate: moment().startOf("month").format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  ID_Calv: null,
  ID_KhoiCV: null,
};

const DanhmucTraCuuCa = ({ setOpacity, opacity, navigation, setIsLoading }) => {
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { ent_khoicv, ent_calv } = useSelector((state) => state.entReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["70%", "80%"], []);

  // const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    fromDate: false,
    toDate: false,
  });

  const [selectedKhoiCV, setSelectedKhoiCV] = useState(null);
  const [filteredCalv, setFilteredCalv] = useState(ent_calv || []);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(dataFilter);

  const currentFiltersString = useMemo(() => JSON.stringify(filters), [filters]);
  const [activeFilters, setActiveFilters] = useState(null);

  const handleKhoiSelection = useCallback(
    (selectedKhoi) => {
      setSelectedKhoiCV(selectedKhoi?.ID_KhoiCV || null);
      setFilteredCalv(ent_calv?.filter((ca) => ca?.ent_khoicv?.ID_KhoiCV === selectedKhoi?.ID_KhoiCV) || []);
    },
    [ent_calv]
  );

  const handleChangeFilters = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setIsEnabled(false);
  }, []);

  const toggleTodo = useCallback(
    (item) => {
      if (item?.Ngay && item?.ID_Calv) {
        navigation.navigate("Tổng khu vực chưa checklist", {
          Date: item.Ngay,
          ID_Calv: item.ID_Calv,
        });
      }
    },
    [navigation]
  );

  const toggleDatePicker = useCallback((key, isVisible) => {
    setDatePickerVisibility((prev) => ({ ...prev, [key]: isVisible }));
  }, []);

  const fetchData = useCallback(
    async (filter, isRefresh = false) => {
      if (!isRefresh) setIsLoading(true);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
  
        const res = await axios.get(
          `${BASE_URL}/tb_checklistc/day?khoi=${filter.ID_KhoiCV || ""}&ca=${filter.ID_Calv || ""}&fromDate=${filter.fromDate}&toDate=${filter.toDate}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
            signal: controller.signal,
          }
        );
  
        clearTimeout(timeoutId);
        setData(res?.data?.data || []);
        setActiveFilters(currentFiltersString);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [authToken, currentFiltersString, isRefreshing]
  );

  useEffect(() => {
    fetchData(filters);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(dataFilter, true);
  }, [fetchData, dataFilter]);

  const toggleSwitch = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (isBottomSheetOpen) {
        handlePresentModalClose();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isBottomSheetOpen]);

  const handleSheetChanges = useCallback(
    (index) => {
      setIsBottomSheetOpen(index !== -1);
      setOpacity(index === -1 ? 1 : 0.2);
    },
    [setOpacity]
  );

  const handlePresentModalPress = useCallback(() => {
    setOpacity(0.2);
    bottomSheetModalRef?.current?.expand();
    setIsBottomSheetOpen(true);
  }, [setOpacity]);

  const handlePresentModalClose = useCallback(() => {
    setOpacity(1);
    setIsBottomSheetOpen(false);
    bottomSheetModalRef?.current?.close();
  }, [setOpacity]);

  const renderItem = useCallback(({ item }) => <ItemTracuuCa item={item || {}} toggleTodo={toggleTodo} />, [toggleTodo]);

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu</Text>
      </View>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.flex1}>
        <View style={[styles.container, { opacity }]}>
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.countText}>Số lượng: {data?.length || 0}</Text>
              <TouchableOpacity onPress={handlePresentModalPress} style={styles.filterButton}>
                <Image source={require("../../../assets/icons/filter_icon.png")} style={styles.filterIcon} />
                <Text style={styles.text}>Lọc dữ liệu</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={data || []}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              ListEmptyComponent={renderEmptyComponent}
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
              contentContainerStyle={styles.listContentContainer}
              style={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />

          </>
          {/* )} */}
        </View>

        <BottomSheet
          ref={bottomSheetModalRef}
          index={isBottomSheetOpen ? 0 : -1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
        >
          <BottomSheetView style={styles.contentContainer}>
            <ModalTraCuu
              handleChangeFilters={handleChangeFilters}
              filters={filters}
              toggleDatePicker={toggleDatePicker}
              isDatePickerVisible={isDatePickerVisible}
              setOpacity={setOpacity}
              setIsEnabled={setIsEnabled}
              toggleSwitch={toggleSwitch}
              isEnabled={isEnabled}
              fetchData={fetchData}
              handlePresentModalClose={handlePresentModalClose}
              ent_khoicv={ent_khoicv || []}
              ent_calv={ent_calv || []}
              user={user || {}}
              handleKhoiSelection={handleKhoiSelection}
              filteredCalv={filteredCalv}
            />
          </BottomSheetView>
        </BottomSheet>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default React.memo(DanhmucTraCuuCa);

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  countText: { fontSize: 16, color: "white", fontWeight: "600" },
  filterButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  filterIcon: { height: 24, width: 24 },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
  listContainer: { margin: 10 },
  listContentContainer: { flexGrow: 1, paddingBottom: 20 },
  contentContainer: { flex: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "white",
  },
});
