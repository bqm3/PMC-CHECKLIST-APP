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
  FlatList,
  Image,
} from "react-native";
import {
  ent_khuvuc_get,
  ent_toanha_get,
  ent_hangmuc_get,
} from "../../redux/actions/entActions";
import SelectDropdown from "react-native-select-dropdown";
import React, { useEffect, useRef, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { COLORS, SIZES } from "../../constants/theme";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import VerticalSelect from "../../components/Vertical/VerticalSelect";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Entypo, AntDesign, FontAwesome } from "@expo/vector-icons";
import ButtonSubmit from "../Button/ButtonSubmit";
import Checkbox from "expo-checkbox";
import adjust from "../../adjust";
import moment from "moment";
import { filter, set } from "lodash";

const ModalChangeTinhTrangSuCo = ({
  changeStatus,
  handleChangeStatus,
  handleCloseTinhTrang,
  handleSubmitStatus,
  loadingStatus,
  ngayXuLy,
  handleChangeDate,
  handleSubmitStatusImage,
  images,
  handleRemoveImage,
  pickImage,
  dataInput,
  handleChangeText,
  resetDataInput,
  modalHeight,
  setModalHeight,
  newActionClick,
}) => {
  const dispath = useDispatch();

  const { ent_khuvuc, ent_khoicv, ent_toanha, ent_hangmuc } = useSelector(
    (state) => state.entReducer
  );
  const [dataKhuvuc, setDataKhuvuc] = useState([]);
  const [dataHangmuc, setDataHangmuc] = useState([]);
  const [dataCheckKhuvuc, setDataCheckKhuvuc] = useState({
    ID_Toanha: null,
    ID_Khuvuc: null,
  });
  const [isCheckhangmuc, setHangMuc] = useState(
    newActionClick[0]?.ent_hangmuc?.Hangmuc
  );
  const tinhTrang = newActionClick[0]?.Tinhtrangxuly;
  let hangmuc = newActionClick[0]?.ent_hangmuc?.Hangmuc;

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  useEffect(() => {
    init_toanha();
    init_hangmuc();
    init_khuvuc();
  }, []);

  useEffect(() => {
    if (ent_khuvuc && dataCheckKhuvuc.ID_Toanha) {
      const filterData = ent_khuvuc.filter(
        (item) => item.ID_Toanha === dataCheckKhuvuc.ID_Toanha
      );
      setDataKhuvuc(filterData);
      if (filterData.length == 0) {
        dataCheckKhuvuc.ID_Khuvuc = [];
      }
    }

    if (ent_hangmuc && dataCheckKhuvuc?.ID_Khuvuc) {
      const filterData = ent_hangmuc.filter(
        (item) => item.ID_Khuvuc === dataCheckKhuvuc.ID_Khuvuc
      );
      setDataHangmuc(filterData);
    } else if (dataKhuvuc.length === 0) {
      setDataHangmuc([]);
    }
  }, [ent_khuvuc, ent_hangmuc, dataCheckKhuvuc]);

  const handleSubmit = () => {
    if (isCheckhangmuc == undefined) {
      Alert.alert("PMC Thông báo", "Phải chọn hạng mục", [
        {
          text: "Hủy",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      if (changeStatus?.status3) {
        handleSubmitStatusImage();
      } else {
        handleSubmitStatus();
      }
    }
  };

  const handleChangeTextKhuVuc = (key, value) => {
    setDataCheckKhuvuc((data) => ({
      ...data,
      [key]: value,
    }));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <View
          style={{
            margin: 10,
            flex: 1,
            height: "100%",
            minHeight: modalHeight,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View>
              <Text
                style={{
                  color: "black",
                  fontWeight: "600",
                  fontSize: 20,
                  marginBottom: 10,
                }}
              >
                Thay đổi trạng thái
              </Text>
              {hangmuc == undefined ? (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "49%" }}>
                      <Text allowFontScaling={false} style={styles.text}>
                        Tòa nhà
                      </Text>
                      {ent_toanha && ent_toanha?.length > 0 ? (
                        <SelectDropdown
                          data={ent_toanha}
                          buttonStyle={styles.select}
                          dropdownStyle={{
                            borderRadius: 8,
                            maxHeight: 400,
                          }}
                          defaultButtonText={"Tòa nhà"}
                          buttonTextStyle={styles.customText}
                          // defaultValue={defaultToaNha}
                          onSelect={(selectedItem, index) => {
                            handleChangeTextKhuVuc(
                              "ID_Toanha",
                              selectedItem.ID_Toanha
                            );
                          }}
                          renderDropdownIcon={(isOpened) => {
                            return (
                              <FontAwesome
                                name={isOpened ? "chevron-up" : "chevron-down"}
                                color={"#637381"}
                                size={14}
                              />
                            );
                          }}
                          dropdownIconPosition={"right"}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return (
                              <Text
                                allowFontScaling={false}
                                style={[styles.text, { color: "black" }]}
                              >
                                {selectedItem?.Toanha}
                              </Text>
                            );
                          }}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <VerticalSelect
                                value={item.ID_Toanha}
                                label={item.Toanha}
                                key={index}
                                selectedItem={dataCheckKhuvuc.ID_Toanha}
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

                    <View style={{ width: "49%" }}>
                      <Text allowFontScaling={false} style={styles.text}>
                        Khu vực
                      </Text>
                      {dataKhuvuc && dataKhuvuc?.length > 0 ? (
                        <SelectDropdown
                          data={dataKhuvuc ? dataKhuvuc : []}
                          buttonStyle={styles.select}
                          dropdownStyle={{
                            borderRadius: 8,
                            maxHeight: 400,
                          }}
                          // rowStyle={{ height: 50, justifyContent: "center" }}
                          defaultButtonText={"Khu vực"}
                          buttonTextStyle={styles.customText}
                          // defaultValue={defaultKhuvuc}
                          onSelect={(selectedItem, index) => {
                            handleChangeTextKhuVuc(
                              "ID_Khuvuc",
                              selectedItem.ID_Khuvuc
                            );
                          }}
                          renderDropdownIcon={(isOpened) => {
                            return (
                              <FontAwesome
                                name={isOpened ? "chevron-up" : "chevron-down"}
                                color={"#637381"}
                                size={14}
                              />
                            );
                          }}
                          dropdownIconPosition={"right"}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return (
                              <Text
                                allowFontScaling={false}
                                style={[styles.text, { color: "black" }]}
                              >
                                {selectedItem?.Tenkhuvuc}
                              </Text>
                            );
                          }}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <VerticalSelect
                                value={item.ID_Khuvuc}
                                label={item.Tenkhuvuc}
                                key={index}
                                selectedItem={dataCheckKhuvuc.ID_Khuvuc}
                              />
                            );
                          }}
                        />
                      ) : (
                        <Text allowFontScaling={false} style={styles.errorText}>
                          Không có dữ liệu khu vực
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={{ width: "100%" }}>
                    {dataHangmuc && dataHangmuc?.length > 0 && (
                      <View>
                        <Text allowFontScaling={false} style={styles.text}>
                          Hạng mục
                        </Text>
                        <SelectDropdown
                          data={dataHangmuc}
                          buttonStyle={[styles.select]}
                          dropdownStyle={{
                            borderRadius: 8,
                            maxHeight: 400,
                          }}
                          defaultButtonText={"Hạng mục"}
                          buttonTextStyle={[styles.customText]}
                          // defaultValue={defaultHangmuc}
                          onSelect={(selectedItem, index) => {
                            handleChangeText(
                              "ID_Hangmuc",
                              selectedItem.ID_Hangmuc
                            );
                            setHangMuc(selectedItem.ID_Hangmuc);
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
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.text,
                                  { color: "black", textAlign: "center" },
                                ]}
                              >
                                {selectedItem?.Hangmuc}
                              </Text>
                            );
                          }}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <VerticalSelect
                                value={item.ID_Hangmuc}
                                label={item.Hangmuc}
                                key={index}
                                selectedItem={dataInput.ID_Hangmuc}
                              />
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                {tinhTrang != 0 ? (
                  <View style={styles.section}>
                    <Checkbox
                      disabled
                      style={styles.checkbox}
                      value={changeStatus?.status1}
                      onValueChange={() => {
                        handleChangeStatus("status1", !changeStatus?.status1);
                      }}
                      color={changeStatus?.status1 ? "#4630EB" : undefined}
                    />
                    <Text style={styles.paragraph}>Chưa xử lý</Text>
                  </View>
                ) : null}
                {tinhTrang != 1 ? (
                  <View style={styles.section}>
                    <Checkbox
                      style={styles.checkbox}
                      value={changeStatus?.status2}
                      onValueChange={() => {
                        handleChangeStatus("status2", !changeStatus?.status2);
                      }}
                      color={changeStatus?.status2 ? "#4630EB" : undefined}
                    />
                    <Text style={styles.paragraph}>Đang xử lý</Text>
                  </View>
                ) : null}
                <View style={styles.section}>
                  <Checkbox
                    style={styles.checkbox}
                    value={changeStatus?.status3}
                    onValueChange={() => {
                      handleChangeStatus("status3", !changeStatus?.status3);
                    }}
                    color={changeStatus?.status3 ? "#4630EB" : undefined}
                  />
                  <Text style={styles.paragraph}>Đã xử lý</Text>
                </View>
              </View>
            </View>
            <View style={{ width: "100%" }}>
              <Text allowFontScaling={false} style={styles.text}>
                Ngày xử lý
              </Text>
              <TouchableOpacity
                onPress={() => handleChangeDate("isCheck", true)}
              >
                <View style={styles.action}>
                  <TextInput
                    allowFontScaling={false}
                    value={ngayXuLy.date}
                    placeholder="Nhập ngày xử lý"
                    placeholderTextColor="gray"
                    style={{
                      paddingLeft: 12,
                      color: "#05375a",
                      width: "80%",
                      fontSize: adjust(16),
                      height: adjust(50),
                    }}
                    pointerEvents="none"
                  />
                  <TouchableOpacity
                    onPress={() => handleChangeDate("isCheck", true)}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: adjust(50),
                      width: adjust(50),
                    }}
                  >
                    <AntDesign name="calendar" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <DateTimePickerModal
                  isVisible={ngayXuLy.isCheck}
                  mode="date"
                  isDarkModeEnabled={true}
                  maximumDate={new Date()}
                  onConfirm={(date) => {
                    handleChangeDate("date", moment(date).format("DD-MM-YYYY"));
                    handleChangeDate("isCheck", false);
                  }}
                  onCancel={() => handleChangeDate("isCheck", false)}
                />
              </TouchableOpacity>
            </View>
            {changeStatus?.status3 && (
              <View>
                {/* Nội dung sự cố */}
                <Text allowFontScaling={false} style={styles.text}>
                  Ghi chú
                </Text>
                <TextInput
                  allowFontScaling={false}
                  placeholder="Nội dung"
                  placeholderTextColor="gray"
                  textAlignVertical="top"
                  multiline={true}
                  blurOnSubmit={true}
                  value={dataInput.Noidungghichu}
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                      height: 50,
                    },
                  ]}
                  onChangeText={(text) => {
                    handleChangeText("Noidungghichu", text);
                  }}
                />

                {/* Hình ảnh */}
                <Text allowFontScaling={false} style={styles.text}>
                  Hình ảnh
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 60,
                      width: 60,
                    }}
                    onPress={() => pickImage()}
                  >
                    <Entypo name="camera" size={20} color="black" />
                  </TouchableOpacity>
                  {images.length > 0 && (
                    <FlatList
                      horizontal={true}
                      contentContainerStyle={{ flexGrow: 1 }}
                      data={images}
                      renderItem={({ item, index }) => (
                        <View style={{ marginLeft: 10 }}>
                          <Image
                            source={{ uri: item }}
                            style={{
                              width: 80,
                              height: 100,
                              position: "relative",
                              opacity: 0.8,
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: 30,
                              left: 15,
                              width: 50,
                              height: 50,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={() => handleRemoveImage(item)}
                          >
                            <FontAwesome
                              name="remove"
                              size={adjust(30)}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      scrollEventThrottle={16}
                      scrollEnabled={true}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", marginBottom: 20, gap: 10 }}>
            <ButtonSubmit
              text={"Đóng"}
              width={"49%"}
              backgroundColor={"grey"}
              color={"white"}
              onPress={() => {
                handleCloseTinhTrang();
                resetDataInput();
                // setModalHeight(350);
              }}
            />
            <ButtonSubmit
              text={"Cập nhật"}
              width={"49%"}
              backgroundColor={COLORS.bg_button}
              color={"white"}
              onPress={() => handleSubmit()}
              isLoading={loadingStatus}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalChangeTinhTrangSuCo;

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
    // paddingTop: 12,
  },
  checkbox: {
    margin: 8,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  text2: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
    textAlign: "left",
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
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: adjust(30),
    paddingVertical: 4,
    backgroundColor: "white",
  },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: adjust(30),
  },
  customText: {
    fontWeight: "600",
    fontSize: 14,
    width: "100%",
  },
});
