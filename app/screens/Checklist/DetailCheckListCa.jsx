import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ImageBackground,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import { BASE_URL } from "../../constants/config";
import { COLORS, SIZES, marginBottomValue } from "../../constants/theme";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

const DetailCheckListCa = ({ route }) => {
  const headerList = [
    {
      til: "Ngày kiểm tra",
      width: 120,
    },
    {
      til: "Checklist",
      width: 200,
    },
    {
      til: "Giờ hoàn thành",
      width: 150,
    },
    {
      til: "Nhân viên",
      width: 150,
    },
    {
      til: "Kết quả",
      width: 100,
    },
  ];
  const { ID_ChecklistC } = route.params;
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isShowChecklist, setIsShowChecklist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/tb_checklistc/ca/${ID_ChecklistC}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authToken,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        if (error.response) {
          console.log("Error Response Data:", error.response.data);
          console.log("Error Status:", error.response.status);
          console.log("Error Headers:", error.response.headers);
        } else if (error.request) {
          console.log("Error Request:", error.request);
        } else {
          console.log("Error Message:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ID_ChecklistC]);

  const toggleTodo = async (item) => {
    // setIsCheckbox(true);
    const isExistIndex = newActionCheckList.findIndex(
      (existingItem) =>
        existingItem.ID_Checklistchitiet === item.ID_Checklistchitiet
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionCheckList((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionCheckList([item]);
      const filter =
        item.Ketqua == item?.ent_checklist?.Giatridinhdanh &&
        item?.Ghichu == "" &&
        (item?.Anh == "" || item?.Anh === null)
          ? false
          : true;
      setIsShowChecklist(filter);
    }
  };

  const handleModalShow = (active, op) => {
    setModalVisible(active);
    setOpacity(Number(op));
  };

  const _renderItem = ({ item, index }) => {
    const isExistIndex = newActionCheckList?.find(
      (existingItem) =>
        existingItem?.ID_Checklistchitiet === item?.ID_Checklistchitiet
    );
    return (
      <TouchableHighlight key={index} onPress={() => toggleTodo(item)}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            backgroundColor: isExistIndex ? COLORS.bg_button : "white",
          }}
        >
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {moment(item?.tb_checklistc?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 200, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={3}
            >
              {item?.ent_checklist?.Checklist}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Gioht}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.tb_checklistc?.ent_user?.Hoten}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Ketqua}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableHighlight>
    );
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../../../assets/bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.bg_button} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </ImageBackground>
    );
  }
  console.log(modalVisible);
  return (
    <ImageBackground
      source={require("../../../assets/bg.png")}
      style={[styles.backgroundImage]}
      resizeMode="cover"
    >
      {data && data?.length > 0 ? (
        <DataTable
          style={{
            backgroundColor: "white",
          }}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{
              flexDirection: "column",
            }}
          >
            <DataTable.Header
              style={{
                backgroundColor: "#eeeeee",
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
              }}
            >
              {headerList &&
                headerList.map((item, index) => {
                  return (
                    <DataTable.Title
                      key={index}
                      style={{
                        width: item?.width,
                        borderRightWidth:
                          index === headerList.length - 1 ? 0 : 2,
                        borderRightColor: "white",
                        justifyContent: "center",
                      }}
                      numberOfLines={2}
                    >
                      <Text
                        allowFontScaling={false}
                        style={[styles.text, { color: "black" }]}
                      >
                        {item?.til}
                      </Text>
                    </DataTable.Title>
                  );
                })}
            </DataTable.Header>

            {data && data?.length > 0 ? (
              <FlatList
                keyExtractor={(item, index) =>
                  `${item?.ID_ChecklistC}_${index}`
                }
                scrollEnabled={true}
                data={data}
                renderItem={_renderItem}
              />
            ) : null}
          </ScrollView>
        </DataTable>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {/* <ImageBackground
            source={require("../../../assets/bg.png")}
            style={[styles.backgroundImage]}
            resizeMode="cover"
          > */}
            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
              Không có dữ liệu
            </Text>
          {/* </ImageBackground> */}
        </View>
      )}
      <View
        style={{
          width: 60,
          position: "absolute",
          right: 20,
          bottom: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        {newActionCheckList?.length > 0 &&
          isShowChecklist &&
          (newActionCheckList[0]?.Anh !== null &&
          newActionCheckList[0]?.Anh !== "" ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleModalShow(true, 0.2)}
            >
              <Feather name="image" size={26} color="white" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleModalShow(true, 0.2)}
              >
                <Feather name="eye" size={26} color="white" />
              </TouchableOpacity>
            </>
          ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalBackground}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text allowFontScaling={false} style={styles.modalText}>
                  Thông tin Checklist
                </Text>

                <ScrollView>
                  {newActionCheckList[0]?.Anh !== null &&
                    newActionCheckList[0]?.Anh !== "" && (
                      <Image
                        style={{
                          width: SIZES.width * 0.8,
                          height: SIZES.height * 0.5,
                          objectFit: "cover",
                        }}
                        source={{
                          uri: `https://drive.google.com/thumbnail?id=${newActionCheckList[0]?.Anh}`,
                        }}
                      />
                    )}

                  <View
                    style={{
                      flexDirection: "column",
                      marginVertical: 15,
                      gap: 4,
                    }}
                  >
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Tầng:{" "}
                      {newActionCheckList[0]?.ent_checklist?.ent_tang?.Tentang}
                    </Text>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Khu vực:{" "}
                      {
                        newActionCheckList[0]?.ent_checklist?.ent_khuvuc
                          ?.Tenkhuvuc
                      }
                    </Text>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Tòa nhà:{" "}
                      {
                        newActionCheckList[0]?.ent_checklist?.ent_khuvuc
                          ?.ent_toanha?.Toanha
                      }
                    </Text>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Khối công việc:{" "}
                      {newActionCheckList[0]?.tb_checklistc?.ent_khoicv?.KhoiCV}
                    </Text>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Người checklist:{" "}
                      {newActionCheckList[0]?.tb_checklistc?.ent_user?.Hoten}
                    </Text>

                    <Text allowFontScaling={false} style={styles.textModal}>
                      Ca làm việc:{" "}
                      {newActionCheckList[0]?.tb_checklistc?.ent_calv?.Tenca} (
                      {
                        newActionCheckList[0]?.tb_checklistc?.ent_calv
                          ?.Giobatdau
                      }{" "}
                      -{" "}
                      {
                        newActionCheckList[0]?.tb_checklistc?.ent_calv
                          ?.Gioketthuc
                      }
                      )
                    </Text>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Giờ checklist: {newActionCheckList[0]?.Gioht}
                    </Text>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Kết quả: {newActionCheckList[0]?.Ketqua}{" "}
                      {newActionCheckList[0]?.ent_checklist?.isCheck == 0
                        ? ""
                        : `${newActionCheckList[0]?.ent_checklist?.Giatrinhan}`}
                    </Text>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Ghi chú: {newActionCheckList[0]?.Ghichu}
                    </Text>
                  </View>
                </ScrollView>
              </View>
              <TouchableOpacity
                onPress={() => handleModalShow(false, 1)}
                style={styles.buttonImage}
              >
                <Text allowFontScaling={false} style={styles.textImage}>
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ImageBackground>
  );
};

export default DetailCheckListCa;
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    margin: 12,
    flex: 1,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "white",
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
  textModal: { fontSize: 15, color: "black", fontWeight: "600" },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    flexDirection: "row",
    backgroundColor: COLORS.bg_button,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  textImage: {
    padding: 12,
    color: "white",
    fontWeight: "700",
    fontSize: 16,
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
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: SIZES.height * 0.7,
    width: SIZES.width * 0.85,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
