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
import { AntDesign, Ionicons,Feather } from "@expo/vector-icons";
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
import ActionCheckbox from "../../components/ActiveCheckbox";
import ActionCheckboxAll from "../../components/ActiveCheckboxAll";
import ModalChecklistInfo from "../../components/Modal/ModalChecklistInfo";
import ModalChecklistFilter from "../../components/Modal/ModalChecklistFilter";

const numberOfItemsPerPageList = [10, 15, 20];

const headerList = [
  {
    til: "Tên checklist",
    width: 150,
  },
  {
    til: "Giá trị nhận",
    width: 120,
  },
  {
    til: "Tòa nhà",
    width: 120,
  },
  {
    til: "Tầng",
    width: 120,
  },
  {
    til: "Khu vực",
    width: 120,
  },
  {
    til: "Bộ phận",
    width: 120,
  },

  {
    til: "Giá trị định danh",
    width: 150,
  },
  {
    til: "Mã checklist",
    width: 100,
  },
  {
    til: "Số thứ tự",
    width: 100,
  },
];

const DanhmucChecklist = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_tang, ent_khuvuc, ent_checklist, ent_khoicv, ent_toanha } =
    useSelector((state) => state.entReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);

  const [listChecklist, setListChecklist] = useState([]);
  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleFilter, setModalVisibleFilter] = useState(false);
  const [isCheckbox, setIsCheckbox] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    id_checklist: null,
  });

  const [isFilterData, setIsFilterData] = useState({
    ID_Khuvuc: null,
    ID_Tang: null,
  });

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [1, "20%", "60%", "90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );

  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, listChecklist?.length);
  const [dataInput, setDataInput] = useState({
    ID_Khuvuc: null,
    ID_Tang: null,
    Sothutu: "",
    Maso: "",
    MaQrCode: "",
    Checklist: "",
    Giatridinhdanh: "",
    Giatrinhan: "",
    Sothutu: "",
  });

  const [dataCheckKhuvuc, setDataCheckKhuvuc] = useState({
    ID_KhoiCV: null,
    ID_Toanha: null,
  });
  const [filters, setFilters] = useState({
    ID_Tang: false,
    ID_Khuvuc: false,
  });
  
  const [isEnabled, setIsEnabled] = useState(true);

  const [status, setStatus] = useState(false);

  const init_checklist = async () => {
    await dispath(ent_checklist_get());
  };

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };
  useEffect(() => {
    setListChecklist(ent_checklist);
  }, [ent_checklist]);

  const init_tang = async () => {
    await dispath(ent_tang_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  useEffect(() => {
    init_checklist();
    init_khuvuc();
    init_tang();
    init_khoicv();
    init_toanha();
  }, []);

  const toggleSwitch = (isEnabled) => {
    setIsEnabled(!isEnabled);
    if (isEnabled === false) {
      setIsFilterData({
        ID_Tang: null,
        ID_Khuvuc: null,
      });
      setFilters({
        ID_Tang: false,
        ID_Khuvuc: false,
      });
    }
  };

  const handleCheckbox = (key, value) => {
    setFilters((data) => ({
      ...data,
      [key]: value,
    }));
    setIsEnabled(false);
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

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const toggleTodo = async () => {
    if (
      newActionCheckList.length > 0 &&
      newActionCheckList.length < listChecklist.length
    ) {
      setNewActionCheckList(listChecklist);
      setStatus(true);
    } else if (newActionCheckList.length === 0) {
      setNewActionCheckList(listChecklist);
      setStatus(true);
    } else {
      setNewActionCheckList([]);
      setStatus(false);
    }
  };

  const handleToggle = async (data) => {
    setIsCheckbox(true);
    const isExistIndex = newActionCheckList.findIndex(
      (existingItem) => existingItem.ID_Checklist === data.ID_Checklist
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionCheckList((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionCheckList((prevArray) => [...prevArray, data]);
    }
  };

  const handleToggleModal = (isCheck, data, opacity) => {
    setDataModal(data);
    setModalVisible(isCheck);
    setOpacity(opacity);
  };

  const [dataKhuVuc, setDataKhuVuc] = useState({});

  const [activeKhuVuc, setActiveKhuvuc] = useState(false);

  const handleChangeTextKhuVuc = (key, value) => {
    setDataCheckKhuvuc((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleDataKhuvuc = async (data) => {
    await axios
      .post(BASE_URL + "/ent_khuvuc/filter", data, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((res) => {
        setDataKhuVuc(res.data.data);
        setActiveKhuvuc(true);
      })
      .then((err) => {
        console.log("err", err);
      });
  };

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeFilter = (key, value) => {
    setIsFilterData((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (dataInput.Checklist === "") {
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
        ID_Khuvuc: dataInput.ID_Khuvuc,
        ID_Tang: dataInput.ID_Tang,
        Sothutu: dataInput.Sothutu,
        Maso: dataInput.Maso,
        MaQrCode: dataInput.MaQrCode,
        Checklist: dataInput.Checklist,
        Giatridinhdanh: dataInput.Giatridinhdanh,
        Giatrinhan: dataInput.Giatrinhan,
      };
      await axios
        .post(BASE_URL + "/ent_checklist/create", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_checklist();
          handleAdd();
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

  const handleEditEnt = async (data) => {
    handlePresentModalPress();
    setDataInput({
      ID_Khuvuc: data.ID_Khuvuc,
      ID_Tang: data.ID_Tang,
      Sothutu: data.Sothutu,
      Maso: data.Maso,
      MaQrCode: data.MaQrCode,
      Checklist: data.Checklist,
      Giatridinhdanh: data.Giatridinhdanh,
      Giatrinhan: data.Giatrinhan,
      Sothutu: data.Sothutu,
    });

    setDataCheckKhuvuc({
      ID_KhoiCV: data.ent_khuvuc?.ID_KhoiCV,
      ID_Toanha: data.ent_khuvuc?.ID_Toanha,
    });

    handleDataKhuvuc({
      ID_KhoiCV: data.ent_khuvuc?.ID_KhoiCV,
      ID_Toanha: data.ent_khuvuc?.ID_Toanha,
    });

    setIsCheckUpdate({
      check: true,
      ID_CheckList: data.ID_Checklist,
    });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.Checklist === "" || dataInput.Giatrinhan === "") {
      Alert.alert("PMC Thông báo", "Thiêu thông tin checklist", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Khuvuc: dataInput.ID_Khuvuc,
        ID_Tang: dataInput.ID_Tang,
        Sothutu: dataInput.Sothutu,
        Maso: dataInput.Maso,
        MaQrCode: dataInput.MaQrCode,
        Checklist: dataInput.Checklist,
        Giatridinhdanh: dataInput.Giatridinhdanh,
        Giatrinhan: dataInput.Giatrinhan,
        Sothutu: dataInput.Sothutu,
      };

      await axios
        .put(BASE_URL + `/ent_checklist/update/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_checklist();
          handleAdd();
          handleCloseModal();
          setNewActionCheckList([]);
          setStatus(false);
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
          console.log("err", err);
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

  const handleAlertDelete = async (data) => {
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa danh mục checklist", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xác nhận", onPress: () => handlePushDataDelete(data) },
    ]);
  };

  const handlePushDataDelete = async (data) => {
    await axios
      .put(BASE_URL + `/ent_checklist/delete-all/${data}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        handleAdd();
        init_checklist();
        setNewActionCheckList([])
        // handleCloseModal();
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
        Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      });
  };

  const handleFilterData = async (isModal, opacity) => {
    // setIsFilterData(false)
    setModalVisibleFilter(isModal);
    setOpacity(opacity);
    setIsCheckbox(false);
  };

  const handlePushDataCheck = async (isCheck) => {
    if (isCheck === true) {
      setListChecklist(ent_checklist);
      handleFilterData(false, 1);
    } else {
      await axios
        .post(BASE_URL + "/ent_checklist/filter", isFilterData, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((res) => {
          setListChecklist(res.data.data);
          handleFilterData(false, 1);
        })
        .then((err) => {
          console.log("err", err);
        });
    }
  };

  const handleAdd = () => {
    setDataInput({
      ID_Khuvuc: null,
      ID_Tang: null,
      Sothutu: "",
      Maso: "",
      MaQrCode: "",
      Checklist: "",
      Giatridinhdanh: "",
      Giatrinhan: "",
    });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1 || index === 0) {
      setOpacity(1);
    } else {
      setOpacity(0.5);
    }
  }, []);

  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  const decimalNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  };

  const _renderItem = ({ item, index }) => {
    const isExistIndex = newActionCheckList?.find(
      (existingItem) => existingItem?.ID_Checklist === item?.ID_Checklist
    );
    return (
      <TouchableHighlight onPress={() => handleToggle(item)}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            backgroundColor: isExistIndex ? COLORS.bg_button : "white",
          }}
          key={index}
        >
          <DataTable.Cell style={{ width: 50 }}>
            <ActionCheckbox
              item={item}
              index={index}
              handleToggle={handleToggle}
              newActionCheckList={newActionCheckList}
              // active={}
            />
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 150 }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={3}
            >
              {item?.Checklist}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 120 }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Giatrinhan}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_khuvuc?.ent_toanha?.Toanha}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_tang?.Tentang}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {" "}
              {item?.ent_khuvuc?.Tenkhuvuc}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 120 }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_khuvuc?.ent_khoicv?.KhoiCV}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150 }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Giatridinhdanh}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Maso}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Sothutu}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableHighlight>
    );
  };

  var arrayId = newActionCheckList?.map((item) => item?.ID_Checklist);
  let scrollRef = React.useRef(null);

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
                <Text style={styles.danhmuc}>Danh mục Checklist</Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "600",
                    paddingBottom: 20,
                  }}
                >
                  Số lượng: {decimalNumber(listChecklist?.length)}
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
                    {listChecklist?.length > 0 ? (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "space-between",
                            // flex: 1, backgroundColor: 'red'
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
                            icon={
                              <Ionicons name="add" size={24} color="white" />
                            }
                            onPress={handlePresentModalPress}
                          />
                        </View>

                        <ScrollView
                          style={{ flex: 1, marginBottom: 20, marginTop: 20 }}
                          ref={(it) => (scrollRef.current = it)}
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
                                <DataTable.Title
                                  style={{
                                    alignItems: "center",
                                    width: 50,
                                  }}
                                >
                                  <ActionCheckboxAll
                                    toggleTodo={toggleTodo}
                                    status={status}
                                  />
                                </DataTable.Title>
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
                                            paddingLeft: 4,
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

                              {listChecklist && listChecklist?.length > 0 && (
                                <FlatList
                                  keyExtractor={(item, index) =>
                                    `${item?.ID_Khuvuc}_${index}`
                                  }
                                  scrollEnabled={false}
                                  data={listChecklist?.slice(
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
                                  listChecklist?.length / numberOfItemsPerPage
                                )}
                                onPageChange={(page) => setPage(page)}
                                label={`${from + 1}-${to} đến ${
                                  listChecklist?.length
                                }`}
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
              index={3}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={styles.contentContainer}>
                <ModalChecklist
                  ent_tang={ent_tang}
                  ent_khuvuc={ent_khuvuc}
                  ent_khoicv={ent_khoicv}
                  ent_toanha={ent_toanha}
                  handleChangeText={handleChangeText}
                  handleDataKhuvuc={handleDataKhuvuc}
                  handleChangeTextKhuVuc={handleChangeTextKhuVuc}
                  dataCheckKhuvuc={dataCheckKhuvuc}
                  dataInput={dataInput}
                  handlePushDataSave={handlePushDataSave}
                  isCheckUpdate={isCheckUpdate}
                  handlePushDataEdit={handlePushDataEdit}
                  activeKhuVuc={activeKhuVuc}
                  dataKhuVuc={dataKhuVuc}
                />
              </BottomSheetScrollView>
            </BottomSheetModal>

            {isCheckbox === true && newActionCheckList?.length > 0 && (
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
                {newActionCheckList?.length === 1 && (
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleEditEnt(newActionCheckList[0])}
                    >
                      <Feather name="edit" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        handleToggleModal(true, newActionCheckList[0], 0.2)
                      }
                    >
                      <Feather name="eye" size={24} color="white" />
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAlertDelete(arrayId)}
                >
                  <Feather name="trash-2" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Thông tin checlist chi tiết
                  </Text>
                  <ModalChecklistInfo
                    dataModal={dataModal}
                    handleToggleModal={handleToggleModal}
                  />
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleFilter}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleFilter(!modalVisibleFilter);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Tìm kiếm thông tin checklist
                  </Text>
                  <ModalChecklistFilter
                    dataModal={dataModal}
                    setModalVisibleFilter={setModalVisibleFilter}
                    isFilterData={isFilterData}
                    setIsFilterData={setIsFilterData}
                    handleFilterData={handleFilterData}
                    ent_khuvuc={ent_khuvuc}
                    ent_toanha={ent_toanha}
                    ent_khoicv={ent_khoicv}
                    ent_tang={ent_tang}
                    handleChangeFilter={handleChangeFilter}
                    handlePushDataCheck={handlePushDataCheck}
                    toggleSwitch={toggleSwitch}
                    handleCheckbox={handleCheckbox}
                    filters={filters}
                    isEnabled={isEnabled}
                  />
                </View>
              </View>
            </Modal>
          </ImageBackground>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DanhmucChecklist;

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
