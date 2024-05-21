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
  useContext,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import {
  ent_checklist_mul_hm,
  ent_khuvuc_get,
  ent_tang_get,
  ent_toanha_get,
  ent_hangmuc_get,
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
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailChecklist = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Calv, ID_Hangmuc } = route.params;
  const dispath = useDispatch();
  const {
    ent_checklist_detail,
    ent_tang,
    ent_khuvuc,
    ent_toanha,
    ent_hangmuc,
    isLoadingDetail,
  } = useSelector((state) => state.entReducer);
  const { setDataChecklists, dataChecklists, dataHangmuc } =
    useContext(DataContext);
  const { dataChecklistFilterContext, setDataChecklistFilterContext } =
    useContext(ChecklistContext);

  const { user, authToken } = useSelector((state) => state.authReducer);

  const [dataChecklist, setDataChecklist] = useState([]);
  const [dataChecklistFilter, setDataChecklistFilter] = useState([]);
  const [newActionDataChecklist, setNewActionDataChecklist] = useState([]);
  const [defaultActionDataChecklist, setDefaultActionDataChecklist] = useState(
    []
  );
  const [dataChecklistFaild, setDataChecklistFaild] = useState([]);
  const [dataItem, setDataItem] = useState(null);
  const [tieuchuan, setTieuchuan] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [index, setIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTieuChuan, setModalVisibleTieuChuan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [showNameDuan, setShowNameDuan] = useState("");

  const init_checklist = async () => {
    await dispath(ent_checklist_mul_hm(dataHangmuc, ID_Calv, ID_ChecklistC));
  };

  // load add field item initstate
  useEffect(() => {
    if (ent_checklist_detail) {
      setDataChecklists(ent_checklist_detail);
      setDataChecklistFilterContext(ent_checklist_detail);
    }
  }, [ent_checklist_detail]);

  useEffect(() => {
    const data = dataChecklists?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );

    const dataChecklist = dataChecklistFilterContext?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );
    const dataChecklistAction = dataChecklist.filter(
      (item) => item.valueCheck !== null
    );
    const dataChecklistDefault = dataChecklistAction.filter(
      (item) => item.valueCheck === item.Giatridinhdanh
    );

    const dataChecklistActionWithoutDefault = dataChecklistAction.filter(
      (item) =>
        !dataChecklistDefault.some(
          (defaultItem) => defaultItem.ID_Checklist === item.ID_Checklist
        )
    );

    setDataChecklist(data);
    setDataChecklistFilter(dataChecklist);
    setNewActionDataChecklist(dataChecklistAction);
    setDefaultActionDataChecklist(dataChecklistDefault);
    setDataChecklistFaild(dataChecklistActionWithoutDefault);
  }, [dataChecklists, dataChecklistFilterContext]);

  // set data checklist and image || ghichu
  const handleSetData = async (key, data, it) => {
    let mergedArrCheck = [...defaultActionDataChecklist];
    let mergedArrImage = [...dataChecklistFaild];

    // newDataChecklist là data dc chọn.
    let newDataChecklist = data.filter((item) => item.valueCheck !== null);
    // clear item checklist
    if (it.valueCheck !== null) {
      if (key === "Anh" || key === "GhichuChitiet") {
        // Kiểm tra và cập nhật mergedArrCheck
        const indexCheck = mergedArrCheck.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        );
        if (indexCheck !== -1) {
          // Xóa it khỏi mergedArrCheck nếu tồn tại
          mergedArrCheck.splice(indexCheck, 1);
        }

        // Kiểm tra và cập nhật mergedArrImage
        const indexImage = mergedArrImage.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        );
        if (indexImage !== -1) {
          // Cập nhật it trong mergedArrImage nếu tồn tại
          mergedArrImage[indexImage] = it;
        } else {
          // Thêm it vào mergedArrImage nếu chưa tồn tại
          mergedArrImage.push(it);
        }
      }

      if (key === "option") {
        const indexFaild = newDataChecklist.findIndex((item) => {
          return (
            item.ID_Checklist === it.ID_Checklist &&
            item.Giatridinhdanh === item.valueCheck &&
            it.Anh === null &&
            it.GhichuChitiet === ""
          );
        });
        if (indexFaild === -1) {
          if (
            !mergedArrImage.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrImage.push(it);
          }
          const indexDefault = mergedArrCheck.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );
          if (indexDefault !== -1) {
            mergedArrCheck.splice(indexDefault, 1);
          }
        } else {
          if (
            !mergedArrCheck.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrCheck.push(it);
          }

          const indexDefault = mergedArrImage.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );
          if (indexDefault !== -1) {
            mergedArrImage.splice(indexDefault, 1);
          }
        }
      }

      if (key === "active") {
        // Tìm mục trong newDataChecklist có ID_Checklist trùng với it.ID_Checklist và valueCheck khác Giatridinhdanh
        const indexFaild = mergedArrImage.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        );
        if (indexFaild !== -1) {
          mergedArrImage.splice(indexFaild, 1);
        }

        const indexDefault = mergedArrCheck.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        );
        if (indexDefault !== -1) {
          mergedArrCheck.splice(indexDefault, 1);
        }
      }
    } else {
      if (key === "Anh" || key === "GhichuChitiet") {
      }
      if (key === "option" || key === "active") {
        const indexFaild = newDataChecklist.find(
          (item) =>
            item.ID_Checklist === it.ID_Checklist &&
            item.valueCheck !== item.Giatridinhdanh
        );

        if (indexFaild) {
          // Thêm it vào mergedArrImage nếu chưa có
          if (
            !mergedArrImage.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrImage.push(it);
          }

          // Xóa it khỏi mergedArrCheck nếu tồn tại
          const indexCheck = mergedArrCheck.findIndex((item) => {
            return (
              item.ID_Checklist === it.ID_Checklist &&
              it.valueCheck === item.valueCheck &&
              it.Anh === null &&
              it.GhichuChitiet === ""
            );
          });
          if (indexCheck !== -1) {
            mergedArrCheck.splice(indexCheck, 1);
          }
        } else {
          // Kiểm tra và thêm it vào mergedArrCheck nếu chưa có
          const found = mergedArrCheck.some(
            (existingItem) =>
              it.ID_Checklist === existingItem.ID_Checklist &&
              item.Giatridinhdanh === existingItem.valueCheck &&
              it.Anh === null &&
              it.GhichuChitiet === ""
          );
          if (!found) {
            mergedArrCheck.push(it);
          }
        }
      }
    }
    setDataChecklistFaild(mergedArrImage);
    setDefaultActionDataChecklist(mergedArrCheck);
    setNewActionDataChecklist([...mergedArrImage, ...mergedArrCheck]);
    setDataChecklistFilter(data);
    const data2Map = new Map(data.map((item) => [item.ID_Checklist, item]));

    // Lọc và thay thế các item trong data1
    const updatedData1 = dataChecklistFilterContext.map((item) =>
      data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
    );
    setDataChecklistFilterContext(updatedData1);
  };

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
    // console.log('value',value)
    const updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
      if (item.ID_Checklist === it.ID_Checklist && key === "option") {
        return {
          ...item,
          valueCheck: value ? value : null,
          gioht: moment().format("LTS"),
        };
      } else if (item.ID_Checklist === it.ID_Checklist && key === "active") {
        // console.log('run' )
        return {
          ...item,
          valueCheck: value ? value : null,
          gioht: moment().format("LTS"),
        };
      }
      return item;
    });
    console.log("updatedDataChecklist", updatedDataChecklist);

    handleSetData(key, updatedDataChecklist, it);
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
        `${dataList[0]?.ent_hangmuc?.ent_khuvuc?.Tenkhuvuc || ""} - ${
          dataList[0]?.ent_hangmuc?.ent_khuvuc?.ent_toanha?.Toanha || ""
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
    if (
      defaultActionDataChecklist.length === 0 &&
      dataChecklistFaild.length === 0
    ) {
      // Hiển thị thông báo cho người dùng
      Alert.alert("PMC Thông báo", "Không có checklist để kiểm tra!", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      setLoadingSubmit(false);
      // Kết thúc hàm sớm nếu mảng rỗng
      return;
    }
    // Kiểm tra dữ liệu và xử lý tùy thuộc vào trạng thái của `defaultActionDataChecklist` và `dataChecklistFaild`
    if (
      defaultActionDataChecklist.length === 0 &&
      dataChecklistFaild.length > 0
    ) {
      // Xử lý API cho dataChecklistFaild
      await handleDataChecklistFaild();
    } else if (
      defaultActionDataChecklist.length > 0 &&
      dataChecklistFaild.length == 0
    ) {
      // Xử lý API cho defaultActionDataChecklist
      await handleDefaultActionDataChecklist();
    }

    if (
      defaultActionDataChecklist.length > 0 &&
      dataChecklistFaild.length > 0
    ) {
      await hadlChecklistAll();
    }
    // Cập nhật sau khi hoàn thành xử lý API
  };

  // api faild tb_checklistchitiet
  const handleDataChecklistFaild = async () => {
    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Iterate over all items in dataChecklistFaild
      dataChecklistFaild.forEach((item, index) => {
        // Extract and append checklist details to formData
        formData.append("ID_ChecklistC", ID_ChecklistC);
        formData.append("ID_Checklist", item.ID_Checklist);
        formData.append("Ketqua", item.valueCheck || "");
        formData.append("Gioht", item.gioht);
        formData.append("Ghichu", item.GhichuChitiet || "");

        // If there is an image, append it to formData
        if (item.Anh) {
          const file = {
            uri:
              Platform.OS === "android"
                ? item.Anh.uri
                : item.Anh.uri.replace("file://", ""),
            name:
              item.Anh.fileName ||
              `${Math.floor(Math.random() * 999999999)}.jpg`,
            type: "image/jpeg",
          };
          formData.append(`Images_${index}`, file);
          formData.append("Anh", file.name);
        } else {
          formData.append("Anh", "");
          formData.append(`Images_${index}`, {});
        }
      });

      // Send the entire FormData in a single request
      await axios.post(BASE_URL + `/tb_checklistchitiet/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authToken,
        },
      });
      postHandleSubmit();
      setLoadingSubmit(false);
      // Alert user of successful submission
      Alert.alert("PMC Thông báo", "Checklist thành công", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);

      // Handle successful form submission
     
    } catch (error) {
      console.log("err faild", error);
      setLoadingSubmit(false);
      if (error.response) {
        // Handle error response from the server
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

  // api faild tb_checklistchitietdone
  const handleDefaultActionDataChecklist = async () => {
    // Xử lý API cho defaultActionDataChecklist
    const descriptions = [
      defaultActionDataChecklist
        .map(
          (item) => `${item.ID_Checklist}/${item.Giatridinhdanh}/${item.gioht}`
        )
        .join(","),
    ];
    const descriptionsJSON = JSON.stringify(descriptions);

    const requestDone = axios.post(
      BASE_URL + "/tb_checklistchitietdone/create",
      {
        Description: descriptionsJSON,
        ID_ChecklistC: ID_ChecklistC,
        checklistLength: defaultActionDataChecklist.length,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );
    try {
      // Gộp cả hai mảng promise và đợi cho tất cả các promise hoàn thành
      await Promise.all(requestDone);
      postHandleSubmit();
      setLoadingSubmit(false);
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
      
    } catch (error) {
      console.log("err done", error);
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

  // api all
  const hadlChecklistAll = async () => {
    // Tạo một đối tượng FormData để chứa dữ liệu của dataChecklistFaild
    const formData = new FormData();

    // Lặp qua từng phần tử trong dataChecklistFaild để thêm vào FormData
    dataChecklistFaild.forEach((item, index) => {
      // Thêm các trường dữ liệu vào FormData
      formData.append("ID_ChecklistC", ID_ChecklistC);
      formData.append("ID_Checklist", item.ID_Checklist);
      formData.append("Ketqua", item.valueCheck || "");
      formData.append("Gioht", item.gioht);
      formData.append("Ghichu", item.GhichuChitiet || "");

      // Nếu có hình ảnh, thêm vào FormData
      if (item.Anh) {
        const file = {
          uri:
            Platform.OS === "android"
              ? item.Anh.uri
              : item.Anh.uri.replace("file://", ""),
          name:
            item.Anh.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
          type: "image/jpeg",
        };
        formData.append(`Images_${index}`, file);
        formData.append("Anh", file.name);
      } else {
        formData.append("Anh", "");
        formData.append(`Images_${index}`, {});
      }
    });

    // Gửi FormData trong một yêu cầu duy nhất
    const requestFaild = axios.post(
      BASE_URL + `/tb_checklistchitiet/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    // Chuẩn bị dữ liệu cho yêu cầu thứ hai
    const descriptions = [
      defaultActionDataChecklist
        .map(
          (item) => `${item.ID_Checklist}/${item.Giatridinhdanh}/${item.gioht}`
        )
        .join(","),
    ];
    const descriptionsJSON = JSON.stringify(descriptions);

    const requestDone = axios.post(
      BASE_URL + "/tb_checklistchitietdone/create",
      {
        Description: descriptionsJSON,
        ID_ChecklistC: ID_ChecklistC,
        checklistLength: defaultActionDataChecklist.length,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    try {
      // Gộp các promise lại và chờ cho tất cả các promise hoàn thành
      await Promise.all([requestFaild, requestDone]);
      postHandleSubmit();
      setLoadingSubmit(false);
      // Hiển thị thông báo thành công
      Alert.alert("PMC Thông báo", "Checklist thành công", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);

      // Thiết lập lại dữ liệu và trạng thái loading
     
    } catch (error) {
      console.log("err all", error);
      setLoadingSubmit(false);

      if (error.response) {
        // Xử lý lỗi từ server
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
            gap: 4,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
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
            <View style={{ width: "90%" }}>
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
          </View>

          <View
            style={{
              // width: "25%",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => handlePopupActiveTieuChuan(item, index)}
            >
              <MaterialIcons name="read-more" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePopupActive(item, index)}>
              <Entypo name="dots-three-vertical" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Thiết lập lại dữ liệu sau khi hoàn thành xử lý API
  const postHandleSubmit = () => {
    init_checklist();
    setNewActionDataChecklist([]);
    setDefaultActionDataChecklist([]);
    setDataChecklistFaild([]);
  };

  // close modal bottomsheet
  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  // click dots and show modal bottom sheet
  const handlePopupActive = useCallback((item, index) => {
    setOpacity(0.2);
    setDataItem(item);
    setModalVisible(true);
    setIndex(index);
  }, []);

  const handlePopupActiveTieuChuan = useCallback((item, index) => {
    setOpacity(0.2);
    setTieuchuan(item.Tieuchuan);
    setModalVisibleTieuChuan(true);
    setIndex(index);
  });

  // close modal bottom sheet
  const handlePopupClear = useCallback(() => {
    setOpacity(1);
    setDataItem(null);
    setModalVisible(false);
    setIndex(null);
  }, []);

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

                    {/* {isScan && (
                      <ButtonChecklist
                        text={"Tất cả"}
                        width={"auto"}
                        color={COLORS.bg_button}
                        onPress={toggleScan}
                      />
                    )} */}

                    {/* <ButtonChecklist
                      text={"Tìm kiếm"}
                      width={"auto"}
                      color={COLORS.bg_button}
                      onPress={handlePresentModalPress}
                    /> */}
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
                          ? "Không thấy checklist cho hạng mục này"
                          : "Không còn checklist cho hạng mục này !"}
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
                  {/* <Button
                    text={"Scan QR Code"}
                    backgroundColor={"white"}
                    color={"black"}
                    onPress={() => {
                      setModalVisibleQr(true);
                      setOpacity(0.2);
                    }}
                  /> */}
                  {/* <View></View> */}
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

            {/* <BottomSheetModal
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
            </BottomSheetModal> */}

            {/* Modal show action  */}
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

            {/* Modal show tieu chuan  */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleTieuChuan}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleTieuChuan(!modalVisibleTieuChuan);
              }}
            >
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      width: "85%",
                      height: "65%",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <ScrollView>
                    <Text>{tieuchuan} </Text>
                  </ScrollView>
                  <Button
                    text={"Đóng"}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => {
                      setModalVisibleTieuChuan(false);
                      setOpacity(1);
                    }}
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
    padding: 10,
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
