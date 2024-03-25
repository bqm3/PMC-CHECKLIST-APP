import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React, { useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "../../constants/theme";
import ButtonChecklist from "../Button/ButtonCheckList";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  handleEditEnt
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
              autoCapitalize="true"
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
              autoCapitalize="true"
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
                <Dropdown
                  ref={ref}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={dataGioitinh ? dataGioitinh : []}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Giới tính"
                  value={dataInput.gioitinh}
                  onChange={(item) => {
                    handleChangeText("gioitinh", item.value);
                          ref.current.close();
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

                <Dropdown
                  ref={ref}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={ent_duan ? ent_duan : []}
                  maxHeight={300}
                  labelField="Duan"
                  valueField="ID_Duan"
                  placeholder="Dự án"
                  value={dataInput.id_duan}
                  onChange={(item) => {
                    handleChangeText("id_duan", item.ID_Duan);
                    ref.current.close();
                  }}
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Tòa nhà</Text>

                <Dropdown
                  ref={ref}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={ent_chucvu ? ent_chucvu : []}
                  maxHeight={300}
                  labelField="Chucvu"
                  valueField="ID_Chucvu"
                  placeholder="Chức vụ"
                  value={dataInput.id_chucvu}
                  onChange={(item) => {
                    handleChangeText("id_chucvu", item.ID_Chucvu);
                    ref.current.close();
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
});
