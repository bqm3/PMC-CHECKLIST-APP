import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { COLORS } from "../../constants/theme";
import ButtonChecklist from "../Button/ButtonCheckList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import moment from "moment";

const dataGioitinh = [
  {
    value: "nam",
    label: "Nam",
  },
  {
    value: "nu",
    label: "Nữ",
  },
  {
    value: "khac",
    label: "Khác",
  },
];

const ModalTracuu = ({
  handleChangeFilters,
  filters,
  toggleDatePicker,
  handleConfirm,
  isDatePickerVisible,
  ent_toanha,
  ent_tang,
  ent_khuvuc,
  ent_khoicv,
}) => {
  const ref = useRef(null);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ margin: 20 }}>
          <View style={{ justifyContent: "space-around", width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Từ ngày</Text>

                <TouchableOpacity
                  onPress={() => toggleDatePicker("firstDate", true)}
                >
                  <TextInput
                    value={filters?.firstDate}
                    placeholder="Nhập ngày sinh"
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                      },
                    ]}
                    pointerEvents="none"
                  />
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible?.firstDate}
                    mode="date"
                    //   date={new Date(filters?.firstDate)}
                    isDarkModeEnabled={true}
                    onConfirm={(date) => {
                      handleChangeFilters(
                        "firstDate",
                        moment(date).format("YYYY-MM-DD")
                      );
                      toggleDatePicker("firstDate", false);
                    }}
                    onCancel={() => toggleDatePicker("firstDate", false)}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Đến ngày</Text>
                <TouchableOpacity
                  onPress={() => toggleDatePicker("lastDate", true)}
                >
                  <TextInput
                    value={filters?.lastDate}
                    placeholder="Nhập ngày sinh"
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                      },
                    ]}
                    pointerEvents="none"
                  />
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible?.lastDate}
                    mode="date"
                    //   date={new Date(filters?.lastDate)}
                    isDarkModeEnabled={true}
                    onConfirm={(date) => {
                      handleChangeFilters(
                        "lastDate",
                        moment(date).format("YYYY-MM-DD")
                      );
                      toggleDatePicker("lastDate", false);
                    }}
                    onCancel={() => toggleDatePicker("lastDate", false)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.text}>Tòa nhà</Text>

              <SelectDropdown
                data={ent_toanha ? ent_toanha : []}
                buttonStyle={styles.select}
                dropdownStyle={{
                  borderRadius: 8,
                  maxHeight: 400,
                }}
                // rowStyle={{ height: 50, justifyContent: "center" }}
                defaultButtonText={"Tòa nhà"}
                buttonTextStyle={styles.customText}
                defaultValue={filters.ID_Toanha}
                onSelect={(selectedItem, index) => {
                  handleChangeFilters("ID_Toanha", selectedItem.ID_Toanha);
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#637381"}
                      size={14}
                      style={{ marginRight: 10 }}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        height: 50,
                      }}
                    >
                      <Text style={styles.text}>{selectedItem?.Toanha}</Text>
                    </View>
                  );
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <VerticalSelect
                      value={item.ID_Toanha}
                      label={item.Toanha}
                      key={index}
                      selectedItem={filters.ID_Toanha}
                    />
                  );
                }}
              />
            </View>
            <View>
              <Text style={styles.text}>Khu vực</Text>

              <SelectDropdown
                data={ent_khuvuc ? ent_khuvuc : []}
                buttonStyle={styles.select}
                dropdownStyle={{
                  borderRadius: 8,
                  maxHeight: 400,
                }}
                // rowStyle={{ height: 50, justifyContent: "center" }}
                defaultButtonText={"Khu vực"}
                buttonTextStyle={styles.customText}
                defaultValue={filters.ID_Khuvuc}
                onSelect={(selectedItem, index) => {
                  handleChangeFilters("ID_Khuvuc", selectedItem.ID_Khuvuc);
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#637381"}
                      size={14}
                      style={{ marginRight: 10 }}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        height: 50,
                      }}
                    >
                      <Text style={styles.text}>{selectedItem?.Tenkhuvuc}</Text>
                    </View>
                  );
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <VerticalSelect
                      value={item.ID_Khuvuc}
                      label={item.Tenkhuvuc}
                      key={index}
                      selectedItem={filters.ID_Khuvuc}
                    />
                  );
                }}
              />
            </View>
            <View>
              <Text style={styles.text}>Bộ phận</Text>

              <SelectDropdown
                data={ent_khoicv ? ent_khoicv : []}
                buttonStyle={styles.select}
                dropdownStyle={{
                  borderRadius: 8,
                  maxHeight: 400,
                }}
                // rowStyle={{ height: 50, justifyContent: "center" }}
                defaultButtonText={"Bộ phận"}
                buttonTextStyle={styles.customText}
                defaultValue={filters.ID_KhoiCV}
                onSelect={(selectedItem, index) => {
                  handleChangeFilters("ID_KhoiCV", selectedItem.ID_KhoiCV);
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#637381"}
                      size={14}
                      style={{ marginRight: 10 }}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        height: 50,
                      }}
                    >
                      <Text style={styles.text}>{selectedItem?.KhoiCV}</Text>
                    </View>
                  );
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <VerticalSelect
                      value={item.ID_Khoi}
                      label={item.KhoiCV}
                      key={index}
                      selectedItem={filters.ID_KhoiCV}
                    />
                  );
                }}
              />
            </View>
            <View>
              <Text style={styles.text}>Tầng</Text>

              <SelectDropdown
                data={ent_tang ? ent_tang : []}
                buttonStyle={styles.select}
                dropdownStyle={{
                  borderRadius: 8,
                  maxHeight: 400,
                }}
                // rowStyle={{ height: 50, justifyContent: "center" }}
                defaultButtonText={"Tầng"}
                buttonTextStyle={styles.customText}
                defaultValue={filters.ID_Tang}
                onSelect={(selectedItem, index) => {
                  handleChangeFilters("ID_Tang", selectedItem.ID_Tang);
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#637381"}
                      size={14}
                      style={{ marginRight: 10 }}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        height: 50,
                      }}
                    >
                      <Text style={styles.text}>{selectedItem?.Tentang}</Text>
                    </View>
                  );
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <VerticalSelect
                      value={item.ID_Tang}
                      label={item.Tentang}
                      key={index}
                      selectedItem={filters.ID_Tang}
                    />
                  );
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <ButtonChecklist
              text={"Tìm kiếm"}
              width={"auto"}
              color={COLORS.bg_button}
              // onPress={
              //   isCheckUpdate?.check
              //     ? () => handlePushDataEdit(isCheckUpdate?.id_giamsat)
              //     : () => handlePushDataSave()
              // }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalTracuu;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    height: 48,
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
  selectedTextStyle: {
    // color: COLORS.bg_button,
    fontWeight: "600",
  },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    backgroundColor: "white",
    zIndex: 1,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
