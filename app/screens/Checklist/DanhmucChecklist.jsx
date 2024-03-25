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
  ActivityIndicator
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
import { AntDesign, Ionicons } from "@expo/vector-icons";
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

const numberOfItemsPerPageList = [2, 3, 4];

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

const dataTable = [
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "Xong",
    ghichu: "note note asdfdasf adfasfadf adfadasdf",
    giokt: "10:43 PM",
    ID: 1,
    giochup1: "10:43 PM",
    giochup2: "10:43 PM",
    giochup3: "10:43 PM",
    giochup4: "10:43 PM",
  },
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "",
    ghichu: "",
    giokt: "10:43 PM",
    ID: 2,
    giochup1: "",
    giochup2: "",
    giochup3: "",
    giochup4: "",
  },
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "Xong",
    ghichu: "",
    giokt: "10:43 PM",
    ID: 3,
    giochup1: "",
    giochup2: "",
    giochup3: "",
    giochup4: "",
  },
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "Xong",
    ghichu: "",
    giokt: "10:43 PM",
    ID: 4,
    giochup1: "",
    giochup2: "",
    giochup3: "",
    giochup4: "",
  },
];

const DanhmucChecklist = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_tang, ent_khuvuc, ent_checklist, ent_khoicv, ent_toanha } =
    useSelector((state) => state.entReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [listChecklist, setListChecklist] = useState([]);
  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    setIsLoading(true)
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
    }, 1000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // 

  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    id_checklist: null,
  });

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [1, "20%", "60%", "90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, dataTable.length);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const [dataInput, setDataInput] = useState({
    ID_Khuvuc: null,
    ID_Tang: null,
    Sothutu: "",
    Maso: "",
    MaQrCode: "",
    Checklist: "",
    Giatridinhdanh: "",
    Giatrinhan: "",
  });

  const [dataCheckKhuvuc, setDataCheckKhuvuc] = useState({
    ID_KhoiCV: null,
    ID_Toanha: null,
  });
  const [status, setStatus] = useState(false)
  const toggleTodo = async () => {
    if(newActionCheckList.length > 0 && newActionCheckList.length < listChecklist.length){
      setNewActionCheckList(listChecklist)
      setStatus(true)
    }else if(newActionCheckList.length ===0){
      setNewActionCheckList(listChecklist)
      setStatus(true)
    }else {
      setNewActionCheckList([])
      setStatus(false)
    }
  };

  const handleToggle = async (data) => {
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

  // useEffect(()=> {
  //   console.log('run')
  //   handleDataKhuvuc(dataCheckKhuvuc)
  // },[dataCheckKhuvuc])

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
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
      id_duan: data.ID_Duan,
      hoten: data.Hoten,
      gioitinh: data.Gioitinh,
      ngaysinh: data.Ngaysinh,
      sodienthoai: data.Sodienthoai,
      id_chucvu: data.ID_Chucvu,
      id_quyen: data.iQuyen,
    });

    setIsCheckUpdate({
      check: true,
      id_giamsat: data.ID_Giamsat,
    });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.hoten === "" || dataInput.sodienthoai === null) {
      Alert.alert("PMC Thông báo", "Thiêu thông tin ca làm việc", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Duan: dataInput.id_duan,
        Hoten: dataInput.hoten,
        Gioitinh: dataInput.gioitinh,
        Sodienthoai: dataInput.sodienthoai,
        Ngaysinh: dataInput.ngaysinh,
        ID_Chucvu: dataInput.id_chucvu,
        iQuyen: 1,
      };

      await axios
        .put(BASE_URL + `/ent_giamsat/update/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        })
        .then((response) => {
          init_giamsat();
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

  const handleAlertDelete = async (id) => {
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa người giám sát", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xác nhận", onPress: () => handlePushDataDelete(id) },
    ]);
  };

  const handlePushDataDelete = async (id) => {
    await axios
      .put(BASE_URL + `/ent_giamsat/delete/${id}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response) => {
        init_giamsat();
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
    bottomSheetModalRef.current?.present();
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
    return (
      <DataTable.Row style={{ gap: 20, paddingVertical: 10 }} key={index}>
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
          <Text numberOfLines={3}>{item?.Checklist}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 120 }}>
          <Text numberOfLines={2}>{item?.Giatrinhan}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
          {item?.ent_khuvuc?.ent_toanha?.Toanha}
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
          {item?.ent_tang?.Tentang}
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
          {item?.ent_khuvuc?.Tenkhuvuc}
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 120 }}>
          {item?.ent_khuvuc?.ent_khoicv?.KhoiCV}
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 150 }}>
          <Text numberOfLines={2}>{item?.Giatridinhdanh}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
          <Text>{item?.Maso}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
          {item?.Sothutu}
        </DataTable.Cell>
      </DataTable.Row>
    );
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
                {
                  isLoading === true ?
                  <View style={{flex: 1, justifyContent: 'center',alignItems: 'center',
                  marginBottom: 40
                  }}>
                    <ActivityIndicator size="large" color={'white'}/>
                  </View>
                  :
                  <>
                       {listChecklist?.length > 0 ? (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <TouchableOpacity
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
    
                        <ScrollView>
                          <DataTable
                            style={{
                              backgroundColor: "white",
                              marginTop: 30,
                              borderRadius: 8,
                            }}
                          >
                            <ScrollView
                              horizontal
                              contentContainerStyle={{ flexDirection: "column" }}
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
                                  <ActionCheckboxAll toggleTodo={toggleTodo} status={status}/>
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
    
                              {listChecklist && listChecklist.length > 0 && (
                                <FlatList
                                  nestedScrollEnabled={false}
                                  keyExtractor={(item, index) =>
                                    `${item?.ID_Khuvuc}_${index}`
                                  }
                                  data={listChecklist}
                                  renderItem={_renderItem}
                                />
                              )}
                              <DataTable.Pagination
                                style={{ justifyContent: "flex-start" }}
                                page={page}
                                // numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                                onPageChange={(page) => setPage(page)}
                                // label={`${from + 1}-${to} đến ${items.length}`}
                                showFastPaginationControls
                                numberOfItemsPerPageList={numberOfItemsPerPageList}
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
                          <Text style={[styles.danhmuc, { paddingVertical: 10 }]}>
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
                }
                
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
});
