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
  Switch,
} from "react-native";
import React, { useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { COLORS } from "../../constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import moment from "moment";
import Button from "../Button/Button";
import ButtonSubmit from "../Button/ButtonSubmit";
import adjust from "../../adjust";

const ModalTracuu = ({
  handleChangeFilters,
  filters,
  toggleDatePicker,
  handlePresentModalClose,
  isDatePickerVisible,
  toggleSwitch,
  isEnabled,
  fetchData,
  ent_khoicv,
  ent_calv,
  user,
  handleKhoiSelection,
  filteredCalv,
  setOpacity,
  setVisibleBottom,
}) => {
  const ref = useRef(null);
  const defaultKhoi = ent_khoicv?.find(
    (Khoi) => Khoi.ID_KhoiCV == filters?.ID_KhoiCV
  );
  const arr_Duan_Array = user?.arr_Duan?.split(',').map(item => item.trim());

  return (
    <GestureHandlerRootView style={{ height: adjust(400) }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
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
                <Text allowFontScaling={false} style={styles.text}>
                  Từ ngày
                </Text>

                <TouchableOpacity
                  onPress={() => toggleDatePicker("fromDate", true)}
                >
                  <View style={styles.action}>
                    <TextInput
                      allowFontScaling={false}
                      value={filters?.fromDate}
                      placeholder="Từ ngày"
                      placeholderTextColor="gray"
                      style={{
                        paddingLeft: 12,
                        color: "#05375a",
                        width: "70%",
                        fontSize: 16,
                        height: 50,
                      }}
                      pointerEvents="none"
                    />
                    <TouchableOpacity
                      onPress={() => toggleDatePicker("fromDate", true)}
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
                    isVisible={isDatePickerVisible?.fromDate}
                    mode="date"
                    display="inline"
                    isDarkModeEnabled={true}
                    onConfirm={(date) => {
                      handleChangeFilters(
                        "fromDate",
                        moment(date).format("YYYY-MM-DD")
                      );
                      toggleDatePicker("fromDate", false);
                    }}
                    onCancel={() => toggleDatePicker("fromDate", false)}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Đến ngày
                </Text>
                <TouchableOpacity
                  onPress={() => toggleDatePicker("toDate", true)}
                >
                  <View style={styles.action}>
                    <TextInput
                      allowFontScaling={false}
                      value={filters?.toDate}
                      placeholder="Đến ngày"
                      placeholderTextColor="gray"
                      style={{
                        paddingLeft: 12,
                        color: "#05375a",
                        width: "70%",
                        fontSize: 16,
                        height: 50,
                      }}
                      pointerEvents="none"
                    />
                    <TouchableOpacity
                      onPress={() => toggleDatePicker("toDate", true)}
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
                    isVisible={isDatePickerVisible?.toDate}
                    mode="date"
                    display="inline"
                    isDarkModeEnabled={true}
                    onConfirm={(date) => {
                      handleChangeFilters(
                        "toDate",
                        moment(date).format("YYYY-MM-DD")
                      );
                      toggleDatePicker("toDate", false);
                    }}
                    onCancel={() => toggleDatePicker("toDate", false)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {(user?.ent_chucvu?.Role === 1 || user?.ent_chucvu?.Role === 5 && arr_Duan_Array.includes(String(user.ID_Duan))) ? (
                ent_khoicv && ent_khoicv.length > 0 ? (
                  <View>
                    <Text allowFontScaling={false} style={styles.text}>
                      Khối
                    </Text>
                    <SelectDropdown
                      data={ent_khoicv ? ent_khoicv : []}
                      style={{ alignItems: "center" }}
                      buttonStyle={styles.select}
                      dropdownStyle={{
                        borderRadius: 8,
                        maxHeight: 400,
                      }}
                      defaultButtonText={defaultKhoi !== undefined ? defaultKhoi : "Chọn khối công việc"}
                      defaultValue={defaultKhoi !== undefined ? defaultKhoi : ""}
                      buttonTextStyle={styles.customText}
                      onSelect={(selectedItem, index) => {
                        handleChangeFilters(
                          "ID_KhoiCV",
                          selectedItem?.ID_KhoiCV
                        );
                        handleKhoiSelection(selectedItem);
                      }}
                      renderDropdownIcon={(isOpened) => (
                        <FontAwesome
                          name={isOpened ? "chevron-up" : "chevron-down"}
                          color={"#637381"}
                          size={14}
                          style={{ marginRight: 10 }}
                        />
                      )}
                      dropdownIconPosition={"right"}
                      buttonTextAfterSelection={(selectedItem, index) => (
                        <View
                          key={index}
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            height: 50,
                          }}
                        >
                          <Text allowFontScaling={false} style={styles.text}>
                            {defaultKhoi !== undefined ? selectedItem?.KhoiCV : "Chọn khối công việc"}
                          </Text>
                        </View>
                      )}
                      renderCustomizedRowChild={(item, index) => (
                        <VerticalSelect
                          value={item.ID_KhoiCV}
                          label={item.KhoiCV}
                          key={index}
                          selectedItem={filters.ID_KhoiCV}
                        />
                      )}
                    />
                  </View>
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ liệu khối.
                  </Text>
                )
              ) : null}
            </View>
            <View>
              {user?.ent_chucvu?.Role !== 3 ? (
                filteredCalv && filteredCalv.length > 0 ? (
                  <>
                    <Text allowFontScaling={false} style={styles.text}>
                      Ca làm việc
                    </Text>
                    <SelectDropdown
                      data={filteredCalv}
                      buttonStyle={styles.select}
                      dropdownStyle={{
                        borderRadius: 8,
                        maxHeight: 400,
                      }}
                      defaultButtonText={"Ca làm việc"}
                      buttonTextStyle={styles.customText}
                      onSelect={(selectedItem, index) => {
                        handleChangeFilters("ID_Calv", selectedItem?.ID_Calv);
                      }}
                      renderDropdownIcon={(isOpened) => (
                        <FontAwesome
                          name={isOpened ? "chevron-up" : "chevron-down"}
                          color={"#637381"}
                          size={14}
                          style={{ marginRight: 10 }}
                        />
                      )}
                      dropdownIconPosition={"right"}
                      buttonTextAfterSelection={(selectedItem, index) => (
                        <View
                          key={index}
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            height: 50,
                          }}
                        >
                          <Text allowFontScaling={false} style={styles.text}>
                            {selectedItem?.Tenca}
                          </Text>
                        </View>
                      )}
                      renderCustomizedRowChild={(item, index) => (
                        <VerticalSelect
                          value={item.ID_Calv}
                          label={`${item?.Tenca}`}
                          key={index}
                          selectedItem={filters.ID_Calv ? filters.ID_Calv : null}
                        />
                      )}
                    />
                  </>
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ liệu ca làm việc.
                  </Text>
                )
              ) : ent_calv && ent_calv.length > 0 ? (
                <View>
                  <Text allowFontScaling={false} style={styles.text}>
                    Ca làm việc
                  </Text>
                  <SelectDropdown
                    data={ent_calv}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 400,
                    }}
                    defaultButtonText={"Ca làm việc"}
                    buttonTextStyle={styles.customText}
                    onSelect={(selectedItem, index) => {
                      handleChangeFilters("ID_Calv", selectedItem?.ID_Calv);
                    }}
                    renderDropdownIcon={(isOpened) => (
                      <FontAwesome
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        color={"#637381"}
                        size={14}
                        style={{ marginRight: 10 }}
                      />
                    )}
                    dropdownIconPosition={"right"}
                    buttonTextAfterSelection={(selectedItem, index) => (
                      <View
                        key={index}
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          {selectedItem?.Tenca}
                        </Text>
                      </View>
                    )}
                    renderCustomizedRowChild={(item, index) => (
                      <VerticalSelect
                        value={item.ID_Calv}
                        label={`${item?.Tenca}`}
                        key={index}
                        selectedItem={filters?.ID_Calv}
                      />
                    )}
                  />
                </View>
              ) : (
                <Text allowFontScaling={false} style={styles.errorText}>
                  Không có dữ liệu ca làm việc.
                </Text>
              )}
            </View>

            <View style={{ height: 10 }}></View>
            <View
              style={[
                styles.container,
                { justifyContent: "flex-start", flexDirection: "row" },
              ]}
            >
              <Switch
                trackColor={{ false: "#red", true: COLORS.bg_button }}
                thumbColor={isEnabled ? COLORS.color_bg : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(isEnabled)}
                value={isEnabled}
              />
              <Text
                allowFontScaling={false}
                style={[styles.text, { paddingHorizontal: 12 }]}
              >
                Tất cả
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 5 }}>
            <ButtonSubmit
              text={"Tìm kiếm"}
              width={"auto"}
              backgroundColor={COLORS.bg_button}
              color={"white"}
              onPress={() => {
                fetchData(filters, true, true);
                handlePresentModalClose();
                setVisibleBottom(false);
              }}
            />
            <View style={{ height: 10 }} />
            <Button
              text={"Đóng"}
              width={"auto"}
              backgroundColor={COLORS.bg_white}
              color={COLORS.color_bg}
              onPress={() => {
                handlePresentModalClose();
                setVisibleBottom(false);
              }}
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
