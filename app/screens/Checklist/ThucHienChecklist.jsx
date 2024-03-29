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
  ent_calv_get,
  ent_giamsat_get,
} from "../../redux/actions/entActions";
import { tb_checklistc_get } from "../../redux/actions/tbActions";
import ModalChecklist from "../../components/Modal/ModalChecklist";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import ModalChecklistC from "../../components/Modal/ModalChecklistC";

const numberOfItemsPerPageList = [10, 15, 20];

const headerList = [
  {
    til: "Ngày",
    width: 120,
  },
  {
    til: "Tên ca",
    width: 150,
  },
  {
    til: "Khối công việc",
    width: 150,
  },
  {
    til: "Nhân viên",
    width: 150,
  },
  {
    til: "Giờ bắt đầu",
    width: 150,
  },
  {
    til: "Giờ kết thúc",
    width: 150,
  },
  {
    til: "Tình trạng",
    width: 150,
  },
  {
    til: "Ghi chú",
    width: 200,
  },
];

const ThucHienChecklist = ({ navigation }) => {
  const ref = useRef(null);
  const dispath = useDispatch();
  const {
    ent_giamsat,
    ent_calv
  } = useSelector((state) => state.entReducer);
  const { tb_checklistc } = useSelector((state) => state.tbReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);

  const date = new Date();
  const dateDay = moment(date).format('YYYY-MM-DD');
  const dateHour = moment(date).format('LTS');

  const [data, setData] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, data?.length);

  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dataInput, setDataInput] = useState({
    dateDay: dateDay,
    dateHour: dateHour,
    Calv: null,
    ID_Giamsat: null,
    ID_Duan: user?.ID_Duan
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); //

  
  useEffect(() => {
    setData(tb_checklistc);
  }, [tb_checklistc]);

  const init_ca = async () => {
    await dispath(ent_calv_get());
  };

  const int_giamsat = async () => {
    await dispath(ent_giamsat_get());
  };

  const int_checklistc = async () => {
    await dispath(tb_checklistc_get());
  };

  useEffect(() => {
    init_ca()
    int_giamsat()
    int_checklistc();
  }, []);

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

  

  const handlePushDataSave = async () => {
    if (dataInput.ID_Calv === null || dataInput.ID_Giamsat === null) {
      Alert.alert("PMC Thông báo", "Thiêu thông tin Checklist", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Calv: dataInput.Calv.ID_Calv,
        ID_Giamsat: dataInput.ID_Giamsat,
        ID_Duan: dataInput.ID_Duan,
        ID_KhoiCV: dataInput.Calv.ent_khoicv.ID_Khoi,
        Ngay: dataInput.dateDay,
        Giobd: dataInput.dateHour,
       
      };
      await axios
        .post(BASE_URL + "/tb_checklistc/create-first", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          handleAdd();
          int_checklistc();
          handleCloseModal();

          Alert.alert("PMC Thông báo", response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log('err',err)
          Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        });
    }
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
    } else {
      setOpacity(0.3);
    }
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);

  const handleAdd = () => {
    setDataInput({
      dateDay: dateDay,
      dateHour: dateHour,
      Calv: null,
      ID_Giamsat: null,
      ID_Duan: user?.ID_Duan
    });
  };

  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  const handleChecklistDetail = (id) => {
    navigation.navigate("Chi tiết Checklist", {
      ID_ChecklistC: id,

    })
  }

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const _renderItem = ({ item, index }) => {
    const isExistIndex = newActionCheckList?.find(
      (existingItem) => existingItem?.ID_ChecklistC === item?.ID_ChecklistC
    );
    return (
      <TouchableHighlight key={index} onPress={() => toggleTodo(item)}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            backgroundColor: isExistIndex ? COLORS.bg_button : "white",
          }}
        >
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {moment(item?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_calv?.Tenca}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_khoicv?.KhoiCV}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_giamsat?.Hoten}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Giobd}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Giokt}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {" "}
              {item?.Tinhtrang === 1 ? "Xong" : ""}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 200, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={3}
            >
              {item?.Ghichu}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableHighlight>
    );
  };

  return (
    <>
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleFilterData(true, 0.5)}
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
                    <ButtonChecklist
                      text={"Thêm mới"}
                      width={"auto"}
                      color={COLORS.bg_button}
                      icon={<Ionicons name="add" size={24} color="white" />}
                      onPress={handlePresentModalPress}
                    />
                  </View>
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
                      {data && data?.length > 0 ? (
                        <>
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
                                  label={`${from + 1}-${to} đến ${
                                    data?.length
                                  }`}
                                  showFastPaginationControls
                                  numberOfItemsPerPageList={
                                    numberOfItemsPerPageList
                                  }
                                  numberOfItemsPerPage={numberOfItemsPerPage}
                                  onItemsPerPageChange={onItemsPerPageChange}
                                  selectPageDropdownLabel={
                                    "Hàng trên mỗi trang"
                                  }
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
                  <ModalChecklistC
                  ent_giamsat={ent_giamsat}
                  ent_calv={ent_calv}
                  dataInput={dataInput}
                  handleChangeText={handleChangeText}
                  handlePushDataSave={handlePushDataSave}
                  // handleDataKhuvuc={handleDataKhuvuc}
                  // handleChangeTextKhuVuc={handleChangeTextKhuVuc}
                  // dataCheckKhuvuc={dataCheckKhuvuc}
                  // dataInput={dataInput}
                  // handlePushDataSave={handlePushDataSave}
                  // isCheckUpdate={isCheckUpdate}
                  // handlePushDataEdit={handlePushDataEdit}
                  // activeKhuVuc={activeKhuVuc}
                  // dataKhuVuc={dataKhuVuc}
                  />
                </BottomSheetScrollView>
              </BottomSheetModal>

              {newActionCheckList?.length > 0 && (
                <View
                  style={{
                    width: 60,
                    position: "absolute",
                    right: 20,
                    bottom: 50,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {newActionCheckList[0]?.Tinhtrang === 0 && (
                    <>
                      <TouchableOpacity
                        style={[styles.button,{backgroundColor: COLORS.bg_red}]}
                        // onPress={() => handleEditEnt(newActionCheckList[0])}
                      >
                        <Feather name="lock" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => handleChecklistDetail(newActionCheckList[0]?.ID_ChecklistC)}
                      >
                        <Feather name="unlock" size={24} color="white" />
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.button}
                    // onPress={() =>
                    //   handleToggleModal(true, newActionCheckList[0], 0.2)
                    // }
                  >
                    <Feather name="eye" size={24} color="white" />
                  </TouchableOpacity>
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
    fontSize: 25,
    fontWeight: "700",
    color: "white",
    // paddingVertical: 40,
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
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
    // margin: 20,
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
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 10,
  },
});

export default ThucHienChecklist;
