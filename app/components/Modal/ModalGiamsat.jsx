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

const ModalGiamsat = ({
  ent_chucvu,
  ent_duan,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  toggleDatePicker,
  isDatePickerVisible,
  handleConfirm,
  handleEditEnt,
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
            <Text style={styles.text}>Họ tên</Text>
            <TextInput
              value={dataInput.hoten}
              placeholder="Nhập họ tên"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              onChangeText={(val) => handleChangeText("hoten", val)}
            />

            <Text style={styles.text}>Số điện thoại</Text>
            <TextInput
              keyboardType="numeric"
              value={dataInput.sodienthoai}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              onChangeText={(val) => handleChangeText("sodienthoai", val)}
            />
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Giới tính</Text>
                
                <SelectDropdown
                  data={dataGioitinh ? dataGioitinh : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Chọn giới tính"}
                  buttonTextStyle={styles.customText}
                  defaultValue={dataInput.gioitinh}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("gioitinh", selectedItem.value);
                    
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
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text style={styles.text}>{selectedItem?.label}</Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.value}
                        label={item.label}
                        key={index}
                        selectedItem={dataInput.gioitinh}
                      />
                    );
                  }}
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Ngày sinh</Text>
                <TouchableOpacity onPress={toggleDatePicker}>
                  <TextInput
                    value={dataInput.ngaysinh}
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
                    isVisible={isDatePickerVisible}
                    mode="date"
                    isDarkModeEnabled={true}
                    onConfirm={(date) => handleConfirm("ngaysinh", date)}
                    onCancel={toggleDatePicker}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Dự án</Text>

                <SelectDropdown
                  data={ent_duan ? ent_duan : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Chọn dự án"}
                  buttonTextStyle={styles.customText}
                  defaultValue={dataInput.id_duan}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("id_duan", selectedItem.ID_Duan);
                    
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
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text style={styles.text}>{selectedItem?.Duan}</Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Duan}
                        label={item.Duan}
                        key={index}
                        selectedItem={dataInput.id_duan}
                      />
                    );
                  }}
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Chức vụ</Text>
                <SelectDropdown
                ref={ref}
                  data={ent_chucvu ? ent_chucvu : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Chọn chức vụ"}
                  buttonTextStyle={styles.customText}
                  defaultValue={dataInput.id_chucvu}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("id_chucvu", selectedItem.ID_Chucvu);
                    
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
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text style={styles.text}>{selectedItem?.Chucvu}</Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Chucvu}
                        label={item.Chucvu}
                        key={index}
                        selectedItem={dataInput.id_chucvu}
                      />
                    );
                  }}
                />
                
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <ButtonChecklist
              text={isCheckUpdate.check ? "Cập nhật" : "Lưu"}
              width={"auto"}
              color={COLORS.bg_button}
              onPress={
                isCheckUpdate.check
                  ? () => handlePushDataEdit(isCheckUpdate.id_giamsat)
                  : () => handlePushDataSave()
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalGiamsat;

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
