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
import { Portal } from "react-native-paper";

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

const ThucHienChecklist = () => {
  const ref = useRef(null);
  const date = new Date();
  const dateHour = moment(date).format("LT");
  const dateDay = moment(date).format("L");

  const [valueDate, setValueDate] = useState("");

  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  return (
    
    <SafeAreaView style={styles.container}>
      {/* <Portal style={styles.container}> */}
        <View
          style={[
            styles.container,
            {
              flexDirection: "column",
            },
          ]}
        >
          <View style={{ flex: 4 }}>
            <View
              style={{
                flex: 1,

                flexDirection: "column",
                padding: 10,
                height: '100%',
                justifyContent: 'space-around',
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
                      placeholderTextColor="#666666"
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
                      placeholderTextColor="#666666"
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
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={dataList}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder="Thuộc dự án"
                      searchPlaceholder="Search..."
                      value={valueDate}
                      onChange={(item) => {
                        setValueDate(item.value);
                      }}
                      // renderItem={renderItem}
                      confirmSelectItem
                      onConfirmSelectItem={(item) => {
                        Alert.alert("Confirm", "Message confirm", [
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
                      placeholder="Thuộc dự án"
                      searchPlaceholder="Search..."
                      value={valueDate}
                      onChange={(item) => {
                        setValueDate(item.value);
                      }}
                      // renderItem={renderItem}
                      confirmSelectItem
                      onConfirmSelectItem={(item) => {
                        Alert.alert("Confirm", "Message confirm", [
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
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ButtonChecklist
              text={'Khóa ca'}
              width={'auto'}
              color={COLORS.bg_main}
              onPress={() => Alert.alert('Button with adjusted color pressed')}
            />
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View>
                <ButtonChecklist
                  text={'Mở lại'}
                  width={'auto'}
                  color="red"
                  onPress={() =>
                    Alert.alert('Button with adjusted color pressed')
                  }
                />
              </View>
              <View>
                <ButtonChecklist
                  text={'Thêm mới'}
                  width={'auto'}
                  marginLeft={10}
                  color={COLORS.bg_main}
                  onPress={() =>
                    Alert.alert('Button with adjusted color pressed')
                  }
                />
              </View>
              <View>
                <ButtonChecklist
                  text={'Chụp ảnh'}
                  width={'auto'}
                  marginLeft={10}
                  color={COLORS.bg_main}
                  onPress={() =>
                    Alert.alert('Button with adjusted color pressed')
                  }
                />
              </View>
            </View>
          </View>
            </View>
          </View>
          <View style={{ flex: 6 }}>
            <ScrollView
              horizontal={true}
              style={{ width: SIZES.width, alignSelf: "center" }}
            >
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title sortDirection="descending">
                    Dessert
                  </DataTable.Title>
                  <DataTable.Title numeric>Calories</DataTable.Title>
                  <DataTable.Title numeric>Fat (g)</DataTable.Title>
                  <DataTable.Title numeric>Fat (g)</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <DataTable.Cell numeric>1</DataTable.Cell>
                  <DataTable.Cell numeric>2</DataTable.Cell>
                  <DataTable.Cell numeric>3</DataTable.Cell>
                  <DataTable.Cell numeric>4</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell numeric>1</DataTable.Cell>
                  <DataTable.Cell numeric>2</DataTable.Cell>
                  <DataTable.Cell numeric>3</DataTable.Cell>
                  <DataTable.Cell numeric>4</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row style={{ backgroundColor: "red" }}>
                  <DataTable.Cell numeric>1</DataTable.Cell>
                  <DataTable.Cell numeric>2</DataTable.Cell>
                  <DataTable.Cell numeric>3</DataTable.Cell>
                  <DataTable.Cell numeric>4</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${from + 1}-${to} of ${items.length}`}
                  showFastPaginationControls
                  // numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={numberOfItemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                  // selectPageDropdownLabel={'Rows per page'}
                />
              </DataTable>
            </ScrollView>
          </View>
        </View>
      {/* </Portal> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: { fontSize: 15, color: "black" },
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
