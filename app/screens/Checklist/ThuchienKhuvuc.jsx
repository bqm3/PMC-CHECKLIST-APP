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
import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ent_checklist_mul_hm, ent_get_sdt_KhanCap } from "../../redux/actions/entActions";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button/Button";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import QRCodeScreen from "../QRCodeScreen";
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";
import adjust from "../../adjust";
import NetInfo from "@react-native-community/netinfo";
import ConnectContext from "../../context/ConnectContext";
import { loadData, saveData } from "../../sqlite/SQLiteDataManager";

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
  } = useContext(DataContext);

  const { setDataChecklistFilterContext, dataChecklistFilterContext } = useContext(ChecklistContext);
  const { isConnect, saveConnect } = useContext(ConnectContext);

  const dispatch = useDispatch();
  const { ent_khuvuc, ent_hangmuc, sdt_khancap } = useSelector((state) => state.entReducer);
  const { authToken } = useSelector((state) => state.authReducer);

  const [opacity, setOpacity] = useState(1);
  const [submit, setSubmit] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [dataKhuvuc, setDataKhuvuc] = useState([]);
  const [isConnected, setConnected] = useState(true);

  // ============ UTILITY FUNCTIONS ============
  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    return number === 0 ? "0" : number;
  };

  const showAlert = (message, onConfirm) => {
    Alert.alert("Thông báo", message, [
      { text: "Hủy", onPress: () => console.log("Cancel"), style: "cancel" },
      { text: "Xác nhận", onPress: onConfirm || (() => console.log("OK")) },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      const filteredItems = dataChecklistFilterContext.filter((item) => item.valueCheck !== null);
      if (filteredItems.length === 0) {
        return;
      }

      e.preventDefault();
      showAlert("Thoát khỏi khu vực sẽ mất hết checklist đã kiểm tra. Vui lòng xác nhận", () => navigation.dispatch(e.data.action));
    });

    return unsubscribe;
  }, [navigation, dataChecklistFilterContext]);

  // ============ API FUNCTIONS ============
  const init_checklist = async () => {
    try {
      const result = await dispatch(ent_checklist_mul_hm(ID_Hangmucs, ID_Calv, ID_ChecklistC, ID_KhoiCV));

      if (result?.success && result?.data?.length > 0) {
        setDataChecklists(result.data);
        setDataChecklistFilterContext(result.data);
        await saveData(ID_ChecklistC, result.data);
      }
    } catch (error) {
      console.error("❌ Error loading checklist:", error);
    }
  };

  const resizeImage = async (image, index, itemId, imgIndex) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
        [{ resize: { width: image.width * 0.6 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      return {
        uri: resizedImage.uri,
        name: image.fileName || `${Math.floor(Math.random() * 9999999)}_${itemId}_${imgIndex}.png`,
        type: "image/png",
      };
    } catch (error) {
      console.error("Error resizing image:", error);
      return null;
    }
  };

  const createFormDataForFailedChecklist = async (dataChecklistFaild) => {
    const formData = new FormData();

    for (const [index, item] of dataChecklistFaild.entries()) {
      formData.append("Key_Image", 1);
      formData.append("ID_ChecklistC", ID_ChecklistC);
      formData.append("ID_Checklist", item.ID_Checklist);
      formData.append("ID_Phanhe", item.ID_Phanhe);
      formData.append("Ketqua", item.valueCheck || "");
      formData.append("Gioht", item.Gioht);
      formData.append("Ghichu", item.GhichuChitiet || "");
      formData.append("Vido", item.Vido || "");
      formData.append("Kinhdo", item.Kinhdo || "");
      formData.append("Docao", item.Docao || "");
      formData.append("isScan", isScan || null);

      if (item.Anh?.length) {
        for (const [imgIndex, image] of item.Anh.entries()) {
          const file = await resizeImage(image, index, item.ID_Checklist, imgIndex);
          if (file) {
            formData.append(`Images_${index}_${item.ID_Checklist}_${imgIndex}`, file);
          }
        }
      }
    }

    return formData;
  };

  const postHandleSubmit = async () => {
    const idsToRemove = new Set([
      ...defaultActionDataChecklist.map((item) => item.ID_Checklist),
      ...dataChecklistFaild.map((item) => item.ID_Checklist),
    ]);

    const dataChecklistFilterContextReset = dataChecklistFilterContext.filter((item) => !idsToRemove.has(item.ID_Checklist));

    setDataChecklistFilterContext(dataChecklistFilterContextReset);
    await saveData(ID_ChecklistC, dataChecklistFilterContextReset);

    if (dataChecklistFilterContextReset.length) {
      const checklistIDs = dataChecklistFilterContextReset.map((item) => item.ID_Hangmuc);
      const filterDataHangMuc = hangMucFilterByIDChecklistC.filter((item) => checklistIDs.includes(item.ID_Hangmuc));
      const validKhuvucIDs = filterDataHangMuc.map((item) => item.ID_Khuvuc);

      setHangMucFilterByIDChecklistC(filterDataHangMuc);

      const filterDataKhuVuc = khuVucFilterByIDChecklistC.filter((item) => validKhuvucIDs.includes(item.ID_Khuvuc));

      setKhuVucFilterByIDChecklistC(filterDataKhuVuc);
    }
  };

  const handleDataChecklistFaild = async (dataChecklistFaild) => {
    try {
      setLoadingSubmit(true);

      const hasEmptyCheck = dataChecklistFaild.some((item) => !item.valueCheck);
      if (hasEmptyCheck) {
        showAlert("Chưa có dữ liệu checklist");
        setLoadingSubmit(false);
        return false;
      }

      const formData = await createFormDataForFailedChecklist(dataChecklistFaild);

      // Gửi request
      await axios.post(`${BASE_URL}/tb_checklistchitiet/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Xử lý sau khi thành công
      setSubmit(false);
      await postHandleSubmit();
      setLoadingSubmit(false);
      showAlert("Checklist thành công");
      return true;
    } catch (error) {
      setLoadingSubmit(false);
      showAlert(error.response?.data?.message || "Checklist thất bại. Vui lòng kiểm tra lại!");
      return false;
    }
  };

  const handleDefaultActionDataChecklist = async (groupedData) => {
    try {
      setLoadingSubmit(true);
      const requests = Object.entries(groupedData).map(([ID_Hangmuc, items]) => {
        return axios.post(
          `${BASE_URL}/tb_checklistchitietdone/create`,
          {
            Description: items.map((item) => item.ID_Checklist).join(","),
            Gioht: items[0].Gioht,
            ID_Checklists: items.map((item) => item.ID_Checklist),
            valueChecks: items.map((item) => item.valueCheck),
            ID_ChecklistC,
            checklistLength: items.length,
            Vido: items[0]?.Vido || null,
            Kinhdo: items[0]?.Kinhdo || null,
            Docao: items[0]?.Docao || null,
            isScan: items[0]?.isScan || null,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      });

      await Promise.all(requests);
      await postHandleSubmit();

      setLoadingSubmit(false);
      setSubmit(false);
      saveConnect(false);
      showAlert("Checklist thành công");
      return true;
    } catch (error) {
      setLoadingSubmit(false);
      showAlert(error.response?.data?.message || "Đã xảy ra lỗi");
      return false;
    }
  };

  const hadlChecklistAll = async (groupedDefaultData, dataChecklistFaild) => {
    try {
      setLoadingSubmit(true);

      const hasEmptyCheck = dataChecklistFaild.some((item) => !item.valueCheck);
      if (hasEmptyCheck) {
        showAlert("Chưa có dữ liệu checklist");
        setLoadingSubmit(false);
        return false;
      }

      const formData = await createFormDataForFailedChecklist(dataChecklistFaild);

      const requestFaild = axios.post(`${BASE_URL}/tb_checklistchitiet/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const requestsDone = Object.entries(groupedDefaultData).map(([ID_Hangmuc, items]) => {
        return axios.post(
          `${BASE_URL}/tb_checklistchitietdone/create`,
          {
            Description: items.map((item) => item.ID_Checklist).join(","),
            Gioht: items[0].Gioht,
            ID_Checklists: items.map((item) => item.ID_Checklist),
            valueChecks: items.map((item) => item.valueCheck),
            ID_ChecklistC,
            checklistLength: items.length,
            Vido: items[0]?.Vido || null,
            Kinhdo: items[0]?.Kinhdo || null,
            Docao: items[0]?.Docao || null,
            isScan: items[0]?.isScan || null,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      });

      await Promise.all([requestFaild, ...requestsDone]);
      await postHandleSubmit();

      setLoadingSubmit(false);
      setSubmit(false);
      saveConnect(false);
      showAlert("Checklist thành công");
      return true;
    } catch (error) {
      setLoadingSubmit(false);
      showAlert(error.response?.data?.message || "Đã xảy ra lỗi");
      return false;
    }
  };

  const handleSubmitChecklist = async () => {
    try {
      if (!isConnected) {
        Alert.alert("Không có kết nối mạng", "Dữ liệu đã được lưu. Vui lòng hoàn thành khi có kết nối mạng.");
        return false;
      }

      setLoadingSubmit(true);

      if (defaultActionDataChecklist.length === 0 && dataChecklistFaild.length === 0) {
        showAlert("Không có checklist để kiểm tra!");
        setLoadingSubmit(false);
        setSubmit(false);
        saveConnect(false);
        return false;
      }

      const groupedByID_Hangmuc = defaultActionDataChecklist.reduce((acc, item) => {
        if (!acc[item.ID_Hangmuc]) acc[item.ID_Hangmuc] = [];
        acc[item.ID_Hangmuc].push(item);
        return acc;
      }, {});

      if (defaultActionDataChecklist.length === 0) {
        return await handleDataChecklistFaild(dataChecklistFaild);
      } else if (dataChecklistFaild.length === 0) {
        return await handleDefaultActionDataChecklist(groupedByID_Hangmuc);
      } else {
        return await hadlChecklistAll(groupedByID_Hangmuc, dataChecklistFaild);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra:", error);
      setLoadingSubmit(false);
      return false;
    }
  };

  // ============ EFFECTS ============
  useEffect(() => {
    dispatch(ent_get_sdt_KhanCap());
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoadingDetail) {
      const timer = setTimeout(() => setIsLoadingDetail(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoadingDetail]);


  useFocusEffect(
    React.useCallback(() => {
      const initData = async () => {
        try {
          const savedData = await loadData(ID_ChecklistC);

          if (savedData?.length > 0) {
            setDataChecklists(savedData);
            setDataChecklistFilterContext(savedData);
          } else {
            await init_checklist();
          }
        } catch (error) {
          console.error("❌ Error in initData:", error);
        }
      };

      initData();
    }, [ID_ChecklistC])
  );

  useEffect(() => {
    if (!dataChecklists?.length) {
      setDataKhuvuc([]);
      return;
    }

    const checklistIDs = dataChecklists.map((item) => item.ID_Hangmuc);
    const filterDataHangMuc = ent_hangmuc.filter((item) => checklistIDs.includes(item.ID_Hangmuc));
    setHangMucFilterByIDChecklistC(filterDataHangMuc);

    const validKhuvucIDs = filterDataHangMuc.map((item) => item.ID_Khuvuc);
    const filterDataKhuVuc = ent_khuvuc.filter((item) => validKhuvucIDs.includes(item.ID_Khuvuc));
    setKhuVucFilterByIDChecklistC(filterDataKhuVuc);

    const filteredHangMuc = filterDataKhuVuc
      .map((khuvuc) => ({
        ...khuvuc,
        hangMucCount: filterDataHangMuc.filter((hm) => hm.ID_Khuvuc === khuvuc.ID_Khuvuc).length,
      }))
      .filter((khuvuc) => khuvuc.hangMucCount > 0);

    setDataKhuvuc(filteredHangMuc);
  }, [dataChecklists, ent_hangmuc, ent_khuvuc]);

  useEffect(() => {
    const hasCheckedItems = dataChecklistFilterContext.some((item) => item.valueCheck !== null);
    setSubmit(hasCheckedItems || isConnect);
  }, [dataChecklistFilterContext, isConnect]);

  // ============ MEMOIZED VALUES ============
  const { defaultActionDataChecklist, dataChecklistFaild } = useMemo(() => {
    const dataChecklistAction = dataChecklistFilterContext?.filter((item) => item.valueCheck !== null) || [];
    const dataChecklistDefault = dataChecklistAction.filter((item) => item.valueCheck === item.Giatridinhdanh && !item.GhichuChitiet && !item.Anh);
    const dataChecklistFaild = dataChecklistAction.filter(
      (item) => !dataChecklistDefault.some((defaultItem) => defaultItem.ID_Checklist === item.ID_Checklist)
    );
    return { defaultActionDataChecklist: dataChecklistDefault, dataChecklistFaild };
  }, [dataChecklistFilterContext]);

  // ============ HANDLERS ============
  const handlePushDataFilterQr = (value) => {
    const cleanedValue = value.trim().toLowerCase();
    const resDataKhuvuc = dataChecklists.filter((item) => item.ent_khuvuc.MaQrCode.trim().toLowerCase() === cleanedValue);
    const resDataKhuvucAll = dataChecklistByCa.filter((item) => item.ent_khuvuc.MaQrCode.trim().toLowerCase() === cleanedValue);
    const resDataHangmuc = dataChecklists.filter((item) => item.ent_hangmuc.MaQrCode.trim().toLowerCase() === cleanedValue);
    const resDataHangmucAll = dataChecklistByCa.filter((item) => item.ent_hangmuc.MaQrCode.trim().toLowerCase() === cleanedValue);

    if (!resDataKhuvuc.length && !resDataHangmuc.length) {
      const alertMessage =
        resDataKhuvucAll.length || resDataHangmucAll.length
          ? `Khu vực hoặc hạng mục có QR code: "${cleanedValue}" này đã kiểm tra`
          : `Khu vực hoặc hạng mục có QR code: "${cleanedValue}" này không thuộc ca làm việc`;
      showAlert(alertMessage);
    }

    if (resDataKhuvuc.length) {
      navigation.navigate("Thực hiện hạng mục", {
        ID_ChecklistC,
        ID_KhoiCV,
        ID_Calv,
        ID_Khuvuc: resDataKhuvuc[0].ID_Khuvuc,
        ID_Hangmucs,
      });
    }

    if (resDataHangmuc.length) {
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

  const toggleTodo = (item) => {
    setDataSelect((prev) => (prev[0]?.ID_Khuvuc === item.ID_Khuvuc ? [] : [item]));
  };

  const handleSubmit = () => {
    navigation.navigate("Thực hiện hạng mục", {
      ID_ChecklistC,
      ID_KhoiCV,
      ID_Calv,
      ID_Khuvuc: dataSelect[0].ID_Khuvuc,
      Tenkv: `${dataSelect[0]?.Tenkhuvuc} - ${dataSelect[0]?.ent_toanha?.Toanha}`,
      ID_Hangmucs,
    });
    setDataSelect([]);
  };

  const handleOpenQrCode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setModalVisibleQr(true);
      setOpacity(0.2);
    } else if (status === "denied") {
      Alert.alert(
        "Permission Required",
        "Camera access is required. Please enable it in settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setModalVisibleQr(false);
              setOpacity(1);
            },
          },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
        { cancelable: false }
      );
    } else {
      setModalVisibleQr(false);
      setOpacity(1);
    }
  };

  // ============ RENDER FUNCTIONS ============
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[styles.content, { backgroundColor: dataSelect[0]?.ID_Khuvuc === item.ID_Khuvuc ? COLORS.bg_button : "white" }]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, width: "90%" }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: dataSelect[0]?.ID_Khuvuc === item.ID_Khuvuc ? "white" : "black",
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
            backgroundColor: dataSelect[0]?.ID_Khuvuc === item.ID_Khuvuc ? "white" : "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: adjust(16),
              color: dataSelect[0]?.ID_Khuvuc === item.ID_Khuvuc ? "black" : "white",
              fontWeight: "600",
            }}
            allowFontScaling={false}
          >
            {item?.hangMucCount}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [dataSelect]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground source={require("../../../assets/bg.png")} resizeMode="cover" style={{ flex: 1 }}>
              <View style={{ flex: 1, opacity }}>
                <View style={{ margin: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <View style={{ flexDirection: "column", gap: 8 }}>
                        {!isLoadingDetail && (
                          <Text allowFontScaling={false} style={[styles.text, { fontSize: adjust(18) }]}>
                            Số lượng: {decimalNumber(dataKhuvuc?.length)} khu vực
                          </Text>
                        )}
                      </View>
                      {submit && (defaultActionDataChecklist?.length > 0 || dataChecklistFaild?.length > 0) && (
                        <Button
                          text={"Hoàn thành"}
                          isLoading={loadingSubmit}
                          backgroundColor={COLORS.bg_button}
                          color={"white"}
                          onPress={async () => {
                            const success = await handleSubmitChecklist();
                            if (success) {
                              await init_checklist();
                            }
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>

                {!isLoadingDetail && dataKhuvuc?.length > 0 && (
                  <FlatList
                    style={{ margin: 12, flex: 1, marginBottom: 100 }}
                    data={dataKhuvuc}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    keyExtractor={(item) => item.ID_Khuvuc.toString()}
                    getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoadingDetail} tintColor="transparent" onRefresh={init_checklist} />}
                  />
                )}

                {!isLoadingDetail && dataKhuvuc.length === 0 && (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 80 }}>
                    <Image source={require("../../../assets/icons/delete_bg.png")} resizeMode="contain" style={{ height: 120, width: 120 }} />
                    <Text allowFontScaling={false} style={[styles.danhmuc, { padding: 10 }]}>
                      {isScan ? "Không thấy khu vực này" : "Khu vực của ca này đã hoàn thành !"}
                    </Text>
                  </View>
                )}

                {isLoadingDetail && (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={COLORS.bg_white} />
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
                  <Button text={"Quét Qrcode"} backgroundColor={"white"} color={"black"} onPress={handleOpenQrCode} />
                  {dataSelect[0] && (
                    <Button
                      text={"Vào khu vực"}
                      isLoading={loadingSubmit}
                      backgroundColor={COLORS.bg_button}
                      color={"white"}
                      onPress={handleSubmit}
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
                setModalVisibleQr(false);
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
  container: { margin: 12 },
  danhmuc: { fontSize: adjust(25), fontWeight: "700", color: "white" },
  text: { fontSize: adjust(15), color: "white", fontWeight: "600" },
  headerTable: { color: "white" },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { fontSize: adjust(20), fontWeight: "600", paddingVertical: 10 },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
