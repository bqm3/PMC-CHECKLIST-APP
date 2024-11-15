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
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import { ent_calv_get } from "../../redux/actions/entActions";
import { tb_checklistc_get } from "../../redux/actions/tbActions";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";
import ModalChecklistC from "../../components/Modal/ModalChecklistC";
import ModalChecklistCImage from "../../components/Modal/ModalChecklistCImage";
import WebView from "react-native-webview";
import adjust from "../../adjust";
import DetailCheckListCa from "./DetailCheckListCa";
import ItemChecklistCa from "../../components/Item/ItemChecklistCa";

// import mime from "mime";

const numberOfItemsPerPageList = [20, 30, 50];

const headerList = [
  {
    til: "Ngày",
    width: 120,
  },

  {
    til: "Tên ca",
    width: 150,
  },
  {
    til: "Số lượng",
    width: 100,
  },

  {
    til: "Nhân viên",
    width: 150,
  },
  {
    til: "Giờ bắt đầu - Giờ kết thúc",
    width: 150,
  },

  {
    til: "Tình trạng",
    width: 150,
  },
];
const DanhmucThongKe = memo(
  ({ handlePresentModalPress2 = () => {}, data = [], navigation }) => {
    const dispath = useDispatch();
    const { tb_checklistc } = useSelector((state) => state.tbReducer);
    const { user, authToken } = useSelector((state) => state.authReducer);

    const [page, setPage] = React.useState(0);

    const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
      numberOfItemsPerPageList[0]
    );
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const init_ca = async () => {
      await dispath(ent_calv_get());
    };

    const int_checklistc = async () => {
      await dispath(
        tb_checklistc_get({ page: page, limit: numberOfItemsPerPage })
      );
    };

    useEffect(() => {
      int_checklistc();
    }, [numberOfItemsPerPage, page]);

    useEffect(() => {
      init_ca();
      int_checklistc();
    }, []);

    const toggleTodo = (item, index) => {
      if (user?.ent_chucvu?.Role !== 3) {
        handleToggleOptions(item);
      } else {
        navigation.navigate("Chi tiết checklist ca", {
          ID_ChecklistC: item.ID_ChecklistC,
        });
      }
    };


    const notChecked = (item, index) => {
      navigation.navigate("Khu vực chưa checklist", {
        ID_ChecklistC: item.ID_ChecklistC,
        ID_KhoiCV: item.ID_KhoiCV,
        ID_ThietLapCa: item.ID_ThietLapCa,
        ID_Hangmucs: item.ID_Hangmucs,
        ID_Calv: item.ID_Calv,
      });
    };

    const scan = (item, index) => {
      navigation.navigate("Scan khu vực", {
        ID_ChecklistC: item.ID_ChecklistC,
      });
    };

    const detailCheckListCa = (item, index) => {
      navigation.navigate("Chi tiết checklist ca", {
        ID_ChecklistC: item.ID_ChecklistC,
      });
    }
    

    const handleToggleOptions = (item) => {
      if (selectedItem === item) {
        setSelectedItem(null); // Bỏ chọn nếu mục đã được chọn trước đó
      } else {
        setSelectedItem(item); // Chọn mục
      }
    };


    const decimalNumber = (number) => {
      if (number < 10 && number > 0) return `0${number}`;
      if (number === 0) return `0`;
      return number;
    };

    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
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
                <></>
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 40,
                }}
              >
                <ActivityIndicator size="large" color={"white"} />
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between", // Điều chỉnh khoảng cách giữa các phần tử
                    alignItems: "center", // Canh giữa các phần tử theo trục dọc
                    paddingBottom: 20,
                  }}
                >
                  {/* Text hiển thị số lượng */}
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Số lượng: {decimalNumber(data?.length)}
                  </Text>

                  {/* Button lọc dữ liệu */}
                  <TouchableOpacity
                    onPress={handlePresentModalPress2}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={require("../../../assets/icons/filter_icon.png")}
                      resizeMode="contain"
                      style={{ height: 24, width: 24 }}
                    />
                    <Text allowFontScaling={false} style={styles.text}>
                      Lọc dữ liệu
                    </Text>
                  </TouchableOpacity>
                </View>
                {data && data?.length > 0 ? (
                  // <ScrollView
                  //   style={{ flex: 1, marginBottom: 20 }}
                  //   showsVerticalScrollIndicator={false}
                  // >
                  <DataTable
                    style={{
                      backgroundColor: "white",
                      borderRadius: 10,
                      marginBottom: 40,
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

                      {data && data?.length > 0 && (
                        <FlatList
                          keyExtractor={(item, index) =>
                            `${index}`
                          }
                          scrollEnabled={true}
                          data={data}
                          // renderItem={_renderItem}
                          renderItem={({ item, index }) => (
                            <ItemChecklistCa
                              index={index}
                              item={item}
                              toggleTodo={toggleTodo}
                              selectedItem={selectedItem}
                            />
                          )}
                        />
                      )}
                      <DataTable.Pagination
                        style={{
                          justifyContent: "flex-start",
                          backgroundColor: "#eeeeee",
                          borderBottomRightRadius: 8,
                          borderBottomLeftRadius: 8,
                        }}
                        page={page}
                        numberOfPages={Math.ceil(tb_checklistc?.totalPages)}
                        onPageChange={(page) => {
                          setPage(page);
                        }}
                        label={`Từ ${page + 1} đến ${
                          tb_checklistc?.totalPages
                        }`}
                        showFastPaginationControls
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={numberOfItemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        selectPageDropdownLabel={"Hàng trên mỗi trang"}
                      />
                    </ScrollView>
                  </DataTable>
                ) : (
                  // </ScrollView>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 120,
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
                      Bạn chưa thêm dữ liệu nào
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
          {selectedItem && (
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
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: COLORS.bg_red }]}
                  onPress={() => notChecked(selectedItem)}
                >
                  <Image
                    source={require("../../../assets/icons/ic_unlock.png")}
                    style={{
                      tintColor: "white",
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={() => scan(selectedItem)}
                >
                  <Image
                    source={require("../../../assets/icons/ic_qrcode_35x35.png")}
                    style={{
                      tintColor: "white",
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={() => detailCheckListCa(selectedItem)}
                >
                  <Image
                    source={require("../../../assets/icons/ic_detail_checklistca.png")}
                    style={{
                      tintColor: "white",
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </>
            </View>
          )}
        </View>
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
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
    width: 65,
    height: 65,
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
});

export default DanhmucThongKe;
