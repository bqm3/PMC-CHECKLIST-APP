import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "../../constants/theme";
import ButtonChecklist from "../Button/ButtonCheckList";

const ModalKhuvuc = ({
  ent_khoicv,
  ent_toanha,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
}) => {
  const ref = useRef(null);
  return (
    <View style={{ margin: 20 }}>
      <View style={{ justifyContent: "space-around", width: "100%" }}>
        <Text style={styles.text}>Tên khu vực</Text>
        <TextInput
          value={dataInput.tenkhuvuc}
          placeholder="Nhập tên khu vực thực hiện checklist"
          placeholderTextColor="gray"
          style={[
            styles.textInput,
            {
              paddingHorizontal: 10,
            },
          ]}
          autoCapitalize="sentences"
          onChangeText={(val) => handleChangeText("tenkhuvuc", val)}
        />
        <Text style={styles.text}>Mã Qr code</Text>
        <TextInput
          value={dataInput.qrcode}
          placeholder="Nhập mã Qr code"
          placeholderTextColor="gray"
          style={[
            styles.textInput,
            {
              paddingHorizontal: 10,
            },
          ]}
          autoCapitalize="sentences"
          onChangeText={(val) => handleChangeText("qrcode", val)}
        />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "48%" }}>
            <Text style={styles.text}>Mã khu vực</Text>
            <TextInput
              value={dataInput.makhuvuc}
              placeholder="Nhập mã khu vực thực hiện checklist"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => handleChangeText("makhuvuc", val)}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={styles.text}>Số thứ tự</Text>
            <TextInput
              value={dataInput.sothutu}
              placeholder="Nhập số thứ tự khu vực thực hiện checklist"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => handleChangeText("sothutu", val)}
            />
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
            <Text style={styles.text}>Khối công việc</Text>

            <Dropdown
              ref={ref}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={ent_khoicv ? ent_khoicv : []}
              maxHeight={300}
              labelField="KhoiCV"
              valueField="ID_Khoi"
              placeholder="Khối công việc"
              value={dataInput.khoicv}
              onChange={(item) => {
                handleChangeText("khoicv", item.ID_Khoi);
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
              data={ent_toanha ? ent_toanha : []}
              maxHeight={300}
              labelField="Toanha"
              valueField="ID_Toanha"
              placeholder="Tòa nhà"
              value={dataInput.toanha}
              onChange={(item) => {
                handleChangeText("toanha", item.ID_Toanha);
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
              ? () => handlePushDataEdit(isCheckUpdate.id_khuvuc)
              : () => handlePushDataSave()
          }
        />
      </View>
    </View>
  );
};

export default ModalKhuvuc;

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
