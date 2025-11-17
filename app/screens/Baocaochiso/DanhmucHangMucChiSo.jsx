import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Keyboard,
  BackHandler
} from "react-native";
import { useSelector } from "react-redux";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import adjust from "../../adjust";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button/Button";
import ModalBaocaochiso from "../../components/Modal/ModalBaocaochiso";
import moment from "moment";
import "moment-timezone";

const DanhmucHangMucChiSo = ({ navigation }) => {
  const { height } = Dimensions.get("window");

  const { authToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [dataItem, setDataItem] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(-1);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const snapPoints = useMemo(() => [height * 0.7], []);
  const bottomSheetModalRef = useRef(null);

  const nowVietnam = moment().tz("Asia/Ho_Chi_Minh");
  let ngay = nowVietnam.format("DD/MM/YYYY");
  let thang = nowVietnam.month() + 1;
  let nam = nowVietnam.year();
  
  let day = nowVietnam.date();

  if (day == 1) {
    if (thang == 1) { 
      thang = 12; 
      nam -= 1; 
    } else {
      thang -= 1; 
    }
  }

  const [arrayItem, setArrayItem] = useState([]);
  const [selectedItemData, setSelectedItemData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const response = await axios.get(`${BASE_URL}/hangmuc-chiso/byDuan`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setData(response.data.data);
        setIsLoadingData(false);
      } catch (error) {
        setIsLoadingData(false);
        showAlert("Có lỗi xảy ra");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [authToken]);

  const handleSheetChanges = useCallback(
    (index) => {
      setOpacity(index === -1 ? 1 : 0.2);
    },
    [isBottomSheetOpen]
  );

  useEffect(() => {
    const backAction = () => {
      if (opacity == 0.2) {
        handleCloseBottomSheet();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [opacity]);

  const handlePresentModalPress = (item) => {
    const existingItemData = arrayItem.find(
      (data) => data.ID_Hangmuc_Chiso === item.ID_Hangmuc_Chiso
    );

    if (existingItemData) {
      setSelectedItemData(existingItemData);
    } else {
      setSelectedItemData({
        ID_Hangmuc_Chiso: item.ID_Hangmuc_Chiso,
        Day: ngay,
        Month: thang,
        Year: nam,
        Chiso: null,
        Image: null,
        Chiso_Read_Img: null,
        Ghichu: null,
      });
    }

    setDataItem(item);
    bottomSheetModalRef.current?.expand();
  };

  const handleCloseBottomSheet = () => {
    Keyboard.dismiss();
    bottomSheetModalRef?.current?.close();
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingSubmit(true);
      const formData = new FormData();
      for (const [index, item] of arrayItem.entries()) {
        appendFormData(formData, item, index);
      }
      try {
        const response = await axios.post(
          `${BASE_URL}/ent_baocaochiso/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setIsLoadingSubmit(false);
        showAlert("Thành công", true);
      } catch (error) {
        setIsLoadingSubmit(false);
        showAlert("Có lỗi xảy ra");
      }
    } catch (error) {
      setIsLoadingSubmit(false);
      showAlert(error.message || "Có lỗi xảy ra");
    }
  };

  const appendFormData = (formData, item, index) => {
    formData.append("index", index);
    formData.append("ID_Hangmuc_Chiso", item.ID_Hangmuc_Chiso);
    formData.append("Day", item.Day || "");
    formData.append("Month", item.Month || "");
    formData.append("Year", item.Year);
    formData.append("Chiso", item.Chiso || "");
    formData.append("Chiso_Read_Img", item.Chiso_Read_Img || "");
    formData.append("Ghichu", item.Ghichu || "");
    if (item.Image) {
      const file = createFile(item.Image);
      formData.append(`Image_${index}`, file);
      formData.append("Image", `${file.name}`);
    }
  };

  const createFile = (Anh) => {
    return {
      uri: Platform.OS === "android" ? Anh.uri : Anh.uri.replace("file://", ""),
      name: Anh.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
      type: "image/jpg",
    };
  };

  const showAlert = (message, key = false) => {
    Alert.alert("Thông báo", message, [
      {
        text: "Xác nhận",
        onPress: () =>
          key
            ? navigation.navigate("Báo cáo chỉ số")
            : console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={[styles.content, { backgroundColor: "white" }]}
        key={index}
        onPress={() => handlePresentModalPress(item)}
      >
        <View style={styles.contentRow}>
          <Text
            allowFontScaling={false}
            style={styles.titleText}
            numberOfLines={5}
          >
            {item?.Ten_Hangmuc_Chiso} - {item?.ent_loai_chiso?.TenLoaiCS}
          </Text>
          {arrayItem.find(
            (i) => i.ID_Hangmuc_Chiso == item.ID_Hangmuc_Chiso
          ) && (
            <Image
              source={require("../../../assets/icons/ic_checkbox.png")}
              style={{
                width: adjust(20),
                height: adjust(20),
                tintColor: "green",
              }}
            />
          )}
        </View>
        {/* <TouchableOpacity onPress={() => handlePresentModalPress(item)}>
          <Image
            source={require("../../../assets/icons/ic_ellipsis.png")}
            style={styles.ellipsisIcon}
          />
        </TouchableOpacity> */}
      </TouchableOpacity>
    ),
    [arrayItem]
  );

  const keyExtractor = useCallback(
    (item, index) => `${item?.ID_Checklist}_${index}`,
    []
  );

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.flex}
        >
          <View style={styles.flex}>
            <ImageBackground
              source={require("../../../assets/bg.png")}
              resizeMode="cover"
              style={[styles.flex, { opacity }]}
            >
              {isLoadingSubmit && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.bg_white} />
                </View>
              )}

              {isLoadingData ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.bg_white} />
                </View>
              ) : (
                <View style={styles.container}>
                  <FlatList
                    style={styles.flatList}
                    data={data}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                  />
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
                  text={"Hoàn Thành"}
                  color="white"
                  isLoading={false}
                  backgroundColor={
                    arrayItem.length == data.length ? COLORS.bg_button : "gray"
                  }
                  onPress={() => {
                    if (arrayItem.length == data.length) {
                      handleSubmit();
                    }
                  }}
                />
              </View>
            </ImageBackground>

            <BottomSheet
              ref={bottomSheetModalRef} // Sử dụng ref để điều khiển BottomSheet
              index={-1} // Đặt giá trị mặc định là -1 để BottomSheet đóng
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              enablePanDownToClose={true}
              onClose={handleCloseBottomSheet}
            >
              <BottomSheetView>
                <ModalBaocaochiso
                  dataItem={dataItem}
                  arrayItem={arrayItem}
                  setArrayItem={setArrayItem}
                  selectedItemData={selectedItemData}
                  setSelectedItemData={setSelectedItemData}
                  handleCloseBottomSheet={handleCloseBottomSheet}
                  // isLoadingImage={isLoadingImage}
                  // setIsLoadingImage={setIsLoadingImage}
                ></ModalBaocaochiso>
              </BottomSheetView>
            </BottomSheet>
          </View>
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  flatList: {
    margin: 12,
    flex: 1,
    marginBottom: 100,
  },
  separator: {
    height: 16,
  },
  content: {
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
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "90%",
  },
  titleText: {
    fontSize: adjust(16),
    color: "black",
    fontWeight: "600",
  },
  ellipsisIcon: {
    tintColor: "black",
    resizeMode: "contain",
    transform: [{ rotate: "90deg" }],
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});

export default DanhmucHangMucChiSo;
