import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "../../constants/theme";
import ButtonChecklist from "../Button/ButtonCheckList";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalKhuvuc = ({
  ent_khoicv,
  ent_toanha,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  loadingSubmit,
}) => {
  const ref = useRef(null);

  const defaultKhoiCV = ent_khoicv?.find(
    (khoicv) => khoicv.ID_Khoi === dataInput?.khoicv
  );
  const defaultToanha = ent_toanha?.find(
    (duan) => duan.ID_Toanha === dataInput?.toanha
  );

  const [formData, setFormData] = useState({
    tenkhuvuc: dataInput.tenkhuvuc,
    qrcode: dataInput.qrcode,
    makhuvuc: dataInput.makhuvuc,
    sothutu: dataInput.sothutu,
  });

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
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
            <Text allowFontScaling={false} style={styles.text}>
              Khối công việc
            </Text>
            {ent_khoicv && ent_khoicv?.length > 0 ? (
              <SelectDropdown
                data={ent_khoicv ? ent_khoicv : []}
                buttonStyle={styles.select}
                dropdownStyle={{
                  borderRadius: 8,
                  maxHeight: 400,
                }}
                // rowStyle={{ height: 50, justifyContent: "center" }}
                defaultButtonText={"Khối công việc"}
                buttonTextStyle={styles.customText}
                defaultValue={defaultKhoiCV}
                onSelect={(selectedItem, index) => {
                  handleChangeText("khoicv", selectedItem.ID_Khoi);
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
                      <Text allowFontScaling={false} style={styles.text}>
                        {selectedItem?.KhoiCV}
                      </Text>
                    </View>
                  );
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <VerticalSelect
                      value={item.ID_Khoi}
                      label={item.KhoiCV}
                      key={index}
                      selectedItem={dataInput.khoicv}
                    />
                  );
                }}
              />
            ) : (
              <Text allowFontScaling={false} style={styles.errorText}>
                Không có dữ liệu khối công việc.
              </Text>
            )}
          </View>
          <View style={{ width: "48%" }}>
            <Text allowFontScaling={false} style={styles.text}>
              Tòa nhà
            </Text>
            {ent_toanha && ent_toanha?.length > 0 ? (
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
                defaultValue={defaultToanha}
                onSelect={(selectedItem, index) => {
                  handleChangeText("toanha", selectedItem.ID_Toanha);
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
                      <Text allowFontScaling={false} style={styles.text}>
                        {selectedItem?.Toanha}
                      </Text>
                    </View>
                  );
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <VerticalSelect
                      value={item.ID_Toanha}
                      label={item.Toanha}
                      key={index}
                      selectedItem={dataInput.toanha}
                    />
                  );
                }}
              />
            ) : (
              <Text allowFontScaling={false} style={styles.errorText}>
                Không có dữ liệu tòa nhà.
              </Text>
            )}
          </View>
        </View>
        <Text allowFontScaling={false} style={styles.text}>
          Tên khu vực
        </Text>
        <TextInput
          allowFontScaling={false}
          value={formData.tenkhuvuc}
          placeholder="Nhập tên khu vực thực hiện checklist"
          placeholderTextColor="gray"
          style={[
            styles.textInput,
            {
              paddingHorizontal: 10,
            },
          ]}
          autoCapitalize="sentences"
          onChangeText={(val) => {
            handleChangeText("tenkhuvuc", val), handleChange("tenkhuvuc", val);
          }}
        />
        <Text allowFontScaling={false} style={styles.text}>
          Mã Qr code
        </Text>
        <TextInput
          allowFontScaling={false}
          value={formData.qrcode}
          placeholder="Nhập mã Qr code"
          placeholderTextColor="gray"
          style={[
            styles.textInput,
            {
              paddingHorizontal: 10,
            },
          ]}
          autoCapitalize="sentences"
          onChangeText={(val) => {
            handleChangeText("qrcode", val);
            handleChange("qrcode", val);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "48%" }}>
            <Text allowFontScaling={false} style={styles.text}>
              Mã khu vực
            </Text>
            <TextInput
              allowFontScaling={false}
              value={formData.makhuvuc}
              placeholder="Nhập mã khu vực thực hiện checklist"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => {
                handleChangeText("makhuvuc", val);
                handleChange("makhuvuc", val);
              }}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Text allowFontScaling={false} style={styles.text}>
              Số thứ tự
            </Text>
            <TextInput
              allowFontScaling={false}
              value={`${formData.sothutu}`}
              placeholder="Nhập số thứ tự khu vực thực hiện checklist"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => {
                handleChangeText("sothutu", val);
                handleChange("sothutu", val);
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <ButtonSubmit
          text={isCheckUpdate.check ? "Cập nhật" : "Lưu"}
          width={"auto"}
          backgroundColor={COLORS.bg_button}
          color={"white"}
          isLoading={loadingSubmit}
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
