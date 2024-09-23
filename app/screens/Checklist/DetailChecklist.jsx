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
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo, MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import ActiveChecklist from "../../components/Active/ActiveCheckList";
import Button from "../../components/Button/Button";
import ModalPopupDetailChecklist from "../../components/Modal/ModalPopupDetailChecklist";
import moment from "moment";
import axios, { isCancel } from "axios";
import { BASE_URL } from "../../constants/config";
import QRCodeScreen from "../QRCodeScreen";
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";
import * as Network from "expo-network";
import adjust from "../../adjust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "../../components/Active/Checkbox";
import ConnectContext from "../../context/ConnectContext";
import WebView from "react-native-webview";

const DetailChecklist = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Hangmuc, hangMuc, Hangmuc } =
    route.params;
  const dispath = useDispatch();
  const { isLoadingDetail } = useSelector((state) => state.entReducer);
  const { setHangMuc, HangMucDefault, setHangMucDefault } =
    useContext(DataContext);

  const { isConnect, saveConnect } = useContext(ConnectContext);
  const {
    dataChecklistFilterContext,
    setDataChecklistFilterContext,
    setLocationContext,
  } = useContext(ChecklistContext);
  const [isConnected, setIsConnected] = useState(false);

  const { user, authToken } = useSelector((state) => state.authReducer);

  const snapPoints = useMemo(() => ["70%"], []);
  const [dataChecklistFilter, setDataChecklistFilter] = useState([]);
  const [newActionDataChecklist, setNewActionDataChecklist] = useState([]);
  const [defaultActionDataChecklist, setDataChecklistDefault] = useState([]);
  const [dataChecklistFaild, setDataChecklistFaild] = useState([]);
  const [dataItem, setDataItem] = useState(null);
  const [tieuchuan, setTieuchuan] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [index, setIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTieuChuan, setModalVisibleTieuChuan] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [activeAll, setActiveAll] = useState(false);
  const [location, setLocation] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLocationContext(location);
    })();
  }, [dataChecklistFaild, defaultActionDataChecklist]);
  useEffect(() => {
    const dataChecklist = dataChecklistFilterContext?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );

    const dataChecklistAction = dataChecklist.filter(
      (item) => item.valueCheck !== null
    );
    const dataChecklistDefault = dataChecklistAction.filter(
      (item) =>
        item.valueCheck === item.Giatridinhdanh &&
        item.GhichuChitiet === "" &&
        item.Anh === null
    );

    const dataChecklistActionWithoutDefault = dataChecklistAction.filter(
      (item) =>
        !dataChecklistDefault.some(
          (defaultItem) => defaultItem.ID_Checklist === item.ID_Checklist
        )
    );

    setDataChecklistFilter(dataChecklist);
    setNewActionDataChecklist(dataChecklistAction);
    setDataChecklistDefault(dataChecklistDefault);
    setDataChecklistFaild(dataChecklistActionWithoutDefault);
  }, [ID_Hangmuc]);

  const handleChange = (key, value, it) => {
    console.log(it.valueCheck);
    const updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
      if (item.ID_Checklist === it.ID_Checklist) {
        return {
          ...item,
          [key]: value,
          Gioht: moment().format("LTS"),
        };
      }
      return item;
    });

    handleSetData(key, updatedDataChecklist, it);
    // }
  };

  const handleCheckAll = (value) => {
    setActiveAll(value);
    if (value) {
      const updateDataChecklist = dataChecklistFilter?.map((item, i) => {
        if (item.Tinhtrang == 0) {
          return {
            ...item,
            valueCheck: item.Giatridinhdanh,
            Gioht: moment().format("LTS"),
          };
        } else {
          return {
            ...item,
            Gioht: moment().format("LTS"),
          };
        }
      });

      const dataChecklistAction = updateDataChecklist.filter(
        (item) => item.valueCheck !== null
      );

      const dataChecklistDefault = dataChecklistAction.filter(
        (item) =>
          item.valueCheck === item.Giatridinhdanh &&
          item.GhichuChitiet === "" &&
          item.Anh === null
      );

      setDataChecklistFilter(updateDataChecklist);
      setNewActionDataChecklist(dataChecklistAction);
      setDataChecklistDefault(dataChecklistDefault);

      const data2Map = new Map(
        updateDataChecklist.map((item) => [item.ID_Checklist, item])
      );

      const updatedData1 = dataChecklistFilterContext.map((item) =>
        data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
      );
      setDataChecklistFilterContext(updatedData1);
    } else {
      const revertDataChecklist = dataChecklistFilter?.map((item) => {
        return {
          ...item,
          valueCheck: null,
          Gioht: moment().format("LTS"), // Use a previous value or initial value if available
        };
      });

      setDataChecklistFilter(revertDataChecklist);
      setNewActionDataChecklist([]);
      setDataChecklistDefault([]);
      setDataChecklistFaild([]);
    }
  };

  // set data checklist and image || ghichu
  const handleSetData = async (key, data, it) => {
    let mergedArrCheck = [...defaultActionDataChecklist];
    let mergedArrImage = [...dataChecklistFaild];

    // newDataChecklist là data được chọn.
    let newDataChecklist = data.filter((item) => item.valueCheck !== null);

    // Clear item checklist nếu valueCheck không phải là null
    if (it.valueCheck !== null) {
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
      } else if (key === "active") {
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
      } else if (key === "isCheck") {
        const indexFaild = newDataChecklist.findIndex((item) => {
          return (
            item.ID_Checklist === it.ID_Checklist &&
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
    } else {
      if (key === "option" || key === "active") {
        const indexFaild = newDataChecklist.find(
          (item) =>
            item.ID_Checklist === it.ID_Checklist &&
            item.valueCheck !== item.Giatridinhdanh
        );

        if (indexFaild) {
          if (
            !mergedArrImage.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrImage.push(it);
          }

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

    setDataChecklistFaild([...mergedArrImage]);
    setDataChecklistDefault(mergedArrCheck);
    setNewActionDataChecklist([...mergedArrImage, ...mergedArrCheck]);
    setDataChecklistFilter(data);

    const data2Map = new Map(data.map((item) => [item.ID_Checklist, item]));

    const updatedData1 = dataChecklistFilterContext.map((item) =>
      data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
    );
    setDataChecklistFilterContext(updatedData1);
  };

  // click item checklist
  const handleItemClick = (value, it, key) => {
    const updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
      if (item.ID_Checklist === it.ID_Checklist) {
        return {
          ...item,
          valueCheck: value ? value : null,
          Gioht: moment().format("LTS"),
        };
      }
      return item;
    });

    const newItem = { ...it, Gioht: moment().format("LTS") };

    handleSetData(key, updatedDataChecklist, newItem);
  };

  const handleItemClear = (itemID) => {
    // Cập nhật dataChecklistFilter với item được clear
    const updatedDataChecklist = dataChecklistFilter?.map((item) => {
      if (item.ID_Checklist === itemID) {
        return {
          ...item,
          valueCheck: null, // Xóa giá trị của item này
          Gioht: moment().format("LTS"),
          Anh: null,
          Ghichu: null,
        };
      }
      return item; // Giữ nguyên các item khác
    });

    // Lọc lại newActionDataChecklist để loại bỏ item đã clear
    const updatedActionDataChecklist = newActionDataChecklist.filter(
      (item) => item.ID_Checklist !== itemID
    );

    // Cập nhật lại dataChecklistDefault nếu item thuộc về danh sách default
    const updatedDataChecklistDefault = defaultActionDataChecklist.filter(
      (item) => item.ID_Checklist !== itemID
    );

    // Cập nhật lại dataChecklistFaild
    const updatedDataChecklistFaild = dataChecklistFaild.filter(
      (item) => item.ID_Checklist !== itemID
    );

    // Cập nhật lại state sau khi xóa item
    setDataChecklistFilter(updatedDataChecklist);
    setNewActionDataChecklist(updatedActionDataChecklist);
    setDataChecklistDefault(updatedDataChecklistDefault);
    setDataChecklistFaild(updatedDataChecklistFaild);

    // Cập nhật dataChecklistFilterContext nếu cần
    const data2Map = new Map(
      updatedDataChecklist.map((item) => [item.ID_Checklist, item])
    );
    const updatedData1 = dataChecklistFilterContext.map((item) =>
      data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
    );
    setDataChecklistFilterContext(updatedData1);
  };

  // call api submit data checklsit
  const handleSubmit = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);

      if (networkState.isConnected) {
        setLoadingSubmit(true);
        setActiveAll(false);
        saveConnect(false);

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
      } else {
        await AsyncStorage.setItem("checkNetwork", "1");
        Alert.alert(
          "Không có kết nối mạng",
          "Vui lòng kiểm tra kết nối mạng của bạn."
        );
        saveConnect(true);
      }
    } catch (error) {
      // Cập nhật sau khi hoàn thành xử lý API} catch (error) {
      console.error("Lỗi khi kiểm tra kết nối mạng:", error);
      setLoadingSubmit(false);
    }
  };

  // api faild tb_checklistchitiet
  const handleDataChecklistFaild = async () => {
    try {
      setLoadingSubmit(true);
      // Create a new FormData instance
      const formData = new FormData();

      // Iterate over all items in dataChecklistFaild
      dataChecklistFaild.forEach((item, index) => {
        // Extract and append checklist details to formData
        formData.append("ID_ChecklistC", ID_ChecklistC);
        formData.append("ID_Checklist", item.ID_Checklist);
        formData.append("Ketqua", item.valueCheck || "");
        formData.append("Gioht", item.Gioht);
        formData.append("Ghichu", item.GhichuChitiet || "");
        formData.append("Vido", location?.coords?.latitude || "");
        formData.append("Kinhdo", location?.coords?.longitude || "");
        formData.append("Docao", location?.coords?.altitude || "");

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
          // formData.append("Anh", "");
          // formData.append(`Images_${index}`, {});
        }
      });

      // Send the entire FormData in a single request
      await axios
        .post(BASE_URL + `/tb_checklistchitiet/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((res) => {
          postHandleSubmit();
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", "Checklist thành công", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          setLoadingSubmit(false);
          Alert.alert(
            "PMC Thông báo",
            "Checklist thất bại. Vui lòng kiểm tra lại hình ảnh hoặc ghi chú!!!",
            [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]
          );
        });
    } catch (error) {
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
    const descriptions = defaultActionDataChecklist
      .map((item) => item.ID_Checklist)
      .join(",");

    const ID_Checklists = defaultActionDataChecklist.map(
      (item) => item.ID_Checklist
    );
    const Gioht = defaultActionDataChecklist.map((item) => item.Gioht);

    const requestDone = axios.post(
      BASE_URL + "/tb_checklistchitietdone/create",
      {
        Description: descriptions,
        ID_Checklists: ID_Checklists,
        ID_ChecklistC: ID_ChecklistC,
        Gioht: Gioht[0],
        checklistLength: defaultActionDataChecklist.length,
        Vido: location?.coords?.latitude || "",
        Kinhdo: location?.coords?.longitude || "",
        Docao: location?.coords?.altitude || "",
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
    try {
      setLoadingSubmit(true);
      // Tạo một đối tượng FormData để chứa dữ liệu của dataChecklistFaild
      const formData = new FormData();

      // Lặp qua từng phần tử trong dataChecklistFaild để thêm vào FormData
      dataChecklistFaild.forEach((item, index) => {
        formData.append("ID_ChecklistC", ID_ChecklistC);
        formData.append("ID_Checklist", item.ID_Checklist);
        formData.append("Ketqua", item.valueCheck || "");
        formData.append("Gioht", item.Gioht);
        formData.append("Ghichu", item.GhichuChitiet || "");
        formData.append("Vido", location?.coords?.latitude || "");
        formData.append("Kinhdo", location?.coords?.longitude || "");
        formData.append("Docao", location?.coords?.altitude || "");

        // Nếu có hình ảnh, thêm vào FormData
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
        }
      });

      // Chuẩn bị dữ liệu cho yêu cầu thứ hai
      const descriptions = defaultActionDataChecklist
        .map((item) => item.ID_Checklist)
        .join(",");

      const ID_Checklists = defaultActionDataChecklist.map(
        (item) => item.ID_Checklist
      );

      // Tạo các yêu cầu API
      const requestFaild = axios.post(
        `${BASE_URL}/tb_checklistchitiet/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const requestDone = axios.post(
        `${BASE_URL}/tb_checklistchitietdone/create`,
        {
          Description: descriptions,
          ID_Checklists: ID_Checklists,
          ID_ChecklistC: ID_ChecklistC,
          Gioht: defaultActionDataChecklist[0].Gioht,
          checklistLength: defaultActionDataChecklist.length,
          Vido: location?.coords?.latitude || "",
          Kinhdo: location?.coords?.longitude || "",
          Docao: location?.coords?.altitude || "",
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Gọi cả hai API cùng lúc
      axios
        .all([requestFaild, requestDone])
        .then(
          axios.spread((faildResponse, doneResponse) => {
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
          })
        )
        .catch((error) => {
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
          } else if (error.request) {
            // Xử lý lỗi yêu cầu (không nhận được phản hồi từ server)
            Alert.alert(
              "PMC Thông báo",
              "Network error. Please try again later.",
              [
                {
                  text: "Hủy",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
              ]
            );
          } else {
            Alert.alert(
              "PMC Thông báo",
              "An error occurred. Please try again later.",
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
        });
    } catch (error) {
      setLoadingSubmit(false);
      Alert.alert(
        "PMC Thông báo",
        "An error occurred. Please try again later.",
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

  // Thiết lập lại dữ liệu sau khi hoàn thành xử lý API
  const postHandleSubmit = () => {
    const idsToRemove = new Set([
      ...defaultActionDataChecklist.map((item) => item.ID_Checklist),
      ...dataChecklistFaild.map((item) => item.ID_Checklist),
    ]);

    // Filter out items in dataChecklistFilterContext that are present in idsToRemove
    const dataChecklistFilterContextReset = dataChecklistFilterContext.filter(
      (item) => !idsToRemove.has(item.ID_Checklist)
    );
    if (dataChecklistFilter?.length === newActionDataChecklist?.length) {
      const filteredData = hangMuc.filter(
        (item) => item.ID_Hangmuc !== ID_Hangmuc
      );
      const filteredDataDefault = HangMucDefault.filter(
        (item) => item.ID_Hangmuc !== ID_Hangmuc
      );
      setHangMucDefault(filteredDataDefault);

      setHangMuc(filteredData);
      navigation.goBack();
    }
    const dataChecklist = dataChecklistFilterContextReset?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );

    setDataChecklistFilter(dataChecklist);
    // Update state with the filtered context
    setDataChecklistFilterContext(dataChecklistFilterContextReset);
    // Optionally, reset newActionDataChecklist, defaultActionDataChecklist, and dataChecklistFaild if needed
    setNewActionDataChecklist([]);
    setDataChecklistDefault([]);
    setDataChecklistFaild([]);
  };

  // close modal bottomsheet
  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      handleCloseModal();
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
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePopupActiveTieuChuan = useCallback((item, index) => {
    setOpacity(0.2);
    setTieuchuan(item.Tieuchuan);
    setModalVisibleTieuChuan(true);
    setIndex(index);
  }, []);

  // close modal bottom sheet
  const handlePopupClear = useCallback(() => {
    setOpacity(1);
    setDataItem(null);
    setModalVisible(false);
    setIndex(null);
    bottomSheetModalRef.current?.close();
  }, []);

  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <View
        style={[
          styles.content,
          {
            backgroundColor: `${item?.Tinhtrang}` === "1" ? "#ea9999" : "white",
          },
        ]}
        key={item?.ID_Checklist}
      >
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
            {item?.isCheck == 0 && (
              <>
                {item?.valueCheck !== null ? (
                  <ActiveChecklist
                    item={item}
                    index={index}
                    size={adjust(30)}
                    handleToggle={() => {
                      handleItemClear(item?.ID_Checklist);
                    }}
                  />
                ) : (
                  <ActiveChecklist
                    item={item}
                    index={index}
                    size={adjust(30)}
                    handleToggle={() =>
                      handleItemClick(item?.Giatridinhdanh, item, "active")
                    }
                  />
                )}
              </>
            )}

            <View style={{ width: "90%" }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(16),
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
              <MaterialIcons name="read-more" size={adjust(30)} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePopupActive(item, index)}>
              <Entypo
                name="dots-three-vertical"
                size={adjust(30)}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={[styles.text, { fontSize: 17 }]}
                        >
                          Hạng mục: {Hangmuc}
                        </Text>
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {decimalNumber(dataChecklistFilter?.length)}{" "}
                          Checklist
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text allowFontScaling={false} style={styles.text}>
                            Đang checklist:{" "}
                            {decimalNumber(newActionDataChecklist?.length)}
                          </Text>
                          {hangMuc[0]?.FileTieuChuan !== null &&
                            hangMuc[0]?.FileTieuChuan !== undefined && (
                              <View>
                                <TouchableOpacity
                                  onPress={() => setShow(true)}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="bookmark"
                                    size={24}
                                    color="white"
                                  />
                                  <Text style={styles.text}>Tiêu chuẩn </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 12,
                  }}
                >
                  <Checkbox
                    isCheck={activeAll}
                    onPress={() => handleCheckAll(!activeAll)}
                    size={30}
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.text,
                      { paddingHorizontal: 12, fontSize: adjust(18) },
                    ]}
                  >
                    Chọn tất cả
                  </Text>
                </View>

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
                  <Button
                    text={"Hoàn Thành"}
                    isLoading={loadingSubmit}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => handleSubmit()}
                  />
                </View>
              </View>
            </ImageBackground>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <View style={styles.contentContainer}>
                <ModalPopupDetailChecklist
                  handlePopupClear={handlePopupClear}
                  dataItem={dataItem}
                  handleItemClick={handleItemClick}
                  index={index}
                  handleChange={handleChange}
                />
              </View>
            </BottomSheetModal>

            {/* Modal show tieu chuan  */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleTieuChuan}
              onRequestClose={() => {
                setModalVisibleTieuChuan(!modalVisibleTieuChuan);
              }}
            >
              <View style={[styles.centeredView, { height: "100%" }]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      width: "60%",
                      height: "auto",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignContent: "center",
                    },
                  ]}
                >
                  <ScrollView>
                    <Text
                      allowFontScaling={false}
                      style={{ paddingBottom: 30 }}
                    >
                      {tieuchuan}{" "}
                    </Text>
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
              animationType={"slide"}
              transparent={false}
              visible={show}
              onRequestClose={() => {
                console.log("Modal has been closed.");
              }}
            >
              <TouchableOpacity onPress={() => setShow(false)}>
                <Ionicons
                  name="close"
                  size={40}
                  color="black"
                  style={{
                    paddingTop: 50,
                    textAlign: "right",
                    paddingRight: 30,
                  }}
                />
              </TouchableOpacity>
              {hangMuc[0]?.FileTieuChuan !== null &&
                hangMuc[0]?.FileTieuChuan !== undefined && (
                  <WebView
                    customStyle={{
                      readerContainerNavigateArrow: true,
                      readerContainerNavigate: true,
                    }}
                    style={{ flex: 1 }}
                    source={{
                      uri: hangMuc[0]?.FileTieuChuan,
                    }}
                  />
                )}
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(15), color: "white", fontWeight: "600" },
  headerTable: {
    color: "white",
  },
  outter: {
    width: adjust(20),
    height: adjust(20),
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
    // flex: 1,
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
    fontSize: adjust(20),
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
