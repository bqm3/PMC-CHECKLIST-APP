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
import axios from "axios";
import { BASE_URL } from "../../constants/config";

const DetailChecklist = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV } = route.params;
  const dispath = useDispatch();
  const { ent_checklist_detail, ent_tang, ent_khuvuc, ent_toanha, isLoading } =
    useSelector((state) => state.entReducer);

  const { user, authToken } = useSelector((state) => state.authReducer);

  const [dataChecklist, setDataChecklist] = useState([]);
  const [dataChecklistFilter, setDataChecklistFilter] = useState([]);
  const [newActionDataChecklist, setNewActionDataChecklist] = useState([]);
  const [defaultActionDataChecklist, setDefaultActionDataChecklist] = useState(
    []
  );
  const [dataItem, setDataItem] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [index, setIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const [filterData, setFilterData] = useState({
    ID_Khuvuc: null,
    ID_Tang: null,
    ID_Toanha: null,
    ID_ChecklistC: ID_ChecklistC,
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
        ID_ChecklistC: ID_ChecklistC,
      });

      setIsFilter({
        ID_Tang: false,
        ID_Khuvuc: false,
        ID_Toanha: false,
      });

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

      // const mergedArrCheck = [...defaultActionDataChecklist];

      // // Duyệt qua mảng arrCheck2
      // newActionDataChecklist.forEach((item2) => {
      //   // Kiểm tra xem item2.id đã tồn tại trong mergedArrCheck chưa
      //   const found = mergedArrCheck.some((item) => item.id === item2.id);
      //   // Nếu không tìm thấy, thêm item2 vào mergedArrCheck
      //   if (!found) {
      //     mergedArrCheck.push(item2);
      //   }
      // });

      // const newDataChecklist = filteredData.filter(
      //   (item) => item.valueCheck !== null
      // );

      setDataChecklistFilter(filteredData);
      // setNewActionDataChecklist(mergedArrCheck);
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
    let mergedArrCheck = [...defaultActionDataChecklist];

    let newDataChecklist;
    newDataChecklist = updatedDataChecklist.filter(
      (item) => item.valueCheck !== null
    );
    if (it.valueCheck !== null) {
      mergedArrCheck.splice(
        mergedArrCheck.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        ),
        1
      );
    } else {
      // Duyệt qua mảng arrCheck2
      newDataChecklist.forEach((item2) => {
        // Kiểm tra xem item2.id đã tồn tại trong mergedArrCheck chưa
        const found = mergedArrCheck.some(
          (item) => item.ID_Checklist === item2.ID_Checklist
        );
        // Nếu không tìm thấy, thêm item2 vào mergedArrCheck
        if (!found) {
          mergedArrCheck.push(item2);
        }
      });
    }

    setDefaultActionDataChecklist(mergedArrCheck);
    setNewActionDataChecklist(newDataChecklist);
    setDataChecklistFilter(updatedDataChecklist);
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
    let mergedArrCheck = [...defaultActionDataChecklist];

    let newDataChecklist;
    newDataChecklist = updatedDataChecklist.filter(
      (item) => item.valueCheck !== null
    );
    if (it.valueCheck !== null && key == "active") {
      mergedArrCheck.splice(
        mergedArrCheck.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        ),
        1
      );
    } else {
      // Duyệt qua mảng arrCheck2
      newDataChecklist.forEach((item2) => {
        // Kiểm tra xem item2.id đã tồn tại trong mergedArrCheck chưa
        const found = mergedArrCheck.some(
          (item) => item.ID_Checklist === item2.ID_Checklist
        );
        // Nếu không tìm thấy, thêm item2 vào mergedArrCheck
        if (!found) {
          mergedArrCheck.push(item2);
        }
      });
    }

    setDefaultActionDataChecklist(mergedArrCheck);
    setNewActionDataChecklist(newDataChecklist);
    setDataChecklistFilter(updatedDataChecklist);
  };

  // call api filter data checklist
  const handlePushDataFilter = async () => {
    await axios
      .post(
        BASE_URL + `/ent_checklist/filter/${ID_KhoiCV}/${ID_ChecklistC}`,
        filterData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        const dataList = res.data.data;
        let filteredData = dataList.map((item) => {
          const matchingItem = defaultActionDataChecklist.find((newItem) => {
            return newItem.ID_Checklist === item.ID_Checklist;
          });
          // console.log('matchingItem',matchingItem.ID_Checklist)
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
      })
      .catch((err) => {
        console.log("err", err);
        Alert.alert("PMC Thông báo", "Tìm kiếm thất bại", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      });
  };

  // call api submit data checklsit
  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      let formData = new FormData();

      for (const item of newActionDataChecklist) {
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

          itemInfo.Anh = `${file.name}`;
        }

        Object.entries(itemInfo).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      await axios.post(BASE_URL + "/tb_checklistchitiet/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authToken,
        },
      });

      init_checklist();
      setNewActionDataChecklist([])
      setLoadingSubmit(false);
      Alert.alert("PMC Thông báo", "Checklist thành công", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } catch (error) {
      setLoadingSubmit(false);
      Alert.alert(
        "PMC Thông báo",
        "Đã có lỗi xảy ra. Vui lòng kiểm tra lại!!",
        [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]
      );
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
            numberOfLines={4}
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                    <ButtonChecklist
                      text={"Tìm kiếm"}
                      width={"auto"}
                      color={COLORS.bg_button}
                      onPress={handlePresentModalPress}
                    />
                  </View>
                </View>
                {isLoading === false &&
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

                {isLoading === true && dataChecklistFilter?.length == 0 && (
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
                {isLoading === false && dataChecklistFilter?.length == 0 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../../../assets/icons/delete_bg.png")}
                      resizeMode="contain"
                      style={{ height: 120, width: 120 }}
                    />
                    <Text
                      allowFontScaling={false}
                      style={[styles.danhmuc, { paddingVertical: 10 }]}
                    >
                      Không còn checklist cho ca làm việc này !
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
