import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS } from "../../constants/theme";
import KeyboardAvoidingComponent from "../KeyboardAvoidingComponent";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import VerticalSelect from "../VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalCalamviec = ({
  ent_khoicv,
  handleChangeText,
  showDatePicker,
  dataInput,
  hideDatePicker,
  isDatePickerVisible,
  handleConfirm,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  loadingSubmit,
}) => {
  const defaultKhoi = ent_khoicv?.find(
    (Khoi) => Khoi.ID_Khoi === dataInput?.khoicv
  );

  const ref = useRef(null);
  const height = useHeaderHeight();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={height}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <View style={{ margin: 20 }}>
          <View style={{ justifyContent: "space-around", width: "100%" }}>
            <Text allowFontScaling={false} style={styles.text}>
              Khối công việc
            </Text>

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
              defaultValue={defaultKhoi}
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
            <Text allowFontScaling={false} style={styles.text}>
              Tên ca
            </Text>
            <TextInput
              allowFontScaling={false}
              value={dataInput.tenca}
              placeholder="Nhập tên ca thực hiện checklist"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => handleChangeText("tenca", val)}
            />

            <Text allowFontScaling={false} style={styles.text}>
              Giờ bắt đầu
            </Text>
            <TouchableOpacity onPress={() => showDatePicker("giobd")}>
              <View style={styles.action}>
                <TextInput
                  allowFontScaling={false}
                  value={dataInput.giobd}
                  placeholder="Nhập giờ bắt đầu ca làm việc"
                  placeholderTextColor="gray"
                  style={{
                    paddingLeft: 12,
                    color: "#05375a",
                    width: "80%",
                    fontSize: 16,
                    height: 50,
                  }}
                  pointerEvents="none"
                />
                <TouchableOpacity
                  onPress={() => showDatePicker("giobd")}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                    width: 50,
                  }}
                >
                  <AntDesign name="calendar" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible.giobd}
                mode="time"
                isDarkModeEnabled={true}
                onConfirm={(date) => handleConfirm("giobd", date)}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.text}>
              Giờ kết thúc
            </Text>
            <TouchableOpacity onPress={() => showDatePicker("giokt")}>
              <View style={styles.action}>
                <TextInput
                  allowFontScaling={false}
                  value={dataInput.giokt}
                  placeholder="Nhập giờ kết thúc ca làm việc"
                  placeholderTextColor="gray"
                  style={{
                    paddingLeft: 12,
                    color: "#05375a",
                    width: "80%",
                    fontSize: 16,
                    height: 50,
                  }}
                  pointerEvents="none"
                />
                <TouchableOpacity
                  onPress={() => showDatePicker("giokt")}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                    width: 50,
                  }}
                >
                  <AntDesign name="calendar" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible.giokt}
                mode="time"
                isDarkModeEnabled={true}
                onConfirm={(date) => handleConfirm("giokt", date)}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            <ButtonSubmit
              text={isCheckUpdate.check ? "Cập nhật" : "Lưu"}
              width={"auto"}
              color={"white"}
              backgroundColor={COLORS.bg_button}
              isLoading={loadingSubmit}
              onPress={
                isCheckUpdate.check
                  ? () => handlePushDataEdit(isCheckUpdate.id_calv)
                  : () => handlePushDataSave()
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalCalamviec;

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
  action: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
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
  dropdown: {
    height: 48,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 4,
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
