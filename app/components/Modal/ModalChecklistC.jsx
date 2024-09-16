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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalChecklistC = ({
  ent_calv,
  dataInput,
  handleChangeText,
  handlePushDataSave,
  isLoading,
  handleClosePopUp,
}) => {
  const ref = useRef(null);
  const defaultCalv = ent_calv?.find(
    (calv) => calv.ID_Calv === dataInput?.Calv?.ID_Calv
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <View style={{ margin: 10 }}>
          <View
            style={{
              justifyContent: "space-between",
              width: "100%",
              height: '100%'
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Ngày
                  </Text>
                  <TextInput
                    allowFontScaling={false}
                    value={dataInput.dateDay}
                    editable={false}
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                        backgroundColor: "#bcbcbc",
                      },
                    ]}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Giờ
                  </Text>
                  <TextInput
                    allowFontScaling={false}
                    value={dataInput.dateHour}
                    editable={false}
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                        backgroundColor: "#bcbcbc",
                      },
                    ]}
                  />
                </View>
              </View>
              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Ca làm việc
                </Text>
                {ent_calv && ent_calv?.length > 0 ? (
                  <SelectDropdown
                    ref={ref}
                    data={ent_calv ? ent_calv : []}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 400,
                    }}
                    // rowStyle={{ height: 50, justifyContent: "center" }}
                    defaultButtonText={"Ca làm việc"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultCalv}
                    onSelect={(selectedItem, index) => {
                      handleChangeText("Calv", selectedItem);
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
                            {selectedItem?.Tenca} -{" "}
                            {selectedItem?.ent_khoicv?.KhoiCV}
                          </Text>
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <VerticalSelect
                          value={item.ID_Calv}
                          label={`${item?.Tenca} - ${item?.ent_khoicv?.KhoiCV}`}
                          key={index}
                          selectedItem={dataInput?.Calv?.ID_Calv}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ liệu ca làm việc.
                  </Text>
                )}
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
               justifyContent: "space-between",
               width: "100%",
            }}>
              
              <View style={{ marginTop: 20, width:'49%' }}>
                <ButtonSubmit
                  text={"Đóng"}
                  width={"100%"}
                  backgroundColor={"grey"}
                  color={"white"}
                  onPress={handleClosePopUp}
                />
              </View>
              <View style={{ marginTop: 20, width:'49%' }}>
                <ButtonSubmit
                  text={"Tạo ca làm việc"}
                  width={"auto"}
                  backgroundColor={COLORS.bg_button}
                  color={"white"}
                  isLoading={isLoading}
                  onPress={handlePushDataSave}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalChecklistC;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
    // paddingTop: 12,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 50,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 10,
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
    height: 50,
    backgroundColor: "white",
    zIndex: 1,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
