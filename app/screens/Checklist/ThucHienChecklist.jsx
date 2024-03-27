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
import {tb_checklistc_get} from "../../redux/actions/tbActions"
import ModalChecklist from "../../components/Modal/ModalChecklist";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import ModalChecklistC from "../../components/Modal/ModalChecklistC";

const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: "Page 1",
  },
  {
    key: 2,
    name: "Page 2",
  },
  {
    key: 3,
    name: "Page 3",
  },
];

const dataList = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

const calamviecList = [
  { label: "Sáng", value: "sang" },
  { label: "Chiều", value: "chieu" },
  { label: "Tối", value: "toi" },
];

const headerList = [
  {
    til: "Ngày",
    width: 90,
  },
  {
    til: "Tên ca",
    width: 90,
  },
  {
    til: "Nhân viên",
    width: 180,
  },
  {
    til: "Giờ bắt đầu",
    width: 100,
  },
  {
    til: "Tình trạng",
    width: 100,
  },
  {
    til: "Ghi chú",
    width: 100,
  },
  ,
  {
    til: "Giờ kết thúc",
    width: 100,
  },
  ,
  {
    til: "ID",
    width: 70,
  },
  ,
  {
    til: "Giờ chụp ảnh 1",
    width: 120,
  },
  ,
  {
    til: "Giờ chụp ảnh 2",
    width: 120,
  },
  ,
  {
    til: "Giờ chụp ảnh 3",
    width: 120,
  },
  ,
  {
    til: "Giờ chụp ảnh 4",
    width: 120,
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

const ThucHienChecklist = ({navigation}) => {
  const ref = useRef(null);
  const dispath = useDispatch();
  const { ent_tang, ent_khuvuc, ent_checklist, ent_khoicv, ent_toanha, ent_giamsat } =
    useSelector((state) => state.entReducer);
    const { tb_checklistc } =
    useSelector((state) => state.tbReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);

  const date = new Date();
  const dateHour = moment(date).format("LT");
  const dateDay = moment(date).format("L");
  
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [1, "30%", "60%", "90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );
  const [listChecklist, setListChecklist] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true);
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); //

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

  

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);


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
                {
                  isLoading ? (
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
                  ):
                  (
                    <>
                     {listChecklist && listChecklist?.length > 0 ? (
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
                            // onPress={handlePresentModalPress}
                          />
                        </View>
                        </>
                      ):
                      (
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
                      )
                      }
                    </>
                  )
                }
              </View>
            </View>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={3}
              snapPoints={snapPoints}
              // onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={styles.contentContainer}>
                <ModalChecklistC
                  // ent_tang={ent_tang}
                  // ent_khuvuc={ent_khuvuc}
                  // ent_khoicv={ent_khoicv}
                  // ent_toanha={ent_toanha}
                  // handleChangeText={handleChangeText}
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

            {/* {isCheckbox === true && newActionCheckList?.length > 0 && ( */}
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
                {/* {newActionCheckList?.length === 1 && ( */}
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      // onPress={() => handleEditEnt(newActionCheckList[0])}
                    >
                      <Feather name="edit" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      // onPress={() =>
                      //   handleToggleModal(true, newActionCheckList[0], 0.2)
                      // }
                    >
                      <Feather name="eye" size={24} color="white" />
                    </TouchableOpacity>
                  </>
                {/* )} */}
                <TouchableOpacity
                  style={styles.button}
                  // onPress={() => handleAlertDelete(arrayId)}
                >
                  <Feather name="trash-2" size={24} color="white" />
                </TouchableOpacity>
              </View>
            {/* )} */}
            </ImageBackground>
            </BottomSheetModalProvider>
            </KeyboardAvoidingView>
            </GestureHandlerRootView>
    </>
  )
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
