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
import { DataTable } from "react-native-paper";
import { COLORS, SIZES } from "../../constants/theme";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import ModalThongke from "../../components/Modal/ModalThongke";
import DanhmucThongKe from "./DanhmucThongKe";
import axiosClient from "../../api/axiosClient";
import ModalBottomSheet from "../../components/Modal/ModalBottomSheet";
import ItemCaChecklist from "../../components/Item/ItemCaChecklist";
import adjust from "../../adjust";

const numberOfItemsPerPageList = [20, 30, 50];

const DanhmucTraCuu = ({ setOpacity, opacity, navigation }) => {
  const dispath = useDispatch();
  const { user, authToken } = useSelector((state) => state.authReducer);
  const { ent_khoicv, ent_calv } = useSelector((state) => state.entReducer);
  const { tb_checklistc } = useSelector((state) => state.tbReducer);
  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const snapPoints2 = useMemo(() => ["65%"], []);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const date = new Date();
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment(date).format("YYYY-MM-DD");
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    fromDate: false,
    toDate: false,
  });

  const [selectedKhoiCV, setSelectedKhoiCV] = useState(null);
  const [filteredCalv, setFilteredCalv] = useState(ent_calv);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [data, setData] = useState([]);
  const [visibleBottom, setVisibleBottom] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: startOfMonth,
    toDate: endOfMonth,
    ID_Calv: null,
  });

  useEffect(() => {
    setData(tb_checklistc?.data);
  }, [tb_checklistc]);

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

  const toggleTodo = async (item, index) => {
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

  const fetchData = async (filter) => {
    setIsLoading(true);
    await axios
      .post(
        BASE_URL +
          `/tb_checklistc/thong-ke?page=${page}&limit=${numberOfItemsPerPage}`,
        filter,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        //setDataTraCuu(res?.data?.data);
        setData(res?.data?.data);
        handlePresentModalClose();
        setVisibleBottom(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   fetchData(filters);
  // }, [page, numberOfItemsPerPage]);

  useEffect(() => {
    if (shouldFetch) {
      fetchData(filters);
      setShouldFetch(false);
    }
  }, [shouldFetch, page, numberOfItemsPerPage]);

  const toggleSwitch = (isEnabled) => {
    setIsEnabled(!isEnabled);
    if (isEnabled === false) {
      setFilters({
        fromDate: startOfMonth,
        toDate: endOfMonth,
        ID_Toanha: null,
        ID_Khuvuc: null,
        ID_Tang: null,
      });
    }
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
    if (user?.isError == 1) {
      setVisibleBottom(true);
    } else {
      setIsBottomSheetOpen(true);
    }
  }, []);

  const handlePresentModalClose = useCallback(() => {
    setOpacity(1);
    setIsBottomSheetOpen(false);
    bottomSheetModalRef?.current?.close();
  }, []);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

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
              <TouchableOpacity
                onPress={handlePresentModalPress2}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginStart: "auto",
                  marginRight: adjust(15)
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
              <FlatList
                horizontal={false}
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ margin: 10 }}
                data={data}
                renderItem={({ item, index }) => (
                  <ItemCaChecklist
                    key={index}
                    item={item}
                    toggleTodo={toggleTodo}
                    newActionCheckList={newActionCheckList}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                scrollEventThrottle={16}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              />
              {/* <DanhmucThongKe
                handlePresentModalPress2={handlePresentModalPress2}
                data={data}
                navigation={navigation}
              /> */}

              <ModalBottomSheet
                visible={visibleBottom}
                setVisible={setVisibleBottom}
                setOpacity={setOpacity}
              >
                <ModalThongke
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
              </ModalBottomSheet>
            </>
          )}
        </View>

        <BottomSheet
          ref={bottomSheetModalRef}
          index={isBottomSheetOpen ? 0 : -1}
          snapPoints={snapPoints2}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          onClose={handlePresentModalClose}
        >
          <BottomSheetView style={styles.contentContainer}>
            <ModalThongke
              handleChangeFilters={handleChangeFilters}
              filters={filters}
              toggleDatePicker={toggleDatePicker}
              setVisibleBottom={setVisibleBottom}
              setOpacity={setOpacity}
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

export default DanhmucTraCuu;

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
