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
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import {
  ent_checklist_get,
  ent_tang_get,
  ent_khuvuc_get,
  ent_toanha_get,
  ent_khoicv_get,
} from "../../redux/actions/entActions";
import ModalChecklist from "../../components/Modal/ModalChecklist";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import ModalTracuu from "../../components/Modal/ModalTracuu";

const numberOfItemsPerPageList = [10, 15, 20];

const headerList = [
  {
    til: "Ngày kiểm tra",
    width: 120,
  },
  {
    til: "Checklist",
    width: 200,
  },
  {
    til: "Tên tòa nhà",
    width: 150,
  },
  {
    til: "Thuộc tầng",
    width: 150,
  },
  {
    til: "Thuộc khu vực",
    width: 150,
  },
  {
    til: "Thuộc bộ phận",
    width: 150,
  },
  {
    til: "Ca đầu",
    width: 150,
  },

  {
    til: "Nhân viên",
    width: 150,
  },
  // {
  //   til: "Nhân viên",
  //   width: 100,
  // },
];

const DanhmucTracuu = () => {
  const dispath = useDispatch();
  const { ent_tang, ent_khuvuc, ent_checklist, ent_khoicv, ent_toanha } =
    useSelector((state) => state.entReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);

  const [data, setData] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    firstDate: false,
    lastDate: false
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleFilter, setModalVisibleFilter] = useState(false);
  const [isCheckbox, setIsCheckbox] = useState(false);

  let scrollRef = React.useRef(null);

  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, data?.length);

  // const moment = require('moment');

  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().format("YYYY-MM-DD");

  const [filters, setFilters] = useState({
    firstDate: startOfMonth,
    lastDate: endOfMonth,
    ID_Toanha: null,
    ID_Khuvuc: null,
    ID_Bophan: null,
    ID_Tang: null,
  });

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_tang = async () => {
    await dispath(ent_tang_get());
  };

  useEffect(() => {
    init_khuvuc();
    init_toanha();
    init_khoicv();
    init_tang()
  }, []);

  const toggleDatePicker = (key, isCheck) => {
    setDatePickerVisibility((data) => ({
      ...data,
      [key]: isCheck,
    }));
  };

  function formatDate(inputDate) {
    // Extract day, month, and year from the input date
    var dateObject = new Date(inputDate);
    var day = dateObject.getDate();
    var month = dateObject.getMonth() + 1; // Add 1 because January is 0
    var year = dateObject.getFullYear();
    
    // Pad day and month with leading zeros if necessary
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    
    // Return the formatted date
    return year + '-' + month + '-' + day;
}

  const handleConfirm = (key, date) => {
    const dateF =  formatDate(date)
    // handleChangeText(key, dateF);
    setDatePickerVisibility(false);
  };

  const handleChangeFilters = (key, value) => {
    console.log('date',value)
    setFilters((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const fetchData = async (filter) => {
    await axios
      .get(BASE_URL + "/tb_checklistchitiet", {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const _renderItem = ({ item, index }) => {
    // const isExistIndex = newActionCheckList?.find(
    //   (existingItem) => existingItem?.ID_Checklist === item?.ID_Checklist
    // );
    return (
      <TouchableHighlight key={index}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            // backgroundColor: isExistIndex ? COLORS.bg_button : "white",
          }}
        >
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {moment(item?.tb_checklistc?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 200, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_checklist?.Checklist}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_checklist?.ent_khuvuc?.ent_toanha?.Toanha}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_checklist?.ent_tang?.Tentang}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_checklist?.ent_khuvuc?.Tenkhuvuc}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {" "}
              {item?.tb_checklistc?.ent_khoicv?.KhoiCV}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.tb_checklistc?.ent_calv?.Tenca}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              // style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.tb_checklistc?.ent_giamsat?.Hoten}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableHighlight>
    );
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1 || index === 0) {
      setOpacity(1);
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleFilterData = async (isModal, opacity) => {
    // setIsFilterData(false)
    setModalVisibleFilter(isModal);
    setOpacity(opacity);
    setIsCheckbox(false);
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);

  const decimalNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BottomSheetModalProvider>
          <ImageBackground
            source={require("../../../assets/bg.png")}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                opacity: opacity,
              }}
            >
              <View style={styles.container}>
                <Text style={styles.danhmuc}>Tra cứu</Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "600",
                    paddingBottom: 20,
                  }}
                >
                  Số lượng: {decimalNumber(data.length)}
                </Text>
                {isLoading === true ? (
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
                    {1 > 0 ? (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "left",
                            // flex: 1, backgroundColor: 'red'
                          }}
                        >
                          <TouchableOpacity
                            onPress={handlePresentModalPress}
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
                            <Text style={styles.text}>Lọc dữ liệu</Text>
                          </TouchableOpacity>
                        </View>

                        <ScrollView
                          style={{ flex: 1, marginBottom: 20, marginTop: 20 }}
                          // ref={(it) => (scrollRef.current = it)}
                          // onContentSizeChange={() =>
                          //   scrollRef.current?.scrollToEnd({ animated: false })
                          // }
                        >
                          <DataTable
                            style={{
                              backgroundColor: "white",
                              borderRadius: 8,
                            }}
                          >
                            <ScrollView
                              horizontal
                              contentContainerStyle={{
                                flexDirection: "column",
                              }}
                            >
                              <DataTable.Header
                                style={{
                                  backgroundColor: "#eeeeee",
                                  borderTopRightRadius: 8,
                                  borderTopLeftRadius: 8,
                                }}
                              >
                                {headerList &&
                                  headerList.map((item, index) => {
                                    return (
                                      <>
                                        <DataTable.Title
                                          key={index}
                                          style={{
                                            width: item?.width,
                                            borderRightWidth:
                                              index === headerList.length - 1
                                                ? 0
                                                : 2,
                                            borderRightColor: "white",
                                            justifyContent: "center",
                                          }}
                                          numberOfLines={2}
                                        >
                                          <Text
                                            style={[
                                              styles.text,
                                              { color: "black" },
                                            ]}
                                          >
                                            {item?.til}
                                          </Text>
                                        </DataTable.Title>
                                      </>
                                    );
                                  })}
                              </DataTable.Header>

                              {data && data?.length > 0 && (
                                <FlatList
                                  keyExtractor={(item, index) =>
                                    `${item?.ID_ChecklistC}_${index}`
                                  }
                                  scrollEnabled={false}
                                  data={data?.slice(
                                    page * numberOfItemsPerPage,
                                    page * numberOfItemsPerPage +
                                      numberOfItemsPerPage
                                  )}
                                  renderItem={_renderItem}
                                />
                              )}
                              <DataTable.Pagination
                                style={{ justifyContent: "flex-start" }}
                                page={page}
                                numberOfPages={Math.ceil(
                                  data?.length / numberOfItemsPerPage
                                )}
                                onPageChange={(page) => setPage(page)}
                                label={`${from + 1}-${to} đến ${data?.length}`}
                                showFastPaginationControls
                                numberOfItemsPerPageList={
                                  numberOfItemsPerPageList
                                }
                                numberOfItemsPerPage={numberOfItemsPerPage}
                                onItemsPerPageChange={onItemsPerPageChange}
                                selectPageDropdownLabel={"Hàng trên mỗi trang"}
                              />
                            </ScrollView>
                          </DataTable>
                        </ScrollView>
                      </>
                    ) : (
                      <>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 120,
                          }}
                        >
                          <Image
                            source={require("../../../assets/icons/delete_bg.png")}
                            resizeMode="contain"
                            style={{ height: 120, width: 120 }}
                          />
                          <Text
                            style={[styles.danhmuc, { paddingVertical: 10 }]}
                          >
                            Bạn chưa thêm dữ liệu nào
                          </Text>
                          <ButtonChecklist
                            text={"Thêm mới"}
                            width={"auto"}
                            color={COLORS.bg_button}
                            onPress={handlePresentModalPress}
                          />
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
            </View>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={styles.contentContainer}>
                <ModalTracuu
                  handleChangeFilters={handleChangeFilters}
                  filters={filters}
                  handleConfirm={handleConfirm}
                  toggleDatePicker={toggleDatePicker}
                  isDatePickerVisible={isDatePickerVisible}
                  ent_toanha={ent_toanha}
                  ent_tang={ent_tang}
                  ent_khuvuc={ent_khuvuc}
                  ent_khoicv={ent_khoicv}
                 
                />
              </BottomSheetScrollView>
            </BottomSheetModal>
          </ImageBackground>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DanhmucTracuu;

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
    // paddingVertical: 40,
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
});
