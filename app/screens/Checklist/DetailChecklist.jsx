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
  BackHandler,
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
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImageManipulator from "expo-image-manipulator";
import NetInfo from "@react-native-community/netinfo";
import { COLORS, SIZES } from "../../constants/theme";
import ActiveChecklist from "../../components/Active/ActiveCheckList";
import Button from "../../components/Button/Button";
import ModalPopupDetailChecklist from "../../components/Modal/ModalPopupDetailChecklist";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";

import adjust from "../../adjust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "../../components/Active/Checkbox";
import ConnectContext from "../../context/ConnectContext";
import WebView from "react-native-webview";
import { useHeaderHeight } from "@react-navigation/elements";
import ModalBottomSheet from "../../components/Modal/ModalBottomSheet";
import axiosClient from "../../api/axiosClient";

const DetailChecklist = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Hangmuc, Hangmuc, isScan } =
    route.params;

  const dispath = useDispatch();
  const { isLoadingDetail } = useSelector((state) => state.entReducer);
  const {
    setHangMucFilterByIDChecklistC,
    hangMucFilterByIDChecklistC,
    khuVucFilterByIDChecklistC,
    setKhuVucFilterByIDChecklistC,
    setHangMucByKhuVuc,
    hangMucByKhuVuc,
    setDataChecklistSize,
  } = useContext(DataContext);

  const { isConnect, saveConnect } = useContext(ConnectContext);
  const { dataChecklistFilterContext, setDataChecklistFilterContext } =
    useContext(ChecklistContext);

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
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [activeAll, setActiveAll] = useState(false);
  const [location, setLocation] = useState();
  const [show, setShow] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const headerHeight = useHeaderHeight();
  const [isConnected, setConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let locationSubscription;

    const watchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 8000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation(location);
        }
      );
    };

    watchLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isBottomSheetOpen) {
        handleBackAnroid();
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

  useEffect(() => {
    const dataChecklist = dataChecklistFilterContext?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );

    const dataChecklistAction = dataChecklist.filter(
      (item) => item.valueCheck !== null
    );
    const dataChecklistDefault = dataChecklistAction.filter(
      (item) =>
        item.valueCheck == item.Giatridinhdanh &&
        item.GhichuChitiet == "" &&
        item.Anh == null
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

  const handleCheckAll = (value) => {
    setActiveAll(value);
    // value == false
    if (value) {
      const updateDataChecklist = dataChecklistFilter?.map((item, i) => {
        if (
          item.Anh == null &&
          item.GhichuChitiet == "" &&
          item.isCheck == 0 &&
          item.Tinhtrang == 0
        ) {
          if (item.valueCheck == null) {
            return {
              ...item,
              valueCheck: item.Giatridinhdanh,
              Gioht: moment().format("LTS"),
              isScan: isScan,
            };
          } else if (item.valueCheck == item.Giatridinhdanh) {
            return {
              ...item,
              valueCheck: item.Giatridinhdanh,
              Gioht: moment().format("LTS"),
              isScan: isScan,
            };
          } else {
            return {
              ...item,
              Gioht: moment().format("LTS"),
              isScan: isScan,
            };
          }
        } else if (
          (item.Anh !== null || item.GhichuChitiet !== "") &&
          item.isCheck == 0 &&
          item.Tinhtrang == 0
        ) {
          if (item.valueCheck == null) {
            return {
              ...item,
              valueCheck: item.Giatridinhdanh,
              Gioht: moment().format("LTS"),
              isScan: isScan,
            };
          } else if (item.valueCheck == item.Giatridinhdanh) {
            return {
              ...item,
              valueCheck: item.Giatridinhdanh,
              Gioht: moment().format("LTS"),
              isScan: isScan,
            };
          } else {
            return {
              ...item,
              Gioht: moment().format("LTS"),
              isScan: isScan,
            };
          }
        } else {
          return {
            ...item,
            Gioht: moment().format("LTS"),
            isScan: isScan,
          };
        }
      });

      const dataChecklistAction = updateDataChecklist.filter(
        (item) => item.valueCheck !== null
      );

      const dataChecklistDefault = dataChecklistAction.filter(
        (item) =>
          item.valueCheck == item.Giatridinhdanh &&
          item.GhichuChitiet == "" &&
          item.Anh == null
      );

      const DetaildataChecklistFaild = dataChecklistFaild?.map((item) => {
        if (item.valueCheck == null) {
          return {
            ...item,
            valueCheck: item.Giatridinhdanh,
            isScan: isScan,
          };
        }
        return item;
      });

      setDataChecklistFilter(updateDataChecklist);
      setNewActionDataChecklist(dataChecklistAction);
      setDataChecklistDefault(dataChecklistDefault);
      setDataChecklistFaild(DetaildataChecklistFaild);

      const data2Map = new Map(
        updateDataChecklist.map((item) => [item.ID_Checklist, item])
      );

      const updatedData1 = dataChecklistFilterContext.map((item) =>
        data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
      );
      setDataChecklistFilterContext(updatedData1);
    } else {
      const revertDataChecklist = dataChecklistFilter?.map((item) => {
        if (
          item.Anh == null &&
          item.GhichuChitiet == "" &&
          item.isCheck == 0 &&
          item.Tinhtrang == 0 &&
          item.valueCheck == item.Giatridinhdanh
        ) {
          return {
            ...item,
            valueCheck: null,
            Gioht: moment().format("LTS"),
            isScan: isScan,
          };
        } else if (
          item.Anh == null &&
          item.GhichuChitiet == "" &&
          item.isCheck == 0 &&
          item.Tinhtrang == 1 &&
          item.valueCheck == item.Giatridinhdanh
        ) {
          return {
            ...item,
            valueCheck: null,
          };
        } else {
          return {
            ...item,
          };
        }
      });

      setDataChecklistFilter(revertDataChecklist);
      setDataChecklistDefault([]);

      const data2Map = new Map(
        revertDataChecklist.map((item) => [item.ID_Checklist, item])
      );

      const updatedData1 = dataChecklistFilterContext.map((item) =>
        data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
      );

      const updatedData2 = revertDataChecklist.filter(
        (item) => item.valueCheck !== null
      );

      setNewActionDataChecklist(updatedData2);
      setDataChecklistFilterContext(updatedData1);
    }
  };

  // click item checklist
  const handleItemClick = (value, status, key, itemData) => {
    let updatedDataChecklist = [];
    let newItem = [];
    if (status == "close") {
      updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
        if (item.ID_Checklist == itemData.ID_Checklist) {
          return {
            ...item,
            Anh: value?.Anh ? value?.Anh : null,
            GhichuChitiet: value?.GhichuChitiet ? value?.GhichuChitiet : "",
            valueCheck: value?.valueCheck ? value?.valueCheck : null,
            Gioht: moment().format("LTS"),
            isScan: isScan,
          };
        }
        return item;
      });
      newItem = {
        ...itemData,
        Anh: value?.Anh ? value?.Anh : null,
        GhichuChitiet: value?.GhichuChitiet ? value?.GhichuChitiet : "",
        valueCheck: value?.valueCheck ? value?.valueCheck : null,
        Gioht: moment().format("LTS"),
        isScan: isScan,
      };
    } else {
      updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
        if (item.ID_Checklist == itemData.ID_Checklist) {
          return {
            ...item,
            [key]: value ? value : null,
            Gioht: moment().format("LTS"),
            isScan: isScan,
          };
        }
        return item;
      });

      newItem = {
        ...itemData,
        [key]: value ? value : null,
        Gioht: moment().format("LTS"),
        isScan: isScan,
      };
    }

    handleSetData(status, updatedDataChecklist, newItem);
  };

  // set data checklist
  const handleSetData = async (status, dataChecklist, it) => {
    let mergedArrDefault = [...defaultActionDataChecklist];
    let mergedArrOption = [...dataChecklistFaild];

    // newDataChecklist là data được chọn.
    let newDataChecklist = dataChecklist.filter(
      (item) => item.valueCheck !== null
    );
    const indexFaild = newDataChecklist.findIndex((item) => {
      //không để làm gì .
      return (
        item.ID_Checklist === it.ID_Checklist &&
        item.Giatridinhdanh === item.valueCheck &&
        it.Anh === null &&
        it.GhichuChitiet === ""
      );
    });

    if (it.valueCheck == null) {
      if (
        it.Anh !== null ||
        it.GhichuChitiet !== "" ||
        it.valueCheck !== it.Giatridinhdanh
      ) {
        const indexDefault = mergedArrDefault.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        );

        // Xóa phần tử nếu có trong mergedArrDefault
        if (indexDefault !== -1) {
          mergedArrDefault.splice(indexDefault, 1);
        }

        const existingItem = mergedArrOption.find(
          (item) => item.ID_Checklist === it.ID_Checklist
        );
        if (!existingItem) {
          mergedArrOption.push(it);
        } else {
          if (JSON.stringify(existingItem) !== JSON.stringify(it)) {
            const index = mergedArrOption.indexOf(existingItem);
            mergedArrOption[index] = it;
          }
        }
      } else {
      }
      const existingItem = mergedArrOption.find(
        (item) => item.ID_Checklist === it.ID_Checklist
      );

      if (!existingItem) {
        mergedArrOption.push(it);
      } else {
        if (JSON.stringify(existingItem) !== JSON.stringify(it)) {
          const index = mergedArrOption.indexOf(existingItem);
          mergedArrOption[index] = it;
        }
      }
    } else {
      if (status === "click") {
        if (
          it.Anh !== null ||
          it.GhichuChitiet !== "" ||
          it.valueCheck !== it.Giatridinhdanh
        ) {
          const indexDefault = mergedArrDefault.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );

          // Xóa phần tử nếu có trong mergedArrDefault
          if (indexDefault !== -1) {
            mergedArrDefault.splice(indexDefault, 1);
          }

          const existingItem = mergedArrOption.find(
            (item) => item.ID_Checklist === it.ID_Checklist
          );
          if (!existingItem) {
            mergedArrOption.push(it);
          } else {
            if (JSON.stringify(existingItem) !== JSON.stringify(it)) {
              const index = mergedArrOption.indexOf(existingItem);
              mergedArrOption[index] = it;
            }
          }
        } else {
          if (
            !mergedArrDefault.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrDefault.push(it);
          }
        }
      }

      if (status === "option" || status === "close") {
        // Kiểm tra nếu valueCheck !== Giatridinhdanh
        if (
          it.Anh !== null ||
          it.GhichuChitiet !== "" ||
          it.valueCheck !== it.Giatridinhdanh
        ) {
          // Tìm vị trí của phần tử trong mảng Default và Option
          const indexDefault = mergedArrDefault.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );

          const indexOption = mergedArrOption.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );

          // Xóa phần tử khỏi Default nếu tồn tại
          if (indexDefault !== -1) {
            mergedArrDefault.splice(indexDefault, 1);
          }

          // Nếu phần tử không tồn tại trong Option, thêm mới
          if (indexOption !== -1) {
            mergedArrOption[indexOption] = it;
          } else {
            mergedArrOption.push(it);
          }
        } else {
          // Nếu valueCheck === Giatridinhdanh
          const indexOption = mergedArrOption.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );

          // Xóa phần tử khỏi Option nếu tồn tại
          if (indexOption !== -1) {
            mergedArrOption.splice(indexOption, 1);
          }

          // Thêm vào Default nếu chưa tồn tại
          if (
            !mergedArrDefault.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrDefault.push(it);
          }
        }
      }
    }

    setDataChecklistFaild([...mergedArrOption]);
    setDataChecklistDefault(mergedArrDefault);
    setNewActionDataChecklist([...mergedArrOption, ...mergedArrDefault]);
    setDataChecklistFilter(dataChecklist);

    const data2Map = new Map(
      dataChecklist.map((item) => [item.ID_Checklist, item])
    );

    const updatedData = dataChecklistFilterContext.map((item) =>
      data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
    );
    setDataChecklistFilterContext(updatedData);
  };

  const handleItemClear = (itemID) => {
    // Cập nhật dataChecklistFilter với item được clear
    const updatedDataChecklist = dataChecklistFilter?.map((item) => {
      if (item.ID_Checklist === itemID) {
        return {
          ...item,
          valueCheck: null, // Xóa giá trị của item này
          Gioht: moment().format("LTS"),
          isScan: null,
          Anh: null,
          Ghichu: "",
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
      saveConnect(true);
      if (location == null) {
        Alert.alert(
          "PMC Thông báo",
          "Vui lòng đợi để xác định vị trí. Hãy xác thực lại trong vòng 1-2 giây!",
          [{ text: "OK", onPress: () => setLoadingSubmit(false) }]
        );
        return;
      } else {
        if (isConnected) {
          setLoadingSubmit(true);
          setActiveAll(false);
          saveConnect(false);

          if (
            defaultActionDataChecklist.length === 0 &&
            dataChecklistFaild.length === 0
          ) {
            Alert.alert("PMC Thông báo", "Không có checklist để kiểm tra!", [
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
            setLoadingSubmit(false);
            return;
          }

          if (
            defaultActionDataChecklist.length === 0 &&
            dataChecklistFaild.length > 0
          ) {
            const newDataChecklistFaild = dataChecklistFaild.map((item) => {
              return {
                ...item,
                Vido: location?.coords?.latitude || "",
                Kinhdo: location?.coords?.longitude || "",
                Docao: location?.coords?.altitude || "",
                isScan: isScan,
              };
            });
            await handleDataChecklistFaild(newDataChecklistFaild);
          } else if (
            defaultActionDataChecklist.length > 0 &&
            dataChecklistFaild.length == 0
          ) {
            const newDataChecklistDefault = defaultActionDataChecklist.map(
              (item) => {
                return {
                  ...item,
                  Vido: location?.coords?.latitude || "",
                  Kinhdo: location?.coords?.longitude || "",
                  Docao: location?.coords?.altitude || "",
                  isScan: isScan,
                };
              }
            );
            await handleDefaultActionDataChecklist(newDataChecklistDefault);
          }

          if (
            defaultActionDataChecklist.length > 0 &&
            dataChecklistFaild.length > 0
          ) {
            const newDataChecklistDefault = defaultActionDataChecklist.map(
              (item) => {
                return {
                  ...item,
                  Vido: location?.coords?.latitude || "",
                  Kinhdo: location?.coords?.longitude || "",
                  Docao: location?.coords?.altitude || "",
                  isScan: isScan,
                };
              }
            );
            const newDataChecklistFaild = dataChecklistFaild.map((item) => {
              return {
                ...item,
                Vido: location?.coords?.latitude || "",
                Kinhdo: location?.coords?.longitude || "",
                Docao: location?.coords?.altitude || "",
                isScan: isScan,
              };
            });
            await handleChecklistAll(
              newDataChecklistDefault,
              newDataChecklistFaild
            );
          }
        } else {
          // Mất kết nối mạng
          await AsyncStorage.setItem("checkNetwork", "close");
          Alert.alert(
            "Không có kết nối mạng",
            "Vui lòng kiểm tra kết nối mạng của bạn. Checklist đã được lưu, ra ngoài khu vực để hoàn thành khi có mạng"
          );
          saveConnect(true);

          // Kết hợp dữ liệu từ newDataChecklistDefault và newDataChecklistFaild
          const combinedData = [
            ...defaultActionDataChecklist,
            ...dataChecklistFaild,
          ];

          // Cập nhật location cho dataChecklistFilterContext
          const updateLocation = combinedData.map((item) => {
            return {
              ...item,
              Vido: location?.coords?.latitude || "",
              Kinhdo: location?.coords?.longitude || "",
              Docao: location?.coords?.altitude || "",
              isScan: isScan,
            };
          });

          // Tạo map từ updateLocation với ID_Checklist làm key
          const data2Map = new Map(
            updateLocation.map((item) => [item.ID_Checklist, item])
          );

          // Cập nhật dataChecklistFilterContext với các item có cùng ID_Checklist
          const updatedData1 = dataChecklistFilterContext.map((item) =>
            data2Map.has(item.ID_Checklist)
              ? { ...data2Map.get(item.ID_Checklist), ...item }
              : item
          );

          // Lưu lại kết quả cập nhật
          setDataChecklistFilterContext(updatedData1);
          // Dùng trong trường hợp checklist bị văng rá
          await AsyncStorage.setItem(
            `dataChecklistStorage_${ID_ChecklistC}`,
            JSON.stringify(updatedData1)
          );
        }
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra kết nối mạng:", error);
      setLoadingSubmit(false);
    }
  };
  // api tb_checklistchitiet
  const handleDataChecklistFaild = async (arrData) => {
    try {
      setLoadingSubmit(true);
  
      const formData = new FormData();
  
      // Kiểm tra dữ liệu
      const isCheckValueCheck = arrData.some(
        (item) => item.valueCheck == null || item.valueCheck == ""
      );
  
      if (isCheckValueCheck) {
        setLoadingSubmit(false);
        Alert.alert("PMC Thông báo", "Chưa có dữ liệu checklist", [
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
        return;
      }
      // Duyệt qua tất cả các item
      for (const [index, item] of arrData.entries()) {
        formData.append("Key_Image", 1);
        formData.append("ID_ChecklistC", ID_ChecklistC);
        formData.append("ID_Checklist", item.ID_Checklist);
        formData.append("Ketqua", item.valueCheck || "");
        formData.append("Gioht", item.Gioht);
        formData.append("Ghichu", item.GhichuChitiet || "");
        formData.append("Vido", item.Vido || "");
        formData.append("Kinhdo", item.Kinhdo || "");
        formData.append("Docao", item.Docao || "");
        formData.append("isScan", isScan || null);
  
        if (item.Anh && Array.isArray(item.Anh)) {
          // Use a for...of loop to wait for asynchronous tasks
          for (const [imgIndex, image] of item.Anh.entries()) {
            try {
              // Resize và nén ảnh trước khi append vào formData
              const resizedImage = await ImageManipulator.manipulateAsync(
                Platform.OS === "android"
                  ? image.uri
                  : image.uri.replace("file://", ""),
                [{ resize: { width: image.width * 0.8 } }], // Resize nhỏ hơn 50%
                { compress: 0.8, format: ImageManipulator.SaveFormat.PNG } // Nén ảnh
              );
  
              const file = {
                uri: resizedImage.uri,
                name:
                  image.fileName ||
                  `${Math.floor(Math.random() * 9999999)}_${item.ID_Checklist}_${imgIndex}.png`,
                type: "image/png",
              };
  
              formData.append(
                `Images_${index}_${item.ID_Checklist}_${imgIndex}`,
                file
              );
            } catch (error) {
              console.error("Error resizing image: ", error);
            }
          }
        }
      }
  
      // Gửi toàn bộ formData lên server
      const response = await axios.post(
        BASE_URL + `/tb_checklistchitiet/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
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
    } catch (error) {
      setLoadingSubmit(false);
  
      if (error.response) {
        Alert.alert("PMC Thông báo", error.response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        Alert.alert(
          "PMC Thông báo",
          "Checklist thất bại. Vui lòng kiểm tra lại hình ảnh hoặc ghi chú!",
          [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]
        );
      }
    }
  };
  

  // api tb_checklistchitietdone
  const handleDefaultActionDataChecklist = async (arrData) => {
    // Xử lý API cho defaultActionDataChecklist
    const descriptions = arrData.map((item) => item.ID_Checklist).join(",");

    const ID_Checklists = arrData.map((item) => item.ID_Checklist);
    const valueChecks = arrData.map((item) => item.valueCheck);
    const Gioht = arrData.map((item) => item.Gioht);
    const requestDone = await axios.post(
      BASE_URL + "/tb_checklistchitietdone/create",
      {
        Description: descriptions,
        ID_Checklists: ID_Checklists,
        ID_ChecklistC: ID_ChecklistC,
        valueChecks: valueChecks,
        Gioht: Gioht[0],
        checklistLength: arrData.length,
        Vido: location?.coords?.latitude || "",
        Kinhdo: location?.coords?.longitude || "",
        Docao: location?.coords?.altitude || "",
        isScan: isScan,
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
  const handleChecklistAll = async (dataDefault, dataFaild) => {
    try {
      setLoadingSubmit(true);
      // Tạo một đối tượng FormData để chứa dữ liệu của dataChecklistFaild
      const formData = new FormData();
      const isCheckValueCheck = dataFaild.some(
        (item) => item.valueCheck == null || item.valueCheck == ""
      );

      if (isCheckValueCheck) {
        setLoadingSubmit(false);
        Alert.alert("PMC Thông báo", "Chưa có dữ liệu checklist", [
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        // Lặp qua từng phần tử trong dataChecklistFaild để thêm vào FormData
        dataFaild.forEach(async (item, index) => {
          formData.append("Key_Image", 1);
          formData.append("ID_ChecklistC", ID_ChecklistC);
          formData.append("ID_Checklist", item.ID_Checklist);
          formData.append("Ketqua", item.valueCheck || "");
          formData.append("Gioht", item.Gioht);
          formData.append("Ghichu", item.GhichuChitiet || "");
          formData.append("Vido", item.Vido || "");
          formData.append("Kinhdo", item.Kinhdo || "");
          formData.append("Docao", item.Docao || "");
          formData.append("isScan", isScan || null);

          // Nếu có hình ảnh, thêm vào FormData
          if (item.Anh && Array.isArray(item.Anh)) {
            for (const [imgIndex, image] of item.Anh.entries()) {
              try {
                // Resize và nén ảnh trước khi append vào formData
                const resizedImage = await ImageManipulator.manipulateAsync(
                  Platform.OS === "android"
                    ? image.uri
                    : image.uri.replace("file://", ""),
                  [{ resize: { width: image.width * 0.8 } }], // Resize nhỏ hơn 50%
                  { compress: 0.8, format: ImageManipulator.SaveFormat.PNG } // Nén ảnh
                );
    
                const file = {
                  uri: resizedImage.uri,
                  name:
                    image.fileName ||
                    `${Math.floor(Math.random() * 9999999)}_${item.ID_Checklist}_${imgIndex}.png`,
                  type: "image/png",
                };
    
                formData.append(
                  `Images_${index}_${item.ID_Checklist}_${imgIndex}`,
                  file
                );
              } catch (error) {
                console.error("Error resizing image: ", error);
              }
            }
          }
        });
        // Chuẩn bị dữ liệu cho yêu cầu thứ hai
        const descriptions = dataDefault
          .map((item) => item.ID_Checklist)
          .join(",");

        const ID_Checklists = dataDefault.map((item) => item.ID_Checklist);
        const valueChecks = dataDefault.map((item) => item.valueCheck);

        // Tạo các yêu cầu API
        const requestFaild = await axios.post(
          `${BASE_URL}/tb_checklistchitiet/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const requestDone = await axios.post(
          `${BASE_URL}/tb_checklistchitietdone/create`,
          {
            Description: descriptions,
            ID_Checklists: ID_Checklists,
            ID_ChecklistC: ID_ChecklistC,
            valueChecks: valueChecks,
            Gioht: dataDefault[0].Gioht,
            checklistLength: dataDefault.length,
            Vido: dataDefault[0].Vido || "",
            Kinhdo: dataDefault[0].Kinhdo || "",
            Docao: dataDefault[0].Docao || "",
            isScan: isScan || null,
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
                  {
                    text: "Xác nhận",
                    onPress: () => console.log("OK Pressed"),
                  },
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
                  {
                    text: "Xác nhận",
                    onPress: () => console.log("OK Pressed"),
                  },
                ]
              );
            }
          });
      }
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
  const postHandleSubmit = async () => {
    const idsToRemove = new Set([
      ...defaultActionDataChecklist.map((item) => item.ID_Checklist),
      ...dataChecklistFaild.map((item) => item.ID_Checklist),
    ]);

    // Filter out items in dataChecklistFilterContext that are present in idsToRemove
    const dataChecklistFilterContextReset = dataChecklistFilterContext.filter(
      (item) => !idsToRemove.has(item.ID_Checklist)
    );
    if (dataChecklistFilter?.length == newActionDataChecklist?.length) {
      // Lọc theo hạng mục thuộc khu vực trong ca
      const filteredData = hangMucByKhuVuc?.filter(
        (item) => item.ID_Hangmuc !== ID_Hangmuc
      );
      // Lọc theo hạng mục tất cả trong ca
      const filteredDataDefault = hangMucFilterByIDChecklistC?.filter(
        (item) => item.ID_Hangmuc !== ID_Hangmuc
      );
      setHangMucFilterByIDChecklistC(filteredDataDefault);
      setHangMucByKhuVuc(filteredData);
      navigation.goBack();
    }
    const dataChecklist = dataChecklistFilterContextReset?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );

    setDataChecklistFilter(dataChecklist);
    setDataChecklistFilterContext(dataChecklistFilterContextReset);
    setDataChecklistSize(dataChecklistFilterContextReset?.length);
    setNewActionDataChecklist([]);
    setDataChecklistDefault([]);
    setDataChecklistFaild([]);
  };

  // close modal bottomsheet

  const handlePopupActiveTieuChuan = useCallback((item, index) => {
    setOpacity(0.2);
    setTieuchuan(item.Tieuchuan);
    setIndex(index);
  }, []);

  // close modal bottom sheet
  const handlePopupClear = useCallback(() => {
    setOpacity(1);
    setDataItem(null);
    setModalVisible(false);
    setIndex(null);
    bottomSheetModalRef?.current?.close();
  }, []);

  const handleBackAnroid = async () => {
    setOpacity(1);
    setDataItem(null);
    setModalVisible(false);
    setIndex(null);
    bottomSheetModalRef?.current?.close();
    setIsBottomSheetOpen(false);
  };

  const handleBottom = useCallback((item, index) => {
    setIsBottomSheetOpen(true);
    setDataItem(item);
    setIndex(index);
    setOpacity(0.2);
  }, []);

  const handleClearBottom = useCallback((item, index) => {
    setOpacity(1);
    setDataItem(null);
    setIndex(null);
    setIsBottomSheetOpen(false);
  }, []);

  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <View
        style={[
          styles.content,
          {
            backgroundColor:
              `${item.isCheck}` == 1
                ? "white"
                : `${item?.Tinhtrang}` === "1"
                ? "#ea9999"
                : "white",
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
                      handleItemClick(
                        item?.Giatridinhdanh,
                        "click",
                        "valueCheck",
                        item
                      )
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
            {item.Tieuchuan !== "" && item.Tieuchuan !== null ? (
              <TouchableOpacity
                onPress={() => handlePopupActiveTieuChuan(item, index)}
              >
                <Image
                  source={require("../../../assets/icons/ic_certificate.png")}
                  style={{
                    width: adjust(30),
                    height: adjust(30),
                    tintColor: "black",
                  }}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  width: adjust(30),
                  height: adjust(30),
                }}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                // if (user.isError == 1) {
                //   handleBottom(item, index);
                // } else {
                //   handlePopupActive(item, index), setIsBottomSheetOpen(true);
                // }
                handleBottom(item, index);
              }}
            >
              <Image
                source={require("../../../assets/icons/ic_ellipsis.png")}
                style={{
                  tintColor: "black",
                  resizeMode: "contain",
                  transform: [{ rotate: "90deg" }],
                }}
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
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : null}
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
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={[styles.text, { fontSize: 17 }]}
                        >
                          Hạng mục: {Hangmuc?.Hangmuc}
                        </Text>
                        {Hangmuc.Important === 1 && (
                          <Image
                            source={require("../../../assets/icons/ic_star.png")}
                            style={{
                              width: 20,
                              height: 20,
                              marginLeft: 5,
                              tintColor: "white",
                            }}
                          />
                        )}
                      </View>
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
                        {Hangmuc?.FileTieuChuan !== null &&
                          Hangmuc?.FileTieuChuan !== undefined &&
                          Hangmuc?.FileTieuChuan !== "" && (
                            <View>
                              <TouchableOpacity
                                onPress={() => {
                                  setShow(true);
                                }}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={require("../../../assets/icons/ic_bookmark.png")}
                                  style={{
                                    tintColor: "white",
                                    resizeMode: "contain",
                                  }}
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
                        marginBottom: 80,
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

              {isLoadingDetail === true && dataChecklistFilter?.length == 0 && (
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
                      Không còn checklist cho hạng mục này
                    </Text>
                  </View>
                )}
              <View
                style={{
                  position: "absolute",
                  bottom: 20,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Button
                  text={
                    loadingSubmit || !location
                      ? "Đang tải dữ liệu"
                      : "Hoàn Thành"
                  }
                  isLoading={loadingSubmit || !location}
                  backgroundColor={
                    loadingSubmit || !location ? "gray" : COLORS.bg_button
                  }
                  color={"white"}
                  onPress={() => handleSubmit()}
                />
              </View>
            </View>
          </ImageBackground>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isBottomSheetOpen}
            onRequestClose={() => {
              //  setIsBottomSheetOpen(!isBottomSheetOpen);
              //  setOpacity(1);
              handleClearBottom();
            }}
          >
            <View style={[styles.centeredView, { height: "100%" }]}>
              <View
                style={[
                  styles.modalView,
                  {
                    width: "90%",
                    height: "auto",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignContent: "center",
                  },
                ]}
              >
                <ModalPopupDetailChecklist
                  handlePopupClear={handlePopupClear}
                  dataItem={dataItem}
                  handleItemClick={handleItemClick}
                  index={index}
                  // handleChange={handleChange}
                  handleClearBottom={handleClearBottom}
                  user={user}
                />
              </View>
            </View>
          </Modal>
          {/* <ModalBottomSheet
            visible={visibleBottom}
            setVisible={setVisibleBottom}
            setOpacity={setOpacity}
          >
            <ModalPopupDetailChecklist
              handlePopupClear={handlePopupClear}
              dataItem={dataItem}
              handleItemClick={handleItemClick}
              index={index}
              handleClearBottom={handleClearBottom}
              user={user}
            />
          </ModalBottomSheet> */}

          {/* Modal show tieu chuan  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
              setOpacity(1);
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
                  <Text allowFontScaling={false} style={{ paddingBottom: 30 }}>
                    {tieuchuan}{" "}
                  </Text>
                </ScrollView>
                <Button
                  text={"Đóng"}
                  backgroundColor={COLORS.bg_button}
                  color={"white"}
                  onPress={() => {
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
              setShow(false);
            }}
          >
            <TouchableOpacity onPress={() => setShow(false)}>
              <Image
                source={require("../../../assets/icons/ic_close.png")}
                style={{
                  width: adjust(30),
                  height: adjust(30),
                  marginTop: 40,
                  textAlign: "right",
                  marginRight: 20,
                  marginBottom: 10,
                  alignSelf: "flex-end",
                }}
              />
            </TouchableOpacity>
            {Hangmuc?.FileTieuChuan && (
              <View
                style={{
                  flex: 1,
                }}
              >
                {loading && (
                  <View
                    style={{
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                    }}
                  >
                    <ActivityIndicator size="large" color="gray" />
                  </View>
                )}

                <WebView
                  style={{ flex: 1 }}
                  source={{
                    uri: Hangmuc.FileTieuChuan,
                  }}
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)}
                />
              </View>
            )}
          </Modal>
        </BottomSheetModalProvider>
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
