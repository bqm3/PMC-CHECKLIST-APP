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
import React, { memo, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "../../constants/theme";
import ButtonSubmit from "../Button/ButtonSubmit";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";

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
  handleChangeTextKhuVuc,
  dataCheckKhuvuc,
  handleDataKhuvuc,
  activeKhuVuc,
  dataKhuVuc,
  loadingSubmit,
  // setTieuchuan,
  // tieuChuan,
}) => {
  const ref = useRef(null);

  const defaultTang = ent_tang?.find(
    (tang) => tang.ID_Tang === dataInput?.ID_Tang
  );
  const defaultToanha = ent_toanha?.find(
    (toanha) => toanha.ID_Toanha === dataCheckKhuvuc?.ID_Toanha
  );
  const defaultKhoi = ent_khoicv?.find(
    (Khoi) => Khoi.ID_Khoi === dataCheckKhuvuc?.ID_KhoiCV
  );
  const defaultKhuvuc = ent_khuvuc?.find(
    (Khuvuc) => Khuvuc.ID_Khuvuc === dataInput?.ID_Khuvuc
  );
  const defaultButtonText = defaultTang ? defaultTang : "Tầng";

  // Tạo state cho Tiêu chuẩn và Ghi chú
  const [tieuchuan, setTieuchuan] = useState(dataInput?.Tieuchuan);
  const [ghichu, setGhichu] = useState(dataInput?.Ghichu);

  // Tạo state cho Số thứ tự và Mã số
  const [sothutu, setSothutu] = useState(dataInput?.Sothutu);
  const [maso, setMaso] = useState(dataInput?.Maso);

  // Tạo state cho Mã Qr code, Tên checklist, Giá trị định danh, Giá trị nhận
  const [maQrCode, setMaQrCode] = useState(dataInput?.MaQrCode);
  const [tenChecklist, setTenChecklist] = useState(dataInput?.Checklist);
  const [giatridinhdanh, setGiatridinhdanh] = useState(
    dataInput?.Giatridinhdanh
  );
  const [giatrinhan, setGiatrinhan] = useState(dataInput?.Giatrinhan);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ margin: 20 }}>
          <View style={{ justifyContent: "space-around", width: "100%" }}>

             {/* Tòa nhà và khối công việc  */}
             <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text  allowFontScaling={false} style={styles.text}>Tòa nhà</Text>

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
                    handleChangeTextKhuVuc("ID_Toanha", selectedItem.ID_Toanha);
                    handleDataKhuvuc({
                      ID_Toanha: selectedItem.ID_Toanha,
                      ID_KhoiCV: dataCheckKhuvuc.ID_KhoiCV,
                    });
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
                        <Text  allowFontScaling={false} style={styles.text}>{selectedItem?.Toanha}</Text>
                      </View>
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
              </View>
              <View style={{ width: "48%" }}>
                <Text  allowFontScaling={false} style={styles.text}>Khối công việc</Text>

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
                    handleChangeTextKhuVuc("ID_KhoiCV", selectedItem.ID_Khoi);
                    handleDataKhuvuc({
                      ID_Toanha: dataCheckKhuvuc.ID_Toanha,
                      ID_KhoiCV: selectedItem.ID_Khoi,
                    });
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
                        <Text  allowFontScaling={false} style={styles.text}>{selectedItem?.KhoiCV}</Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Khoi}
                        label={item.KhoiCV}
                        key={index}
                        selectedItem={dataCheckKhuvuc.ID_KhoiCV}
                      />
                    );
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
                <Text  allowFontScaling={false} style={styles.text}>Tầng</Text>

                <SelectDropdown
                  ref={ref}
                  data={ent_tang ? ent_tang : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Tầng"}
                  buttonTextStyle={styles.customText}
                  defaultValue={defaultButtonText}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("ID_Tang", selectedItem.ID_Tang);
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
                        <Text  allowFontScaling={false} style={styles.text}>{selectedItem?.Tentang}</Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Tang}
                        label={item.Tentang}
                        key={index}
                        selectedItem={dataInput?.ID_Tang}
                      />
                    );
                  }}
                />
              </View>
              <View style={{ width: "48%" }}>
                {activeKhuVuc && (
                  <>
                    <Text  allowFontScaling={false} style={styles.text}>Khu vực</Text>

                    <SelectDropdown
                      ref={ref}
                      data={dataKhuVuc ? dataKhuVuc : []}
                      buttonStyle={styles.select}
                      dropdownStyle={{
                        borderRadius: 8,
                        maxHeight: 400,
                      }}
                      // rowStyle={{ height: 50, justifyContent: "center" }}
                      defaultButtonText={"Khu vực"}
                      buttonTextStyle={styles.customText}
                      defaultValue={defaultKhuvuc}
                      onSelect={(selectedItem, index) => {
                        handleChangeText("ID_Khuvuc", selectedItem.ID_Khuvuc);
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
                            <Text  allowFontScaling={false} style={styles.text}>
                              {selectedItem?.Tenkhuvuc}
                            </Text>
                          </View>
                        );
                      }}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <VerticalSelect
                            value={item.ID_Khuvuc}
                            label={item.Tenkhuvuc}
                            key={index}
                            selectedItem={dataInput?.ID_Khuvuc}
                          />
                        );
                      }}
                    />
                  </>
                )}
              </View>
            </View>
            
            {/* Số thứ tự - Mã số  */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text  allowFontScaling={false} style={styles.text}>Số thứ tự</Text>
                <TextInput allowFontScaling={false} 
                  value={`${sothutu}`}
                  placeholder="Số thứ tự"
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}
                  onChangeText={(val) => {
                    setSothutu(val)
                    handleChangeText("Sothutu", val)
                  }}
                  //   pointerEvents="none"
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text  allowFontScaling={false} style={styles.text}>Mã số</Text>
                <TextInput allowFontScaling={false} 
                 value={maso}
                  placeholder="Mã số"
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}
                  
                  onChangeText={(val) => {
                    setMaso(val)
                    handleChangeText("Maso", val)
                  }}
                  //   pointerEvents="none"
                />
              </View>
            </View>
            {/* Mã Qr code  */}
            <Text  allowFontScaling={false} style={styles.text}>Mã Qr code</Text>
            <TextInput allowFontScaling={false} 
              value={maQrCode}
              placeholder="Nhập Qr code"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => {handleChangeText("MaQrCode", val),setMaQrCode(val)}}
            />
            {/* Tên checklist  */}
            <Text  allowFontScaling={false} style={styles.text}>Tên Checklist</Text>
            <TextInput allowFontScaling={false} 
              value={tenChecklist}
              placeholder="Nhập tên Checklist"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => {handleChangeText("Checklist", val),setTenChecklist(val)}}
            />

            {/* Tiêu chuẩn  */}
            <Text  allowFontScaling={false} style={styles.text}>Tiêu chuẩn</Text>
            <TextInput allowFontScaling={false} 
              value={tieuchuan}
              placeholder="Nhập tiêu chuẩn"
              placeholderTextColor="gray"
              textAlignVertical="top"
              multiline={true}
              blurOnSubmit={true}
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                  height: 70,
                },
              ]}
              onChangeText={(text) => {
                setTieuchuan(text);
                handleChangeText("Tieuchuan", text);
              }}
            />
            <Text  allowFontScaling={false} style={styles.text}>Giá trị định danh</Text>
            <TextInput allowFontScaling={false} 
              value={giatridinhdanh}
              placeholder="Nhập giá trị định danh"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => {handleChangeText("Giatridinhdanh", val), setGiatridinhdanh(val)}}
            />
            <Text  allowFontScaling={false} style={styles.textNote}>
              Nếu không có thì không phải nhập
            </Text>

            <Text  allowFontScaling={false} style={styles.text}>Giá trị nhận</Text>
            <TextInput allowFontScaling={false} 
              value={giatrinhan}
              placeholder="Nhập giá trị nhận"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              autoCapitalize="sentences"
              onChangeText={(val) => {
                handleChangeText("Giatrinhan", val)
                setGiatrinhan(val)
              }}
            />
            <Text  allowFontScaling={false} style={[styles.textNote, { color: "red" }]}>
              Tại ô Giá trị nhận nhập theo định dạng - Giá trị 1/Giá trị 2...
              (Ví dụ : Sáng/Tắt, Bật/Tắt, Đạt/Không đạt, On/Off,..)
            </Text>

            {/* Ghi chú  */}
            <Text  allowFontScaling={false} style={styles.text}>Ghi chú</Text>
            <TextInput allowFontScaling={false} 
              value={ghichu}
              placeholder="Nhập ghi chú"
              placeholderTextColor="gray"
              textAlignVertical="top"
              multiline={true}
              blurOnSubmit={true}
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                  height: 70,
                },
              ]}
              onChangeText={(text) => {
                setGhichu(text);
                handleChangeText("Ghichu", text);
              }}
            />

           

            <View style={{ height: 20 }}></View>
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
                  ? () => handlePushDataEdit(isCheckUpdate.ID_CheckList)
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
