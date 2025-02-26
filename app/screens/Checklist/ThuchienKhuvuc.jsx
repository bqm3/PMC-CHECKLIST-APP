import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Linking,
  RefreshControl,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ent_checklist_mul_hm, ent_checklist_mul_hm_return, ent_get_sdt_KhanCap } from "../../redux/actions/entActions";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../../constants/config";
import QRCodeScreen from "../QRCodeScreen";
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";
import adjust from "../../adjust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import ConnectContext from "../../context/ConnectContext";
import axiosClient from "../../api/axiosClient";

const ThucHienKhuvuc = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Calv, ID_Hangmucs } = route.params;

  const {
    setDataChecklists,
    dataChecklists,
    setHangMucFilterByIDChecklistC,
    hangMucFilterByIDChecklistC,
    khuVucFilterByIDChecklistC,
    setKhuVucFilterByIDChecklistC,
    setHangMucByKhuVuc,
    dataChecklistByCa,
    setDataChecklistByCa,
  } = useContext(DataContext);
  const { setDataChecklistFilterContext, dataChecklistFilterContext } = useContext(ChecklistContext);

  const dispath = useDispatch();
  const { ent_khuvuc, ent_checklist_detail, ent_checklist_detail_return, ent_hangmuc, sdt_khancap } = useSelector((state) => state.entReducer);
  const { isConnect, saveConnect } = useContext(ConnectContext);

  const { user, authToken } = useSelector((state) => state.authReducer);

  const [opacity, setOpacity] = useState(1);
  const [submit, setSubmit] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [dataKhuvuc, setDataKhuvuc] = useState([]); // Lưu khu vực hiển thị
  const [dataSelect, setDataSelect] = useState([]);

  // Checklist context
  const [defaultActionDataChecklist, setDataChecklistDefault] = useState([]);
  const [dataChecklistFaild, setDataChecklistFaild] = useState([]);

  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    dispath(ent_get_sdt_KhanCap());
  },[])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoadingDetail) {
      const timer = setTimeout(() => {
        setIsLoadingDetail(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoadingDetail]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      const filteredItems = dataChecklistFilterContext.filter((item) => item.valueCheck !== null);
      if (filteredItems.length === 0) {
        return;
      }

      e.preventDefault();
      Alert.alert("PMC", "Thoát khỏi khu vực sẽ mất hết checklist đã kiểm tra. Vui lòng xác nhận", [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });

    return unsubscribe;
  }, [navigation, dataChecklistFilterContext]);

  // Call API Checklist còn theo ID_ChecklistC
  const init_checklist = async () => {
    await dispath(ent_checklist_mul_hm(ID_Hangmucs, ID_Calv, ID_ChecklistC, ID_KhoiCV));
  };

  useEffect(() => {
    if (dataChecklists) {
      // Lấy danh sách ID_Hangmuc từ dataChecklists
      const checklistIDs = dataChecklists.map((item) => item.ID_Hangmuc);
      // Lọc filteredByKhuvuc để chỉ giữ lại các mục có ID_Hangmuc tồn tại trong checklistIDs
      const filterDataHangMuc = ent_hangmuc.filter((item) => checklistIDs.includes(item.ID_Hangmuc));
      setHangMucFilterByIDChecklistC(filterDataHangMuc);
      const validKhuvucIDs = filterDataHangMuc.map((item) => item.ID_Khuvuc);

      const filterDataKhuVuc = ent_khuvuc.filter((item) => validKhuvucIDs.includes(item.ID_Khuvuc));

      setKhuVucFilterByIDChecklistC(filterDataKhuVuc);

      // Lọc danh sách hạng mục dựa trên ID_Khuvuc có trong validKhuvucIDs
      const filteredHangMuc = filterDataKhuVuc.map((khuvuc) => {
        // Đếm số lượng hạng mục còn lại trong từng khu vực
        const hangMucCount = filterDataHangMuc.filter((hangmuc) => hangmuc.ID_Khuvuc === khuvuc.ID_Khuvuc).length;

        // Gắn số lượng hạng mục vào từng khu vực
        return {
          ...khuvuc,
          hangMucCount,
        };
      });
      // Cập nhật trạng thái hangMuc với danh sách đã lọc
      setDataKhuvuc(filteredHangMuc);
    }
  }, [dataChecklists]);

  useEffect(() => {
    const fetchNetworkStatus = async () => {
      try {
        // Retrieve the item from AsyncStorage
        const network = await AsyncStorage.getItem("checkNetwork");
        const savedData = await AsyncStorage.getItem(`dataChecklistStorage_${ID_ChecklistC}`);
        if ((network === "close" && isConnect) || (savedData !== null && savedData !== undefined && savedData !== "")) {
          setSubmit(true);
        }

        if (network === null && (savedData == null || savedData == undefined || savedData == "")) {
          setSubmit(false);
        }
      } catch (error) {
        // Handle any errors that occur
        console.log("Error fetching network status:", error);
        setSubmit(false);
      }
    };

    // Call the async function
    fetchNetworkStatus();
  }, [dataChecklistFilterContext, isConnect]);

  useFocusEffect(
    React.useCallback(() => {
      init_checklist();
      return () => {};
    }, [dispath])
  );

  // Tải lại dữ liệu khi vào lại trang
  const loadData = async () => {
    const savedData = await AsyncStorage.getItem(`dataChecklistStorage_${ID_ChecklistC}`);
    if (savedData !== null && savedData !== undefined && savedData !== "") {
      setDataChecklists(JSON.parse(savedData));
      setDataChecklistFilterContext(JSON.parse(savedData));
    } else {
      setDataChecklists(ent_checklist_detail);
      setDataChecklistFilterContext(ent_checklist_detail);
    }
  };

  const init_checklist_return = async () => {
    await dispath(ent_checklist_mul_hm_return(ID_Hangmucs, ID_Calv, ID_ChecklistC));
  };

  useEffect(() => {
    loadData();
  }, [ent_checklist_detail]);

  useFocusEffect(
    React.useCallback(() => {
      init_checklist_return();
      return () => {};
    }, [dispath])
  );

  // Tải lại dữ liệu khi vào lại trang
  const loadDataReturn = async () => {
    setDataChecklistByCa(ent_checklist_detail_return);
  };

  useEffect(() => {
    loadDataReturn();
  }, [ent_checklist_detail_return]);

  useEffect(() => {
    const dataChecklistAction = dataChecklistFilterContext?.filter((item) => item.valueCheck !== null);
    const dataChecklistDefault = dataChecklistAction?.filter(
      (item) => item.valueCheck === item.Giatridinhdanh && item.GhichuChitiet === "" && item.Anh === null
    );

    const dataChecklistActionWithoutDefault = dataChecklistAction?.filter(
      (item) => !dataChecklistDefault.some((defaultItem) => defaultItem.ID_Checklist === item.ID_Checklist)
    );

    setDataChecklistDefault(dataChecklistDefault);
    setDataChecklistFaild(dataChecklistActionWithoutDefault);
  }, [dataChecklistFilterContext]);

  const handlePushDataFilterQr = (value) => {
    const cleanedValue = value.trim().toLowerCase();
    const resDataKhuvuc = dataChecklists.filter((item) => item.ent_khuvuc.MaQrCode.trim().toLowerCase() === cleanedValue);

    const resDataKhuvucAll = dataChecklistByCa.filter((item) => item.ent_khuvuc.MaQrCode.trim().toLowerCase() === cleanedValue);

    const resDataHangmuc = dataChecklists.filter((item) => item.ent_hangmuc.MaQrCode.trim().toLowerCase() === cleanedValue);

    const resDataHangmucAll = dataChecklistByCa.filter((item) => item.ent_hangmuc.MaQrCode.trim().toLowerCase() === cleanedValue);

    if (resDataKhuvuc?.length === 0 && resDataHangmuc?.length === 0) {
      const alertMessage =
        resDataKhuvucAll.length >= 1 || resDataHangmucAll.length >= 1
          ? `Khu vực hoặc hạng mục có QR code: "${cleanedValue}" này đã kiểm tra`
          : `Khu vực hoặc hạng mục có QR code: "${cleanedValue}" này không thuộc ca làm việc`;

      Alert.alert("PMC Thông báo", alertMessage, [{ text: "Hủy", style: "cancel" }, { text: "Xác nhận" }]);
    }

    if (resDataKhuvuc.length >= 1) {
      navigation.navigate("Thực hiện hạng mục", {
        ID_ChecklistC,
        ID_KhoiCV,
        ID_Calv,
        ID_Khuvuc: resDataKhuvuc[0].ID_Khuvuc,
        ID_Hangmucs,
      });
    }

    if (resDataHangmuc.length >= 1) {
      setHangMucByKhuVuc(resDataHangmuc);
      navigation.navigate("Chi tiết Checklist", {
        ID_ChecklistC,
        ID_KhoiCV,
        ID_Calv,
        hangMucFilterByIDChecklistC,
        Hangmuc: resDataHangmuc[0],
        ID_Hangmuc: resDataHangmuc[0].ID_Hangmuc,
      });
    }

    setIsScan(false);
    setModalVisibleQr(false);
    setOpacity(1);
  };

    const handleEmergencyCall = () => {
      if (!sdt_khancap) {
        Alert.alert("PMC Thông báo", "Không có số điện thoại khẩn cấp!", [{ text: "Xác nhận" }]);
        return;
      }
      
      const phoneUrl = `tel:${sdt_khancap}`;
      Linking.openURL(phoneUrl).catch(error => {
        Alert.alert("PMC Thông báo", "Không thể thực hiện cuộc gọi!");
      });
    };

  const handleSubmitChecklist = async () => {
    const groupedByID_Hangmuc = defaultActionDataChecklist.reduce((acc, item) => {
      if (!acc[item.ID_Hangmuc]) {
        acc[item.ID_Hangmuc] = [];
      }
      acc[item.ID_Hangmuc].push(item);
      return acc;
    }, {});

    const resultArray = Object.values(groupedByID_Hangmuc);

    try {
      if (isConnected) {
        setLoadingSubmit(true);
        if (defaultActionDataChecklist.length === 0 && dataChecklistFaild.length === 0) {
          await AsyncStorage.removeItem("checkNetwork");
          await AsyncStorage.removeItem(`dataChecklistStorage_${ID_ChecklistC}`);

          // Hiển thị thông báo cho người dùng
          Alert.alert("PMC Thông báo", "Không có checklist để kiểm tra!", [{ text: "OK", onPress: () => console.log("OK Pressed") }]);
          setLoadingSubmit(false);
          setSubmit(false);
          saveConnect(false);
        }
        // Kiểm tra dữ liệu và xử lý tùy thuộc vào trạng thái của `defaultActionDataChecklist` và `dataChecklistFaild`
        if (defaultActionDataChecklist.length === 0 && dataChecklistFaild.length > 0) {
          // Xử lý API cho dataChecklistFaild
          await handleDataChecklistFaild(dataChecklistFaild);
        } else if (defaultActionDataChecklist.length > 0 && dataChecklistFaild.length == 0) {
          // Xử lý API cho defaultActionDataChecklist
          await handleDefaultActionDataChecklist(resultArray);
        }

        if (defaultActionDataChecklist.length > 0 && dataChecklistFaild.length > 0) {
          await hadlChecklistAll(resultArray);
        }
      } else {
        Alert.alert("Không có kết nối mạng", "Vui lòng kiểm tra kết nối mạng của bạn.");
        await AsyncStorage.setItem("checkNetwork", "close");
      }
    } catch (error) {
      // Cập nhật sau khi hoàn thành xử lý API} catch (error) {
      console.error("Lỗi khi kiểm tra kết nối mạng:", error);
      setLoadingSubmit(false);
    }
  };

  // api faild tb_checklistchitiet
  const handleDataChecklistFaild = async (dataChecklistFaild) => {
    try {
      setLoadingSubmit(true);
      // Create a new FormData instance
      const formData = new FormData();
      const isCheckValueCheck = dataChecklistFaild.some((item) => item.valueCheck == null || item.valueCheck == "");

      if (isCheckValueCheck) {
        setLoadingSubmit(false);
        Alert.alert("PMC Thông báo", "Chưa có dữ liệu checklist", [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]);
      } else {
        // Iterate over all items in dataChecklistFaild
        for (const [index, item] of dataChecklistFaild.entries()) {
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
            for (const [imgIndex, image] of item.Anh.entries()) {
              try {
                const resizedImage = await ImageManipulator.manipulateAsync(
                  Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
                  [{ resize: { width: image.width * 0.6 } }],
                  { compress: 1, format: ImageManipulator.SaveFormat.PNG }
                );

                const file = {
                  uri: resizedImage.uri,
                  name: image.fileName || `${Math.floor(Math.random() * 9999999)}_${item.ID_Checklist}_${imgIndex}.png`,
                  type: "image/png",
                };

                formData.append(`Images_${index}_${item.ID_Checklist}_${imgIndex}`, file);
              } catch (error) {
                console.error("Error resizing image: ", error);
              }
            }
          }
        }

        // Send the entire FormData in a single request
        await axios
          .post(BASE_URL + `/tb_checklistchitiet/create`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then(async (res) => {
            await AsyncStorage.removeItem("checkNetwork");

            setSubmit(false);
            await postHandleSubmit();
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
            Alert.alert("PMC Thông báo", "Checklist thất bại. Vui lòng kiểm tra lại hình ảnh hoặc ghi chú!!!", [
              { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
            ]);
          });
      }
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

  const handleDefaultActionDataChecklist = async (defaultActionDataChecklist) => {
    setLoadingSubmit(true);
    try {
      for (const ItemDefaultActionDataChecklist of defaultActionDataChecklist) {
        const descriptions = ItemDefaultActionDataChecklist.map((item) => item.ID_Checklist).join(",");
        const ID_Checklists = ItemDefaultActionDataChecklist.map((item) => item.ID_Checklist);
        const valueChecks = ItemDefaultActionDataChecklist.map((item) => item.valueCheck);

        const requestDone = axios.post(
          BASE_URL + "/tb_checklistchitietdone/create",
          {
            Description: descriptions,
            Gioht: ItemDefaultActionDataChecklist[0].Gioht,
            ID_Checklists: ID_Checklists,
            valueChecks: valueChecks,
            ID_ChecklistC: ID_ChecklistC,
            checklistLength: ItemDefaultActionDataChecklist.length,
            Vido: ItemDefaultActionDataChecklist[0]?.Vido || null,
            Kinhdo: ItemDefaultActionDataChecklist[0]?.Kinhdo || null,
            Docao: ItemDefaultActionDataChecklist[0]?.Docao || null,
            isScan: ItemDefaultActionDataChecklist[0]?.isScan || null,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
          }
        );

        await requestDone;
      }

      // Xử lý sau khi tất cả các yêu cầu hoàn thành
      postHandleSubmit();
      setLoadingSubmit(false);
      await AsyncStorage.removeItem("checkNetwork");

      setSubmit(false);
      saveConnect(false);

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
  const hadlChecklistAll = async (defaultActionDataChecklist) => {
    try {
      setLoadingSubmit(true);

      // Tạo một đối tượng FormData để chứa dữ liệu của dataChecklistFaild
      const formData = new FormData();
      const isCheckValueCheck = dataChecklistFaild.some((item) => item.valueCheck == null || item.valueCheck == "");

      if (isCheckValueCheck) {
        setLoadingSubmit(false);
        Alert.alert("PMC Thông báo", "Chưa có dữ liệu checklist", [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]);
      } else {
        // Lặp qua từng phần tử trong dataChecklistFaild để thêm vào FormData
        for (const [index, item] of dataChecklistFaild.entries()) {
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
                  Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
                  [{ resize: { width: image.width * 0.6 } }], // Resize nhỏ hơn 50%
                  { compress: 1, format: ImageManipulator.SaveFormat.PNG } // Nén ảnh
                );

                const file = {
                  uri: resizedImage.uri,
                  name: image.fileName || `${Math.floor(Math.random() * 9999999)}_${item.ID_Checklist}_${imgIndex}.png`,
                  type: "image/png",
                };

                formData.append(`Images_${index}_${item.ID_Checklist}_${imgIndex}`, file);
              } catch (error) {
                console.error("Error resizing image: ", error);
              }
            }
          }
        }
        // Tạo các yêu cầu API
        const requestFaild = axios.post(`${BASE_URL}/tb_checklistchitiet/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const requestDone = defaultActionDataChecklist.map(async (ItemDefaultActionDataChecklist) => {
          const descriptions = ItemDefaultActionDataChecklist.map((item) => item.ID_Checklist).join(",");
          const ID_Checklists = ItemDefaultActionDataChecklist.map((item) => item.ID_Checklist);
          const valueChecks = ItemDefaultActionDataChecklist.map((item) => item.valueCheck);

          // Thực hiện yêu cầu API
          return axios.post(
            BASE_URL + "/tb_checklistchitietdone/create",
            {
              Description: descriptions,
              Gioht: ItemDefaultActionDataChecklist[0].Gioht,
              ID_Checklists: ID_Checklists,
              valueChecks: valueChecks,
              ID_ChecklistC: ID_ChecklistC,
              checklistLength: ItemDefaultActionDataChecklist.length,
              Vido: ItemDefaultActionDataChecklist[0]?.Vido || null,
              Kinhdo: ItemDefaultActionDataChecklist[0]?.Kinhdo || null,
              Docao: ItemDefaultActionDataChecklist[0]?.Docao || null,
              isScan: ItemDefaultActionDataChecklist[0]?.isScan || null,
            },
            {
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + authToken,
              },
            }
          );
        });

        axios
          .all([requestFaild, requestDone])
          .then(
            axios.spread(async (faildResponse, doneResponse) => {
              await postHandleSubmit();
              setLoadingSubmit(false);
              await AsyncStorage.removeItem("checkNetwork");

              setSubmit(false);
              saveConnect(false);
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
            console.log("Error: 1" + error);
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
              Alert.alert("PMC Thông báo", "Network error. Please try again later.", [
                {
                  text: "Hủy",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Xác nhận",
                  onPress: () => console.log("OK Pressed"),
                },
              ]);
            } else {
              Alert.alert("PMC Thông báo", "An error occurred. Please try again later.", [
                {
                  text: "Hủy",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Xác nhận",
                  onPress: () => console.log("OK Pressed"),
                },
              ]);
            }
          });
      }
    } catch (error) {
      setLoadingSubmit(false);
      Alert.alert("PMC Thông báo", "An error occurred. Please try again later.", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const postHandleSubmit = async () => {
    const idsToRemove = new Set([
      ...defaultActionDataChecklist.map((item) => item.ID_Checklist),
      ...dataChecklistFaild.map((item) => item.ID_Checklist),
    ]);

    const dataChecklistFilterContextReset = dataChecklistFilterContext.filter((item) => !idsToRemove.has(item.ID_Checklist));

    setDataChecklistFilterContext(dataChecklistFilterContextReset);
    await AsyncStorage.removeItem(`dataChecklistStorage_${ID_ChecklistC}`);
    setDataChecklistDefault([]);
    setDataChecklistFaild([]);

    if (dataChecklistFilterContextReset) {
      // Lấy danh sách ID_Hangmuc từ dataChecklists
      const checklistIDs = dataChecklistFilterContextReset.map((item) => item.ID_Hangmuc);

      const filterDataHangMuc = hangMucFilterByIDChecklistC.filter((item) => checklistIDs.includes(item.ID_Hangmuc));
      const validKhuvucIDs = filterDataHangMuc.map((item) => item.ID_Khuvuc);
      setHangMucFilterByIDChecklistC(filterDataHangMuc);

      const filterDataKhuVuc = khuVucFilterByIDChecklistC.filter((item) => validKhuvucIDs.includes(item.ID_Khuvuc));

      setKhuVucFilterByIDChecklistC(filterDataKhuVuc);
      // Lọc danh sách hạng mục dựa trên ID_Khuvuc có trong validKhuvucIDs
      const filteredHangMuc = filterDataKhuVuc.map((khuvuc) => {
        // Đếm số lượng hạng mục còn lại trong từng khu vực
        const hangMucCount = filterDataHangMuc.filter((hangmuc) => hangmuc.ID_Khuvuc === khuvuc.ID_Khuvuc).length;

        // Gắn số lượng hạng mục vào từng khu vực
        return {
          ...khuvuc,
          hangMucCount,
        };
      });
      setDataKhuvuc(filteredHangMuc);
    }
  };

  const toggleTodo = async (item) => {
    const isExistIndex = dataSelect.find((existingItem) => existingItem === item);

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex) {
      setDataSelect([]);
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setDataSelect([item]);
    }
  };

  const handleSubmit = () => {
    navigation.navigate("Thực hiện hạng mục", {
      ID_ChecklistC: ID_ChecklistC,
      ID_KhoiCV: ID_KhoiCV,
      ID_Calv: ID_Calv,
      ID_Khuvuc: dataSelect[0].ID_Khuvuc,
      Tenkv: `${dataSelect[0]?.Tenkhuvuc} - ${dataSelect[0]?.ent_toanha?.Toanha}`,
      ID_Hangmucs: ID_Hangmucs,
    });
    setDataSelect([]);
  };

  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[
          styles.content,
          {
            backgroundColor: dataSelect[0] === item ? COLORS.bg_button : "white",
          },
        ]}
        key={index}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "90%",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Tenkhuvuc} - {item?.ent_toanha?.Toanha}
          </Text>
        </View>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 50,
            backgroundColor: dataSelect[0] === item ? "white" : "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "black" : "white",
              fontWeight: "600",
            }}
            allowFontScaling={false}
          >
            {item?.hangMucCount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // format number
  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number == 0) return `0`;
    return number;
  };

  const handleOpenQrCode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setModalVisibleQr(true);
      setOpacity(0.2);
    } else if (status === "denied") {
      Alert.alert(
        "Permission Required",
        "Camera access is required to take photos. Please enable it in settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setModalVisibleQr(false);
              setOpacity(1);
            },
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ],
        { cancelable: false }
      );
    } else {
      setModalVisibleQr(false);
      setOpacity(1);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground source={require("../../../assets/bg.png")} resizeMode="cover" style={{ flex: 1 }}>
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
                        {isLoadingDetail == false && (
                          <Text allowFontScaling={false} style={[styles.text, { fontSize: adjust(18) }]}>
                            Số lượng: {decimalNumber(dataKhuvuc?.length)} khu vực
                          </Text>
                        )}
                      </View>
                      {submit === true && (
                        <Button
                          text={"Hoàn thành"}
                          isLoading={loadingSubmit}
                          backgroundColor={COLORS.bg_button}
                          color={"white"}
                          onPress={() => handleSubmitChecklist()}
                        />
                      )}
                    </View>
                  </View>
                </View>

                {isLoadingDetail === false && dataKhuvuc && dataKhuvuc?.length > 0 && (
                  <>
                    <FlatList
                      style={{
                        margin: 12,
                        flex: 1,
                        marginBottom: 100,
                      }}
                      data={dataKhuvuc}
                      renderItem={({ item, index, separators }) => renderItem(item, index)}
                      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                      keyExtractor={(item, index) => `${item?.ID_Checklist}_${index}`}
                      showsVerticalScrollIndicator={false}
                      refreshControl={<RefreshControl refreshing={isLoadingDetail} tintColor="transparent" onRefresh={init_checklist} />}
                    />
                  </>
                )}

                {isLoadingDetail === false && dataKhuvuc.length == 0 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 80,
                    }}
                  >
                    <Image source={require("../../../assets/icons/delete_bg.png")} resizeMode="contain" style={{ height: 120, width: 120 }} />
                    <Text allowFontScaling={false} style={[styles.danhmuc, { padding: 10 }]}>
                      {isScan ? "Không thấy khu vực này" : "Khu vực của ca này đã hoàn thành !"}
                    </Text>
                  </View>
                )}

                {isLoadingDetail === true && (
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

                <View
                  style={{
                    position: "absolute",
                    bottom: 30,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button text={"Quét Qrcode"} backgroundColor={"white"} color={"black"} onPress={() => handleOpenQrCode()} />

                  {dataSelect[0] && (
                    <Button
                      text={"Vào khu vực"}
                      isLoading={loadingSubmit}
                      backgroundColor={COLORS.bg_button}
                      color={"white"}
                      onPress={() => handleSubmit()}
                    />
                  )}

                  {!dataSelect[0] && (
                    <Button
                      // image={require("../../../assets/icons/ic_phone_green_2.png")}
                      text={"Gọi khẩn cấp"}
                      isLoading={loadingSubmit}
                      backgroundColor={"red"}
                      color={"white"}
                      onPress={() => handleEmergencyCall()}
                    />
                  )}
                </View>
              </View>
            </ImageBackground>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleQr}
              onRequestClose={() => {
                setModalVisibleQr(!modalVisibleQr);
                setOpacity(1);
              }}
            >
              <View style={[styles.centeredView, { width: "100%", height: "80%" }]}>
                <View style={[styles.modalView, { width: "80%", height: "60%" }]}>
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

export default ThucHienKhuvuc;

const styles = StyleSheet.create({
  container: {
    margin: 12,
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
    fontSize: adjust(20),
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
