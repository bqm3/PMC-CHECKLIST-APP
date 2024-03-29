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
import { Entypo } from "@expo/vector-icons";
import { ent_checklist_get } from "../../redux/actions/entActions";
import { DataTable } from "react-native-paper";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import ActionCheckbox from "../../components/Active/ActiveCheckbox";
import ActiveChecklist from "../../components/Active/ActiveCheckList";
import Button from "../../components/Button/Button";
import ModalChitietChecklist from "../../components/Modal/ModalChitietChecklist";

const DetailChecklist = ({ route, navigation }) => {
  const { ID_ChecklistC, otherParam } = route.params;
  const dispath = useDispatch();
  const { ent_checklist } = useSelector((state) => state.entReducer);
  const { user, authToken } = useSelector((state) => state.authReducer);

  const [dataChecklist, setDataChecklist] = useState([]);
  const [newActionDataChecklist, setNewActionDataChecklist] = useState([]);
  const [dataItem, setDataItem] = useState(null)
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const [opacity, setOpacity] = useState(1);

  const init_checklist = async () => {
    await dispath(ent_checklist_get());
  };

  useEffect(() => {
    init_checklist();
  }, []);

  const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef?.current?.present();
    setDataItem(item)
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
      setDataItem(null)
    } else {
      setOpacity(0.5);
    }
  }, []);

  useEffect(() => {
    const processedData = ent_checklist?.map((item) => {
      return {
        ...item,
        Giatrinhan: item?.Giatrinhan?.split("/"),
        valueCheck: null,
      };
    });
    setDataChecklist(processedData);
    setNewActionDataChecklist(processedData);
  }, [ent_checklist]);

  const decimalNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  };

  const handleItemClick = (value, index) => {
    const updatedDataChecklist = dataChecklist.map((item, i) => {
      if (i === index) {
        return { ...item, valueCheck: item.valueCheck === null ? value : null };
      }
      return item;
    });
    setDataChecklist(updatedDataChecklist);
    setNewActionDataChecklist(updatedDataChecklist);
  };

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
            handleToggle={() => handleItemClick(item?.Giatridinhdanh, index)}
            // active={}
          />
          <Text
            style={{
              fontSize: 15,
              color: "black",
              fontWeight: "600",
            }}
            numberOfLines={4}
          >
            {item?.Sothutu}. {item?.Checklist}
          </Text>
        </View>
        <TouchableOpacity onPress={()=>handlePresentModalPress(item)}>
          <Entypo name="dots-three-vertical" size={28} color="black" />
        </TouchableOpacity>
      </View>
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
                // opacity: opacity,
              }}
            >
              <View style={styles.container}>
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
                    <Text style={styles.text}>
                      Số lượng: {decimalNumber(dataChecklist?.length)} Checklist
                    </Text>
                  </TouchableOpacity>
                  <ButtonChecklist
                    text={"Tìm kiếm"}
                    width={"auto"}
                    color={COLORS.bg_button}
                    // onPress={handlePresentModalPress}
                  />
                </View>
              </View>
              {dataChecklist && dataChecklist?.length > 0 && (
                <FlatList
                  style={{
                    margin: 12,
                    flex: 1,
                    marginBottom: 100,
                  }}
                  data={newActionDataChecklist}
                  renderItem={({ item, index, separators }) =>
                    renderItem(item, index)
                  }
                  ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                  keyExtractor={(item, index) =>
                    `${item?.ID_Checklist}_${index}`
                  }
                />
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
                  backgroundColor={COLORS.bg_button}
                  color={"white"}
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
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DetailChecklist;

const styles = StyleSheet.create({
  container: {
    margin: 12,
    // flex: 1,
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
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    // alignItems: "center",
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
