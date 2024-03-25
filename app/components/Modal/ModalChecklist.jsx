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

const ModalChecklist = ({
  ent_tang,
  ent_khuvuc,
  ent_toanha,
  ent_khoicv,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  handleConfirm,
  handleEditEnt,
  handleChangeTextKhuVuc,
  dataCheckKhuvuc,
  handleDataKhuvuc,
  activeKhuVuc,
  dataKhuVuc,
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
            {/* Số thứ tự - Mã số  */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Số thứ tự</Text>
                <TextInput
                  value={dataInput.Sothutu}
                  placeholder="Số thứ tự"
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}
                  onChangeText={(val) => handleChangeText("Sothutu", val)}
                //   pointerEvents="none"
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Mã số</Text>
                <TextInput
                  value={dataInput.Maso}
                  placeholder="Mã số"
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}
                  onChangeText={(val) => handleChangeText("Maso", val)}
                //   pointerEvents="none"
                />
              </View>
            </View>
            {/* Mã Qr code  */}
            <Text style={styles.text}>Mã Qr code</Text>
            <TextInput
              value={dataInput.MaQrCode}
              placeholder="Nhập Qr code"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => handleChangeText("MaQrCode", val)}
            />
            {/* Tên checklist  */}
            <Text style={styles.text}>Tên Checklist</Text>
            <TextInput
              value={dataInput.Checklist}
              placeholder="Nhập tên Checklist"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => handleChangeText("Checklist", val)}
            />

            <Text style={styles.text}>Giá trị định danh</Text>
            <TextInput
              value={dataInput.Giatridinhdanh}
              placeholder="Nhập giá trị định danh"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => handleChangeText("Giatridinhdanh", val)}
            />
            <Text style={styles.textNote}>
              Nếu không có thì không phải nhập
            </Text>

            <Text style={styles.text}>Giá trị nhận</Text>
            <TextInput
              value={dataInput.Giatrinhan}
              placeholder="Nhập giá trị nhận"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => handleChangeText("Giatrinhan", val)}
            />
            <Text style={[styles.textNote, { color: "red" }]}>
              Tại ô Giá trị nhận nhập theo định dạng - Giá trị 1/Giá trị 2...
              (Ví dụ : Sáng/Tắt, Bật/Tắt, Đạt/Không đạt, On/Off,..)
            </Text>

            {/* Tòa nhà và khối công việc  */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Tòa nhà</Text>

                <Dropdown
                  ref={ref}
                  style={styles.dropdown}
                  mode="modal"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={ent_toanha ? ent_toanha : []}
                  maxHeight={300}
                  labelField="Toanha"
                  valueField="ID_Toanha"
                  placeholder="Tòa nhà"
                  value={dataCheckKhuvuc.ID_Toanha}
                  onChange={(item) => {
                    handleChangeTextKhuVuc("ID_Toanha", item.ID_Toanha);
                    handleDataKhuvuc({
                      ID_Toanha: item.ID_Toanha,
                      ID_KhoiCV: dataCheckKhuvuc.ID_KhoiCV,
                    });
                    ref.current.close();
                  }}
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Khối công việc</Text>

                <Dropdown
                  ref={ref}
                  mode="modal"
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={ent_khoicv ? ent_khoicv : []}
                  maxHeight={300}
                  labelField="KhoiCV"
                  valueField="ID_Khoi"
                  placeholder="Khối công việc"
                  value={dataCheckKhuvuc.ID_KhoiCV}
                  onChange={(item) => {
                    handleChangeTextKhuVuc("ID_KhoiCV", item.ID_Khoi);
                    handleDataKhuvuc({
                      ID_Toanha: dataCheckKhuvuc.ID_Toanha,
                      ID_KhoiCV: item.ID_KhoiCV,
                    });
                    ref.current.close();
                  }}
                />
              </View>
            </View>

            {/* Tầng và khu vực  */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text style={styles.text}>Tầng</Text>

                <Dropdown
                  ref={ref}
                  style={styles.dropdown}
                  mode="modal"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={ent_tang ? ent_tang : []}
                  maxHeight={300}
                  labelField="Tentang"
                  valueField="ID_Tang"
                  placeholder="Tầng"
                  value={dataInput.ID_Tang}
                  onChange={(item) => {
                    handleChangeText("ID_Tang", item.ID_Tang);
                    ref.current.close();
                  }}
                />
              </View>
              <View style={{ width: "48%" }}>
                {activeKhuVuc && (
                  <>
                    <Text style={styles.text}>Khu vực</Text>

                    <Dropdown
                      ref={ref}
                      mode="modal"
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      iconStyle={styles.iconStyle}
                      data={dataKhuVuc ? dataKhuVuc : []}
                      maxHeight={300}
                      labelField="Tenkhuvuc"
                      valueField="ID_Khuvuc"
                      placeholder="Tên khu vực"
                      value={dataInput.ID_Khuvuc}
                      onChange={(item) => {
                        handleChangeText("ID_Khuvuc", item.ID_Khuvuc);
                        ref.current.close();
                      }}
                    />
                  </>
                )}
              </View>
            </View>

            <View style={{ height: 20 }}></View>
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

export default ModalChecklist;

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
  textNote: { color: "gray", fontSize: 13, padding: 2, fontStyle: "italic" },
});
