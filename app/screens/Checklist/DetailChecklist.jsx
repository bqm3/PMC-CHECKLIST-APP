import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
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
import { Entypo } from "@expo/vector-icons";
import {
  ent_checklist_get_detail,
  ent_khuvuc_get,
  ent_tang_get,
  ent_toanha_get,
} from "../../redux/actions/entActions";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import ActiveChecklist from "../../components/Active/ActiveCheckList";
import Button from "../../components/Button/Button";
import ModalChitietChecklist from "../../components/Modal/ModalChitietChecklist";
import ModalPopupDetailChecklist from "../../components/Modal/ModalPopupDetailChecklist";
import moment from "moment";
import axios, { isCancel } from "axios";
import { BASE_URL } from "../../constants/config";
import QRCodeScreen from "../QRCodeScreen";

const DetailChecklist = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV } = route.params;
  const dispath = useDispatch();
  const {
    ent_checklist_detail,
    ent_tang,
    ent_khuvuc,
    ent_toanha,
    isLoadingDetail,
    isLoading,
  } = useSelector((state) => state.entReducer);

  const { user, authToken } = useSelector((state) => state.authReducer);

  const [dataChecklist, setDataChecklist] = useState([]);
  const [dataChecklistFilter, setDataChecklistFilter] = useState([]);
  const [newActionDataChecklist, setNewActionDataChecklist] = useState([]);
  const [defaultActionDataChecklist, setDefaultActionDataChecklist] = useState(
    []
  );
  const [dataChecklistFaild, setDataChecklistFaild] = useState([]);
  const [dataItem, setDataItem] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [index, setIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isScan, setIsScan] = useState(false);
  const [showNameDuan, setShowNameDuan] = useState("");

  const [filterData, setFilterData] = useState({
    ID_Khuvuc: null,
    ID_Tang: null,
    ID_Toanha: null,
  });

  const [isFilter, setIsFilter] = useState({
    ID_Tang: false,
    ID_Khuvuc: false,
    ID_Toanha: null,
  });

  const init_checklist = async () => {
    await dispath(ent_checklist_get_detail(ID_KhoiCV, ID_ChecklistC));
  };

  const init_ent_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const init_ent_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_ent_tang = async () => {
    await dispath(ent_tang_get());
  };

  useEffect(() => {
    init_checklist();
    init_ent_khuvuc();
    init_ent_toanha();
    init_ent_tang();
  }, []);

  // load add field item initstate
  useEffect(() => {
    const processedData = ent_checklist_detail?.map((item) => {
      return {
        ...item,
        Giatrinhan: item?.Giatrinhan?.split("/"),
        valueCheck: null,
        GhichuChitiet: "",
        ID_ChecklistC: ID_ChecklistC,
        Anh: null,
        gioht: moment().format("LTS"),
      };
    });
    setDataChecklistFilter(processedData);
    setDataChecklist(processedData);
  }, [ent_checklist_detail, loadingSubmit]);

  // change filter all data
  const toggleSwitch = (isEnabled) => {
    setIsEnabled(!isEnabled);
    if (isEnabled === false) {
      setFilterData({
        ID_Tang: null,
        ID_Khuvuc: null,
        ID_Toanha: null,
      });

      setIsFilter({
        ID_Tang: false,
        ID_Khuvuc: false,
        ID_Toanha: false,
      });

      showAllChecklist();
    }
  };

  // action click
  const handleCheckbox = (key, value) => {
    setIsFilter((data) => ({
      ...data,
      [key]: value,
    }));
    setIsEnabled(false);
  };

  // action click
  const handleChangeFilter = (key, value) => {
    setFilterData((data) => ({
      ...data,
      [key]: value,
    }));
  };

  // close modal bottomsheet
  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  // open modal bottomsheet
  const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef?.current?.present();
    setDataItem(item);
  }, []);

  // change modal bottom sheet
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
      setDataItem(null);
    } else {
      setOpacity(0.2);
    }
  }, []);

  // click dots and show modal bottom sheet
  const handlePopupActive = useCallback((item, index) => {
    setOpacity(0.2);
    setDataItem(item);
    setModalVisible(true);
    setIndex(index);
  }, []);

  // close modal bottom sheet
  const handlePopupClear = useCallback(() => {
    setOpacity(1);
    setDataItem(null);
    setModalVisible(false);
    setIndex(null);
  }, []);

  // show all checklist
  const showAllChecklist = () => {
    let filteredData = dataChecklist.map((item) => {
      const matchingItem = defaultActionDataChecklist.find(
        (newItem) => newItem.ID_Checklist === item.ID_Checklist
      );
      if (matchingItem) {
        return {
          ...item,
          valueCheck: matchingItem.valueCheck,
          GhichuChitiet: matchingItem.GhichuChitiet,
          Anh: matchingItem.Anh,
          gioht: matchingItem.gioht,
          ID_ChecklistC: ID_ChecklistC,
        };
      }
      return item;
    });

    setDataChecklistFilter(filteredData);
  };

  // toggle scan and show all checklist
  const toggleScan = () => {
    setIsScan(!isScan);
    showAllChecklist();
    setShowNameDuan("");
  };

  // set data checklist and image || ghichu
  const handleSetData = (key, data, it) => {
    let mergedArrCheck = [...defaultActionDataChecklist];
    let mergedArrImage = [...dataChecklistFaild];

    let newDataChecklist;

    newDataChecklist = data.filter((item) => item.valueCheck !== null);

    let newDataChecklistImage = data.filter((item) => {
      return (
        item.valueCheck !== null &&
        (item.Anh !== null || item.GhichuChitiet !== "")
      );
    });
    if (it.valueCheck !== null) {
      if (key === "Anh" || key === "GhichuChitiet") {
        mergedArrImage.splice(
          mergedArrImage.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          ),
          1
        );
      } else {
        mergedArrCheck.splice(
          mergedArrCheck.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          ),
          1
        );
      }
    } else {
      // Duyệt qua mảng arrCheck2
      if (key === "Anh" || key === "GhichuChitiet") {
        newDataChecklistImage.forEach((item) => {
          const found = mergedArrImage.some(
            (existingItem) => existingItem.ID_Checklist === item.ID_Checklist
          );
          if (!found) {
            mergedArrImage.push(item);
          }
        });
      } else {
        newDataChecklist.forEach((item) => {
          const found = mergedArrCheck.some(
            (existingItem) =>
              existingItem.ID_Checklist === item.ID_Checklist &&
              existingItem.Anh === null &&
              existingItem.GhichuChitiet === ""
          );
          if (!found) {
            mergedArrCheck.push(item);
          }
        });
      }
    }

    setDataChecklistFaild(newDataChecklistImage);
    setDefaultActionDataChecklist(mergedArrCheck);
    setNewActionDataChecklist(newDataChecklist);
    setDataChecklistFilter(data);
  };

  // change filter checklist
  const handleChange = (key, value, it) => {
    const updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
      if (item === it) {
        return {
          ...item,
          [key]: value,
          gioht: moment().format("LTS"),
        };
      }
      return item;
    });

    handleSetData(key, updatedDataChecklist, it);
  };

  // click item checklist
  const handleItemClick = (value, it, key) => {
    const updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
      if (item.ID_Checklist === it.ID_Checklist && key === "click") {
        return { ...item, valueCheck: value, gioht: moment().format("LTS") };
      } else if (item.ID_Checklist === it.ID_Checklist && key === "active") {
        return {
          ...item,
          valueCheck: item.valueCheck === null ? value : null,
          gioht: moment().format("LTS"),
        };
      }
      return item;
    });

    handleSetData("click", updatedDataChecklist, it);
  };

  // call api filter data checklist
  const handlePushDataFilter = async () => {
    try {
      const res = await axios.post(
        BASE_URL + `/ent_checklist/filter/${ID_KhoiCV}/${ID_ChecklistC}`,
        filterData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      );
      const dataList = res.data.data;
      let filteredData = dataList.map((item) => {
        const matchingItem = defaultActionDataChecklist.find((newItem) => {
          return newItem.ID_Checklist === item.ID_Checklist;
        });
        if (matchingItem) {
          return {
            ...item,
            valueCheck: matchingItem.valueCheck,
            GhichuChitiet: matchingItem.GhichuChitiet,
            Anh: matchingItem.Anh,
            gioht: matchingItem.gioht,
            ID_ChecklistC: ID_ChecklistC,
          };
        } else {
          return {
            ...item,
            valueCheck: null,
            GhichuChitiet: "",
            Anh: null,
            gioht: moment().format("LTS"),
            ID_ChecklistC: ID_ChecklistC,
          };
        }
      });

      const newDataChecklist = filteredData.filter(
        (item) => item.valueCheck !== null
      );

      // Thêm các phần tử mới từ newDataChecklist vào newActionDataChecklist
      setNewActionDataChecklist((prevState) =>
        prevState?.concat(newDataChecklist)
      );

      setDataChecklistFilter(filteredData);
      handleCloseModal();
    } catch (error) {
      if (error.response) {
        // Lỗi từ phía server (có response từ server)
        Alert.alert("PMC Thông báo", error.response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        Alert.alert("PMC Thông báo", "Không nhận được phản hồi từ máy chủ", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        // Lỗi khi cấu hình request
        Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      }
    }
  };

  const handlePushDataFilterQr = async (value) => {
    const data = {
      MaQrCode: value,
    };
    try {
      const res = await axios.post(
        BASE_URL + `/ent_checklist/filter_qr/${ID_KhoiCV}/${ID_ChecklistC}`,
        data,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      );
      const dataList = res.data.data;
      let filteredData = dataList.map((item) => {
        const matchingItem = defaultActionDataChecklist.find((newItem) => {
          return newItem.ID_Checklist === item.ID_Checklist;
        });
        if (matchingItem) {
          return {
            ...item,
            valueCheck: matchingItem.valueCheck,
            GhichuChitiet: matchingItem.GhichuChitiet,
            Anh: matchingItem.Anh,
            gioht: matchingItem.gioht,
            ID_ChecklistC: ID_ChecklistC,
          };
        } else {
          return {
            ...item,
            valueCheck: null,
            GhichuChitiet: "",
            Anh: null,
            gioht: moment().format("LTS"),
            ID_ChecklistC: ID_ChecklistC,
          };
        }
      });

      const newDataChecklist = filteredData.filter(
        (item) => item.valueCheck !== null
      );

      // Thêm các phần tử mới từ newDataChecklist vào newActionDataChecklist
      setNewActionDataChecklist((prevState) =>
        prevState?.concat(newDataChecklist)
      );

      setDataChecklistFilter(filteredData);
      setOpacity(1);
      setModalVisibleQr(false);
      handleCloseModal();
      setShowNameDuan(
        `${dataList[0]?.ent_khuvuc?.Tenkhuvuc || ""} - ${
          dataList[0]?.ent_khuvuc?.ent_toanha?.Toanha || ""
        } `
      );
    } catch (error) {
      if (error.response) {
        // Lỗi từ phía server (có response từ server)
        Alert.alert("PMC Thông báo", error.response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        Alert.alert("PMC Thông báo", "Không nhận được phản hồi từ máy chủ", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        // Lỗi khi cấu hình request
        Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      }
    }
  };

  // call api submit data checklsit
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    const formData = new FormData();

    // Tạo mảng các promise cho mỗi item trong dataChecklistFaild
    const requests = dataChecklistFaild.map(async (item) => {
      const itemInfo = {
        ID_ChecklistC: ID_ChecklistC,
        ID_Checklist: item.ID_Checklist,
        Ketqua: item.valueCheck || "",
        Gioht: item.gioht,
        Ghichu: item.GhichuChitiet || "",
        Anh: "",
      };

      if (item.Anh) {
        const file = {
          uri:
            Platform.OS === "android"
              ? item?.Anh?.uri
              : item?.Anh?.uri.replace("file://", ""),
          name:
            item?.Anh?.fileName ||
            Math.floor(Math.random() * Math.floor(999999999)) + ".jpg",
          type: item?.Anh?.type || "image/jpeg",
        };

        formData.append(`Images`, file);
        itemInfo.Anh = file.name;
      }

      Object.entries(itemInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Trả về promise cho mỗi item
      return axios.post(BASE_URL + "/tb_checklistchitiet/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authToken,
        },
      });
    });

    const updatedDefaultActionDataChecklist = defaultActionDataChecklist.filter(
      (item) => {
        return !item.Anh !== null && !item.GhichuChitiet !== "";
      }
    );
    const descriptions = [
      updatedDefaultActionDataChecklist
        .map(
          (item) =>
            `${ID_ChecklistC}/${item.ID_Checklist}/${item.valueCheck}/${item.gioht}`
        )
        .join(","),
    ];
    const descriptionsJSON = JSON.stringify(descriptions);

    const requestDone = axios.post(
      BASE_URL + "/tb_checklistchitietdone/create",
      { Description: descriptionsJSON },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    try {
      // Gộp cả hai mảng promise và đợi cho tất cả các promise hoàn thành
      await Promise.all([...requests, requestDone]);

      // Hiển thị cảnh báo sau khi tất cả các yêu cầu hoàn thành
      Alert.alert("PMC Thông báo", "Checklist thành công", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);

      // Thiết lập lại dữ liệu và cờ loading
      init_checklist();
      setNewActionDataChecklist([]);
      setDefaultActionDataChecklist([]);
      setDataChecklistFaild([]);
      setLoadingSubmit(false);
    } catch (error) {
      setLoadingSubmit(false);
      if (error.response) {
        // Lỗi từ phía server (có response từ server)
        Alert.alert("PMC Thông báo", error.response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      }
    }
  };
  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <View style={[styles.content]} key={item?.ID_Checklist}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "80%",
          }}
        >
          <ActiveChecklist
            item={item}
            index={index}
            size={30}
            handleToggle={() =>
              handleItemClick(item?.Giatridinhdanh, item, "active")
            }
            // active={}
          />
          <Text
            style={{
              fontSize: 16,
              color: "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Sothutu}. {item?.Checklist}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handlePopupActive(item, index)}>
          <Entypo name="dots-three-vertical" size={28} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  // format number
  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number == 0) return `0`;
    return number;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/bg.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  // justifyContent: "center",
                  opacity: opacity,
                }}
              >
                <View style={{ margin: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      // onPress={() => handleFilterData(true, 0.5)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "cloumn",
                          gap: 8,
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {decimalNumber(dataChecklistFilter?.length)}{" "}
                          Checklist
                        </Text>
                        <Text allowFontScaling={false} style={styles.text}>
                          Đang checklist:{" "}
                          {decimalNumber(newActionDataChecklist?.length)}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {isScan && (
                      <ButtonChecklist
                        text={"Tất cả"}
                        width={"auto"}
                        color={COLORS.bg_button}
                        onPress={toggleScan}
                      />
                    )}

                    <ButtonChecklist
                      text={"Tìm kiếm"}
                      width={"auto"}
                      color={COLORS.bg_button}
                      onPress={handlePresentModalPress}
                    />
                  </View>
                </View>
                {showNameDuan !== "" && (
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.text,
                      { paddingHorizontal: 12, fontSize: 18 },
                    ]}
                  >
                    Khu vực: {showNameDuan}
                  </Text>
                )}
                {isLoadingDetail === false &&
                  dataChecklistFilter &&
                  dataChecklistFilter?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={dataChecklistFilter}
                        renderItem={({ item, index, separators }) =>
                          renderItem(item, index)
                        }
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 16 }} />
                        )}
                        keyExtractor={(item, index) =>
                          `${item?.ID_Checklist}_${index}`
                        }
                      />
                    </>
                  )}

                {isLoadingDetail === true &&
                  dataChecklistFilter?.length == 0 && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ActivityIndicator
                        style={{
                          marginRight: 4,
                        }}
                        size="large"
                        color={COLORS.bg_white}
                      ></ActivityIndicator>
                    </View>
                  )}

                {isLoadingDetail === false &&
                  dataChecklistFilter?.length == 0 && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 80,
                      }}
                    >
                      <Image
                        source={require("../../../assets/icons/delete_bg.png")}
                        resizeMode="contain"
                        style={{ height: 120, width: 120 }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.danhmuc, { padding: 10 }]}
                      >
                        {isScan
                          ? "Không thấy checklist cho khu vực này"
                          : "Không còn checklist cho ca làm việc này !"}
                      </Text>
                    </View>
                  )}
                <View
                  style={{
                    position: "absolute",
                    bottom: 40,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    text={"Scan QR Code"}
                    backgroundColor={"white"}
                    color={"black"}
                    onPress={() => {
                      setModalVisibleQr(true);
                      setOpacity(0.2);
                    }}
                  />
                  <Button
                    text={"Hoàn Thành"}
                    isLoading={loadingSubmit}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => handleSubmit()}
                  />
                  {/* text, backgroundColor, color */}
                </View>
              </View>
            </ImageBackground>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={styles.contentContainer}>
                <ModalChitietChecklist
                  dataItem={dataItem}
                  ent_tang={ent_tang}
                  ent_khuvuc={ent_khuvuc}
                  ent_toanha={ent_toanha}
                  toggleSwitch={toggleSwitch}
                  filterData={filterData}
                  isFilter={isFilter}
                  handleCheckbox={handleCheckbox}
                  handleChangeFilter={handleChangeFilter}
                  isEnabled={isEnabled}
                  handleCloseModal={handleCloseModal}
                  handlePushDataFilter={handlePushDataFilter}
                />
              </BottomSheetScrollView>
            </BottomSheetModal>

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
                  <Text allowFontScaling={false} style={styles.modalText}>
                    Thông tin checklist chi tiết
                  </Text>
                  <ModalPopupDetailChecklist
                    handlePopupClear={handlePopupClear}
                    dataItem={dataItem}
                    handleItemClick={handleItemClick}
                    index={index}
                    handleChange={handleChange}
                  />
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleQr}
              onRequestClose={() => {
                setModalVisibleQr(!modalVisibleQr);
                setOpacity(1);
              }}
            >
              <View
                style={[styles.centeredView, { width: "100%", height: "80%" }]}
              >
                <View
                  style={[styles.modalView, { width: "80%", height: "60%" }]}
                >
                  <QRCodeScreen
                    setModalVisibleQr={setModalVisibleQr}
                    setOpacity={setOpacity}
                    handlePushDataFilterQr={handlePushDataFilterQr}
                    setIsScan={setIsScan}
                  />
                </View>
              </View>
            </Modal>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DetailChecklist;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
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
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
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
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
