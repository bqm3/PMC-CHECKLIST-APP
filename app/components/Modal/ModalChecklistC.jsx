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
  BackHandler
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS } from "../../constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalChecklistC = ({
  ent_calv_chuky,
  ent_calv, // Nếu vẫn cần dùng danh sách này để lấy thông tin chi tiết
  dataInput,
  handleChangeText,
  handlePushDataSave,
  isLoading,
  handleClosePopUp,
}) => {
  const chukyRef = useRef(null);
  const calvRef = useRef(null);

  const getDefaultChuky = () => {
    if (ent_calv_chuky?.length === 1) {
      return ent_calv_chuky[0];
    }
    return ent_calv_chuky?.find(
      (chuky) => chuky.ID_Duan_KhoiCV === dataInput?.ID_Duan_KhoiCV
    );
  };

  const defaultChuky = getDefaultChuky();

  // State để lưu chu kỳ đã chọn và danh sách ca làm việc tương ứng
  const [selectedChuky, setSelectedChuky] = useState(defaultChuky || null);
  const [availableCalv, setAvailableCalv] = useState([]);

  // Cập nhật danh sách ca làm việc từ ent_thietlapca_list
  useEffect(() => {
    if (selectedChuky && selectedChuky.ent_thietlapca_list) {
      const calvDetails = [
        ...new Map(
          selectedChuky.ent_thietlapca_list.map((item) => [item.ID_Calv, {
            ID_Calv: item.ID_Calv,
            Tenca: `${item?.ent_calv?.Tenca}`,
          }])
        ).values()
      ];
      
      setAvailableCalv(calvDetails);
    } else {
      setAvailableCalv([]);
    }
  }, [selectedChuky]);

  useEffect(() => {
    if (ent_calv_chuky?.length === 1 && !dataInput?.ID_Duan_KhoiCV) {
      const singleChuky = ent_calv_chuky[0];
      setSelectedChuky(singleChuky);
      handleChangeText("ID_Duan_KhoiCV", singleChuky.ID_Duan_KhoiCV);
    }
  }, [ent_calv_chuky, handleChangeText, dataInput?.ID_Duan_KhoiCV]);

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
              height: "100%",
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

              {/* Dropdown chọn chu kỳ */}
              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Chu kỳ
                </Text>
                {ent_calv_chuky && ent_calv_chuky?.length > 0 ? (
                  <SelectDropdown
                    ref={chukyRef}
                    data={ent_calv_chuky || []}
                    buttonStyle={styles.select}
                    dropdownStyle={{ borderRadius: 8, maxHeight: 400 }}
                    defaultButtonText={"Chọn chu kỳ"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultChuky}
                    onSelect={(selectedItem) => {
                      setSelectedChuky(selectedItem);
                      handleChangeText("ID_Duan_KhoiCV", selectedItem.ID_Duan_KhoiCV);
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
                    buttonTextAfterSelection={(selectedItem) => (
                      <View
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={styles.text}
                          numberOfLines={1}
                        >
                          {selectedItem?.Tenchuky}
                        </Text>
                      </View>
                    )}
                    renderCustomizedRowChild={(item) => (
                      <VerticalSelect
                        value={item.ID_Duan_KhoiCV}
                        label={`${item?.Tenchuky}`}
                        selectedItem={dataInput?.ID_Duan_KhoiCV}
                      />
                    )}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ liệu chu kỳ.
                  </Text>
                )}
              </View>

              {/* Dropdown chọn ca làm việc */}
              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Ca làm việc
                </Text>
                {availableCalv.length > 0 ? (
                  <SelectDropdown
                    ref={calvRef}
                    data={availableCalv}
                    buttonStyle={styles.select}
                    dropdownStyle={{ borderRadius: 8, maxHeight: 400 }}
                    defaultButtonText={"Chọn ca làm việc"}
                    buttonTextStyle={styles.customText}
                    onSelect={(selectedItem) => {
                      handleChangeText("Calv", {
                        ID_Calv: selectedItem.ID_Calv,
                        Tenca: selectedItem.Tenca
                      });
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
                    buttonTextAfterSelection={(selectedItem) => (
                      <View
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={styles.text}
                          numberOfLines={1}
                        >
                          {`${selectedItem?.Tenca}`}
                        </Text>
                      </View>
                    )}
                    renderCustomizedRowChild={(item) => (
                      <VerticalSelect
                        value={item.ID_Calv}
                        label={`${item?.Tenca}`}
                        selectedItem={dataInput?.Calv}
                      />
                    )}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Vui lòng chọn chu kỳ để chọn ca làm việc.
                  </Text>
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View style={{ marginTop: 20, width: "49%" }}>
                <ButtonSubmit
                  text={"Đóng"}
                  width={"100%"}
                  backgroundColor={"grey"}
                  color={"white"}
                  onPress={handleClosePopUp}
                />
              </View>
              <View style={{ marginTop: 20, width: "49%" }}>
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
    fontSize: 14,
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
    height: 50,
    paddingVertical: 4,
    backgroundColor: "white",
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
  errorText: {
    fontSize: 14,
    color: "red",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});