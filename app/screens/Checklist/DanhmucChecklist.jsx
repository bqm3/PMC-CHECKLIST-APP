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
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";

const numberOfItemsPerPageList = [2, 3, 4];

const headerList = [
  {
    til: "Tên checklist",
    width: 150,
  },
  {
    til: "Giá trị nhận",
    width: 90,
  },
  {
    til: "Tòa nhà",
    width: 180,
  },
  {
    til: "Tầng",
    width: 100,
  },
  {
    til: "Khu vực",
    width: 100,
  },
  {
    til: "Bộ phận",
    width: 100,
  },
  ,
  {
    til: "Giá trị định danh",
    width: 100,
  },
  ,
  {
    til: "Mã checklist",
    width: 120,
  },
  {
    til: "Số thứ tự",
    width: 120,
  },
];

const dataTable = [
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "Xong",
    ghichu: "note note asdfdasf adfasfadf adfadasdf",
    giokt: "10:43 PM",
    ID: 1,
    giochup1: "10:43 PM",
    giochup2: "10:43 PM",
    giochup3: "10:43 PM",
    giochup4: "10:43 PM",
  },
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "",
    ghichu: "",
    giokt: "10:43 PM",
    ID: 2,
    giochup1: "",
    giochup2: "",
    giochup3: "",
    giochup4: "",
  },
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "Xong",
    ghichu: "",
    giokt: "10:43 PM",
    ID: 3,
    giochup1: "",
    giochup2: "",
    giochup3: "",
    giochup4: "",
  },
  {
    ngay: "3/18/2024",
    tenca: "Ca tối",
    nhanvien: "Nguyễn Mạnh Hùng",
    giobd: "10:44 AM",
    tinhtrang: "Xong",
    ghichu: "",
    giokt: "10:43 PM",
    ID: 4,
    giochup1: "",
    giochup2: "",
    giochup3: "",
    giochup4: "",
  },
];

const DanhmucChecklist = ({ navigation }) => {
  const dispath = useDispatch();

  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, dataTable.length);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const decimalNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  };

  const _renderItem = ({ item }) => (
    <DataTable.Row>
      <DataTable.Cell
        centered={true}
        style={{ width: 120, borderRightWidth: 1, borderColor: "red" }}
      >
        {/* <Text></Text> */}
        {item.ID}
      </DataTable.Cell>
      <DataTable.Cell
        style={{ width: 120, borderRightWidth: 1, borderColor: "red" }}
      >
        {item.giobd}
      </DataTable.Cell>
      <DataTable.Cell style={{ width: "10%" }}>{item.giobd}</DataTable.Cell>
      <DataTable.Cell style={{ width: "10%" }}>{item.giobd}</DataTable.Cell>
      <DataTable.Cell style={{ width: "10%" }}>{item.giobd}</DataTable.Cell>
      <DataTable.Cell style={{ width: "10%" }}>{item.giobd}</DataTable.Cell>
      <DataTable.Cell style={{ width: "10%" }}>{item.giobd}</DataTable.Cell>
      <DataTable.Cell style={{ width: "10%" }}>{item.giobd}</DataTable.Cell>
      <DataTable.Cell style={{ width: "10%" }}>{item.giobd}</DataTable.Cell>
    </DataTable.Row>
  );

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
                width: "100%",
                // opacity: opacity,
              }}
            >
              <View style={styles.container}>
                <Text style={styles.danhmuc}>Danh mục Checklist</Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "600",
                    paddingBottom: 20,
                  }}
                >
                  Số lượng: {decimalNumber(dataTable?.length)}
                </Text>
                {dataTable?.length > 0 ? (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
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
                        <Text style={styles.text}>Lọc dữ liệu</Text>
                      </TouchableOpacity>
                      <ButtonChecklist
                        text={"Thêm mới"}
                        width={"auto"}
                        color={COLORS.bg_button}
                        icon={<Ionicons name="add" size={24} color="white" />}
                        // onPress={handlePresentModalPress}
                      />
                    </View>

                    {/* <ScrollView
                      horizontal={true}
                      style={{
                        width: SIZES.width,
                        alignSelf: "center",
                        marginTop: 20,
                      }}
                    >
                      <DataTable
                        style={{
                          backgroundColor: "white",
                          borderRadius: 8,
                          width: 1200,
                        }}
                      >
                        <DataTable.Header numberOfLines={2}>
                          {headerList &&
                            headerList.map((data, index) => (
                              <DataTable.Title
                                key={index}
                                style={{
                                  width: data.width,
                                  justifyContent: "center",
                                  borderRightWidth: 1,
                                  borderColor: "red",
                                }}
                                numberOfLines={2}
                              >
                                {data.til}
                              </DataTable.Title>
                            ))}
                        </DataTable.Header>
                        {dataTable && (
                          <FlatList data={dataTable} renderItem={_renderItem} />
                        )}
                        <DataTable.Pagination
                          style={{ justifyContent: "flex-start" }}
                          page={page}
                          // numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                          onPageChange={(page) => setPage(page)}
                          // label={`${from + 1}-${to} đến ${items.length}`}
                          showFastPaginationControls
                          numberOfItemsPerPageList={numberOfItemsPerPageList}
                          numberOfItemsPerPage={numberOfItemsPerPage}
                          onItemsPerPageChange={onItemsPerPageChange}
                          selectPageDropdownLabel={"Hàng trên mỗi trang"}
                        />
                      </DataTable>
                    </ScrollView> */}

                    <DataTable>
                    <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column' }}>
                        <DataTable.Header style={{width: 1600}}>
                          <DataTable.Title style={{ width: 200 }}>
                            Column 1
                          </DataTable.Title>
                          <DataTable.Title style={{ width: 300 }}>
                            Column 2
                          </DataTable.Title>
                          <DataTable.Title style={{ width: 250 }}>
                            Column 3
                          </DataTable.Title>
                          <DataTable.Title style={{ width: 250 }}>
                            Column 3
                          </DataTable.Title>
                          <DataTable.Title style={{ width: 250 }}>
                            Column 3
                          </DataTable.Title>
                          <DataTable.Title style={{ width: 250 }}>
                            Column 3
                          </DataTable.Title>
                          <DataTable.Title style={{ width: 250 }}>
                            Column 3
                          </DataTable.Title>
                          <DataTable.Title style={{ width: 250 }}>
                            Column 3
                          </DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row
                          style={{ backgroundColor: "red", height: 200,width: 1600 }}
                        >
                          <DataTable.Cell style={{ width: 200 }}>
                            Item 1
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 300 }}>
                            Item 2
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 250 }}>
                            Item 3
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 250 }}>
                            Item 3
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 250 }}>
                            Item 3
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 250 }}>
                            Item 3
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 250 }}>
                            Item 3
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 250 }}>
                            Item 3
                          </DataTable.Cell>
                        </DataTable.Row>
                      </ScrollView>
                    </DataTable>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 100,
                      }}
                    >
                      <Image
                        source={require("../../../assets/icons/delete_bg.png")}
                        resizeMode="contain"
                        style={{ height: 120, width: 120 }}
                      />
                      <Text style={[styles.danhmuc, { paddingVertical: 10 }]}>
                        Bạn chưa thêm dữ liệu nào
                      </Text>
                      <ButtonChecklist
                        text={"Thêm mới"}
                        width={"auto"}
                        color={COLORS.bg_button}
                        onPress={handleAdd}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          </ImageBackground>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DanhmucChecklist;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
    // paddingVertical: 40,
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
});
