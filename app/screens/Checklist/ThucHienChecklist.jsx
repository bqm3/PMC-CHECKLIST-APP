import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import ButtonChecklist from "../../components/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import { DataTable } from "react-native-paper";

const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: "Page 1",
  },
  {
    key: 2,
    name: "Page 2",
  },
  {
    key: 3,
    name: "Page 3",
  },
];

const dataList = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

const calamviecList = [
  { label: "Sáng", value: "sang" },
  { label: "Chiều", value: "chieu" },
  { label: "Tối", value: "toi" },
];

const headerList = [
  {
    til: "Ngày",
    width: 90,
  },
  {
    til: "Tên ca",
    width: 90,
  },
  {
    til: "Nhân viên",
    width: 180,
  },
  {
    til: "Giờ bắt đầu",
    width: 100,
  },
  {
    til: "Tình trạng",
    width: 100,
  },
  {
    til: "Ghi chú",
    width: 100,
  },
  ,
  {
    til: "Giờ kết thúc",
    width: 100,
  },
  ,
  {
    til: "ID",
    width: 70,
  },
  ,
  {
    til: "Giờ chụp ảnh 1",
    width: 120,
  },
  ,
  {
    til: "Giờ chụp ảnh 2",
    width: 120,
  },
  ,
  {
    til: "Giờ chụp ảnh 3",
    width: 120,
  },
  ,
  {
    til: "Giờ chụp ảnh 4",
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

const ThucHienChecklist = ({navigation}) => {
  const ref = useRef(null);
  const date = new Date();
  const dateHour = moment(date).format("LT");
  const dateDay = moment(date).format("L");
  const [flexHeight, setFlexHeight] = useState(null);
  const [tinhTrang, setTinhTrang] = useState(true);
  const [focusRow, setFocusRow] = useState(false);

  const [valueDate, setValueDate] = useState("");

  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, dataTable.length);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  useEffect(() => {
    if (SIZES.height > 700) {
      setFlexHeight(3.5);
    } else {
      setFlexHeight(4);
    }
  }, [SIZES.height]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.container,
          {
            flexDirection: "column",
          },
        ]}
      >
        <View style={{ flex: flexHeight }}>
          <View
            style={{
              flexDirection: "column",
              padding: 10,
              height: "100%",
              justifyContent: "space-around",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  flex: 2,
                  justifyContent: "space-around",
                  alignItems: "flex-end",
                }}
              >
                <Text style={styles.text}>Ngày</Text>
                <Text style={styles.text}>Ca</Text>
                <Text style={styles.text}>Nhân viên</Text>
              </View>
              <View style={{ flex: 8, justifyContent: "space-around" }}>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    value={dateDay}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                      },
                    ]}
                    autoCapitalize="none"
                  />

                  <TextInput
                    value={dateHour}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                      },
                    ]}
                    autoCapitalize="none"
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Dropdown
                    ref={ref}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    data={calamviecList}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Ca làm việc"
                    value={valueDate}
                    onChange={(item) => {
                      setValueDate(item.value);
                    }}
                    // renderItem={renderItem}
                    confirmSelectItem
                    onConfirmSelectItem={(item) => {
                      Alert.alert("PMC", "Xác nhận đồng ý", [
                        {
                          text: "Cancel",
                          onPress: () => {},
                        },
                        {
                          text: "Confirm",
                          onPress: () => {
                            setValueDate(item.value);
                            ref.current.close();
                          },
                        },
                      ]);
                    }}
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Dropdown
                    ref={ref}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={dataList}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Nhân viên"
                    searchPlaceholder="Search..."
                    value={valueDate}
                    onChange={(item) => {
                      setValueDate(item.value);
                    }}
                    // renderItem={renderItem}
                    confirmSelectItem
                    onConfirmSelectItem={(item) => {
                      Alert.alert("PMC", "Xác nhận đồng ý", [
                        {
                          text: "Cancel",
                          onPress: () => {},
                        },
                        {
                          text: "Confirm",
                          onPress: () => {
                            setValueDate(item.value);
                            ref.current.close();
                          },
                        },
                      ]);
                    }}
                  />
                </View>
              </View>
            </View>
            {/* inputs  */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {tinhTrang && (
                <ButtonChecklist
                  text={"Khóa ca"}
                  width={"auto"}
                  color={COLORS.bg_main}
                  onPress={() =>
                    Alert.alert("Button with adjusted color pressed")
                  }
                />
              )}

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View>
                  {tinhTrang && (
                    <ButtonChecklist
                      text={"Mở lại"}
                      width={"auto"}
                      color="red"
                      onPress={() =>
                        Alert.alert("Button with adjusted color pressed")
                      }
                    />
                  )}
                </View>
                <View>
                  <ButtonChecklist
                    text={"Thêm mới"}
                    width={"auto"}
                    marginLeft={10}
                    color={COLORS.bg_main}
                    onPress={() =>
                      // Alert.alert("Button with adjusted color pressed")
                      navigation.navigate("Chi tiết Checklist", {
                        itemId: 1
                      })
                    }
                  />
                </View>
                <View>
                  <ButtonChecklist
                    text={"Chụp ảnh"}
                    width={"auto"}
                    marginLeft={10}
                    color={COLORS.bg_main}
                    onPress={() =>
                      Alert.alert("Button with adjusted color pressed")
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 10 - flexHeight }}>
          <ScrollView
            horizontal={true}
            style={{ width: SIZES.width, alignSelf: "center" }}
          >
            <DataTable>
              <DataTable.Header numberOfLines={2}>
                {headerList &&
                  headerList.map((data, index) => (
                    <DataTable.Title
                    key={index}
                      style={{
                        width: data.width,
                        justifyContent: "center",
                      }}
                    >
                      {data.til}
                    </DataTable.Title>
                  ))}
              </DataTable.Header>
              {dataTable &&
                dataTable.map((data, index) => (
                  <DataTable.Row
                    key={index}
                    style={{
                      backgroundColor:
                        focusRow === data.ID ? "#6fa8dc" : "white",
                    }}
                    onPress={() => {
                      if (data.tinhtrang === "Xong") {
                        setTinhTrang(false);
                      } else {
                        setTinhTrang(true);
                      }
                      setFocusRow(data.ID);
                    }}
                  >
                    <DataTable.Cell
                      style={{
                        width: 20,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        color: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.ngay}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 20,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.tenca}
                    </DataTable.Cell>
                    <DataTable.Cell
                      numberOfLines={2}
                      style={{
                        width: 110,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.nhanvien}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 30,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.giobd}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 25,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.tinhtrang}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 30,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.ghichu}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 30,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.giokt}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 0,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.ID}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 50,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.giochup1}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 50,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.giochup2}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 50,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "#bcbcbc",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.giochup3}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{
                        width: 50,
                        justifyContent: "center",
                        colors: focusRow === data.ID ? "white" : "black",
                      }}
                    >
                      {data.giochup4}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}

              <DataTable.Pagination
                style={{ justifyContent: "flex-start" }}
                page={page}
                numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} đến ${items.length}`}
                showFastPaginationControls
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={numberOfItemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                selectPageDropdownLabel={"Hàng trên mỗi trang"}
              />
            </DataTable>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: { fontSize: 15, color: "black", fontWeight: "600" },
  textInput: {
    color: "#05375a",
    marginHorizontal: 10,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    marginTop: 10,
    height: 36,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  head: {
    backgroundColor: COLORS.bg_main,
    // height: 30
  },
  headText: {
    textAlign: "center",
    color: COLORS.text_main,
  },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
});

export default ThucHienChecklist;
