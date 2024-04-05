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
import ButtonSubmit from "../Button/ButtonSubmit";

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
  ent_khoicv,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  toggleDatePicker,
  isDatePickerVisible,
  handleConfirm,
  handleEditEnt,
  loadingSubmit,
}) => {
  const ref = useRef(null);

  const defaultChucvu = ent_chucvu?.find(
    (chucvu) => chucvu.ID_Chucvu === dataInput?.ID_Chucvu
  );
  const defaultDuan = ent_duan?.find(
    (duan) => duan.ID_Duan === dataInput?.ID_Duan
  );
  const defaultKhoi = ent_khoicv?.find(
    (khoi) => khoi.ID_Khoi === dataInput?.ID_KhoiCV
  );
  const defaultGioitinh = dataGioitinh?.find(
    (duan) => duan.value === dataInput?.gioitinh
  );

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
                  defaultValue={defaultGioitinh}
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
                  defaultValue={defaultDuan}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("ID_Duan", selectedItem.ID_Duan);
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
                        selectedItem={dataInput.ID_Duan}
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
                  defaultValue={defaultChucvu}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("ID_Chucvu", selectedItem.ID_Chucvu);
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
                        selectedItem={dataInput.ID_Chucvu}
                      />
                    );
                  }}
                />
              </View>
            </View>
            <View>
              <Text style={styles.text}>Khối công việc</Text>

              <SelectDropdown
                data={ent_khoicv ? ent_khoicv : []}
                buttonStyle={styles.select}
                dropdownStyle={{
                  borderRadius: 8,
                  maxHeight: 400,
                }}
                // rowStyle={{ height: 50, justifyContent: "center" }}
                defaultButtonText={"Chọn khối công việc"}
                buttonTextStyle={styles.customText}
                defaultValue={defaultKhoi}
                onSelect={(selectedItem, index) => {
                  handleChangeText("ID_KhoiCV", selectedItem.ID_Khoi);
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
                      selectedItem={dataInput.ID_KhoiCV}
                    />
                  );
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <ButtonSubmit
              text={isCheckUpdate.check ? "Cập nhật" : "Lưu"}
              width={"auto"}
              isLoading={loadingSubmit}
              color={"white"}
              backgroundColor={COLORS.bg_button}
              onPress={
                isCheckUpdate.check
                  ? () => handlePushDataEdit(isCheckUpdate.ID_Giamsat)
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
