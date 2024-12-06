import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  BackHandler,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { BASE_URL } from "../../constants/config";
import { COLORS, SIZES, marginBottomValue } from "../../constants/theme";
import { useSelector } from "react-redux";
import axios from "axios";
import adjust from "../../adjust";
import ItemDetailChecklistCa from "../../components/Item/ItemDetailChecklistCa";
import { funcBaseUri_Image, getImageUrls } from "../../utils/util";
const DetailCheckListCa = ({ route }) => {
  const headerList = [
    {
      title: "Checklist",
      width: SIZES.width * 0.5,
    },
    {
      title: "Giờ",
      width: SIZES.width * 0.25,
    },
    {
      title: "Kết quả",
      width: SIZES.width * 0.25,
    },
  ];

  const { ID_ChecklistC } = route.params;
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [data, setData] = useState([]);
  const [dataChecklistCa, setDataChecklistCa] = useState([]);
  const [newActionCheckList, setNewActionCheckList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        handleModalShow(false, 1);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [modalVisible]);


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
        setDataChecklistCa(response.data.dataChecklistC);
      } catch (error) {
        if (error.response) {
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ID_ChecklistC]);

  const toggleTodo = (item, index) => {
    console.log('index')
    setNewActionCheckList((prev) =>
      prev == null ||
      prev.ID_Checklist !== item.ID_Checklist ||
      prev.index !== index
        ? { ...item, index }
        : null
    );
  };

  const handleModalShow = (active, op) => {
    setModalVisible(active);
    setOpacity(op);
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

  const handleImagePress = (item) => {
    setSelectedImage(getImageUrls(1, item));
    setImageModalVisible(true);
  };

  const ImagePreviewModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={imageModalVisible}
      onRequestClose={() => setImageModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.imagePreviewBackground}
        activeOpacity={1}
        onPress={() => setImageModalVisible(false)}
      >
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../../assets/bg.png")}
          style={[styles.backgroundImage]}
          resizeMode="cover"
        >
          {data && data?.length > 0 ? (
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                opacity: opacity 
              }}
            >
              <>
                <View style={styles.headerRow}>
                  {headerList.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.headerCell,
                        {
                          flex: item.width,
                          borderRightWidth:
                            index === headerList.length - 1 ? 0 : 1,
                          borderRightColor: "white",
                        },
                      ]}
                    >
                      <Text style={[styles.text, { color: "black" }]}>
                        {item.title}
                      </Text>
                    </View>
                  ))}
                </View>

                {data?.length > 0 && (
                  <FlatList
                    keyExtractor={(item, index) =>
                      `${item.ID_Checklist}_${index}`
                    }
                    horizontal={false}
                    // contentInsetAdjustmentBehavior="automatic"
                    // contentContainerStyle={{
                    //   paddingBottom:
                    //     Platform.OS === "android" ? adjust(50) : adjust(0),
                    // }}
                    contentInsetAdjustmentBehavior={
                      Platform.OS === "ios" ? "never" : "automatic"
                    }
                    contentContainerStyle={{
                      paddingBottom:
                        Platform.OS === "ios" ? adjust(80) : adjust(60),
                    }}
                    onScrollToIndexFailed={(info) => {
                      // Ngăn chặn việc tự động cuộn khi click item cuối
                      return { index: info.index, animated: false };
                    }}
                    data={data}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    // contentInset={{ bottom: 70 }}
                    ListFooterComponent={() => (
                      <View
                        style={{
                          height: adjust(50),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "gray",
                            fontSize: 12,
                          }}
                        >
                          Đã hiển thị {data.length} mục
                        </Text>
                      </View>
                    )}
                    renderItem={({ item, index }) => (
                      <ItemDetailChecklistCa
                        index={index}
                        item={item}
                        toggleTodo={toggleTodo}
                        newActionCheckList={newActionCheckList}
                      />
                    )}
                  />
                )}
              </>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
                Không có dữ liệu
              </Text>
            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => handleModalShow(false, 1)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text allowFontScaling={false} style={styles.modalText}>
                    Thông tin Checklist
                  </Text>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {newActionCheckList?.Anh !== null &&
                      newActionCheckList?.Anh !== "" &&
                      newActionCheckList?.Anh !== undefined && (
                        <FlatList
                          data={
                            newActionCheckList?.Anh
                              ? newActionCheckList?.Anh.split(",")
                              : []
                          }
                          renderItem={({ item, index }) => (
                            <View style={styles.imageContainer} key={index}>
                              <TouchableOpacity
                                onPress={() => handleImagePress(item)}
                              >
                                <Image
                                  style={styles.image}
                                  source={{
                                    uri: getImageUrls(1, item),
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{
                            justifyContent:
                              newActionCheckList?.Anh?.split(",").length === 1
                                ? "center"
                                : "flex-start",
                            flexGrow: 1,
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
                        {newActionCheckList?.ent_checklist?.ent_tang?.Tentang}
                      </Text>
                      <Text allowFontScaling={false} style={styles.textModal}>
                        Hạng mục - Khu vực:{" "}
                        {
                          newActionCheckList?.ent_checklist?.ent_hangmuc
                            ?.Hangmuc
                        }{" "}
                        -
                        {
                          newActionCheckList?.ent_checklist?.ent_khuvuc
                            ?.Tenkhuvuc
                        }
                      </Text>
                      <Text allowFontScaling={false} style={styles.textModal}>
                        Tòa nhà:{" "}
                        {
                          newActionCheckList?.ent_checklist?.ent_khuvuc
                            ?.ent_toanha?.Toanha
                        }
                      </Text>
                      <Text allowFontScaling={false} style={styles.textModal}>
                        Khối công việc:{" "}
                        {newActionCheckList?.tb_checklistc?.ent_khoicv?.KhoiCV
                          ? newActionCheckList?.tb_checklistc?.ent_khoicv
                              ?.KhoiCV
                          : dataChecklistCa?.ent_khoicv?.KhoiCV}
                      </Text>
                      <Text allowFontScaling={false} style={styles.textModal}>
                        Người checklist:{" "}
                        {newActionCheckList?.tb_checklistc?.ent_user?.Hoten
                          ? newActionCheckList?.tb_checklistc?.ent_user?.Hoten
                          : dataChecklistCa?.ent_user?.Hoten}
                        {/* {newActionCheckList?.tb_checklistc?.ent_user?.Hoten} */}
                      </Text>

                      <Text allowFontScaling={false} style={styles.textModal}>
                        Ca làm việc:{" "}
                        {newActionCheckList?.tb_checklistc?.ent_calv?.Tenca
                          ? newActionCheckList?.tb_checklistc?.ent_calv?.Tenca
                          : dataChecklistCa?.ent_calv?.Tenca}
                        (
                        {newActionCheckList?.tb_checklistc?.ent_calv?.Giobatdau
                          ? newActionCheckList?.tb_checklistc?.ent_calv
                              ?.Giobatdau
                          : dataChecklistCa?.ent_calv?.Giobatdau}{" "}
                        -{" "}
                        {newActionCheckList?.tb_checklistc?.ent_calv?.Gioketthuc
                          ? newActionCheckList?.tb_checklistc?.ent_calv
                              ?.Gioketthuc
                          : dataChecklistCa?.ent_calv?.Gioketthuc}
                        )
                      </Text>
                      <Text allowFontScaling={false} style={styles.textModal}>
                        Giờ checklist: {newActionCheckList?.Gioht}
                      </Text>
                      <Text allowFontScaling={false} style={styles.textModal}>
                        Kết quả: {newActionCheckList?.Ketqua}{" "}
                        {newActionCheckList?.ent_checklist?.isCheck == 0
                          ? ""
                          : `${newActionCheckList?.ent_checklist?.Giatrinhan}`}
                      </Text>
                      <Text allowFontScaling={false} style={styles.textModal}>
                        Ghi chú: {newActionCheckList?.Ghichu}
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
          </Modal>

        
          <ImagePreviewModal />
        </ImageBackground>
        {newActionCheckList && (
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
                zIndex:1000
              }}
            >
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleModalShow(true, 0.2)}
                >
                  <Image
                    source={require("../../../assets/icons/ic_detail.png")}
                    style={{
                      width: adjust(40),
                      height: adjust(40),
                      tintColor: "white",
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </>
            </View>
          )}
      </GestureHandlerRootView>
  );
};

export default DetailCheckListCa;
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#eeeeee",
  },
  headerCell: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
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
    marginBottom: adjust(30),
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
  imageContainer: {
    marginHorizontal: 10,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  imagePreviewBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreviewContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: SIZES.width,
    height: SIZES.height,
  },
  closeButton: {
    position: "absolute",
    top: adjust(40),
    right: adjust(0),
    padding: adjust(10),
    borderRadius: adjust(25),
    backgroundColor: "black",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
});
