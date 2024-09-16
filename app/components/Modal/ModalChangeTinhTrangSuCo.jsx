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
import React, { useRef, useState } from "react";
import { COLORS } from "../../constants/theme";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import ButtonSubmit from "../Button/ButtonSubmit";
import Checkbox from "expo-checkbox";
import adjust from "../../adjust";
import moment from "moment";

const ModalChangeTinhTrangSuCo = ({
  changeStatus,
  handleChangeStatus,
  handleCloseTinhTrang,
  handleSubmitStatus,
  loadingStatus,
  ngayXuLy,
  handleChangeDate,
}) => {
  
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
            minHeight: 330,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
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
            <View style={styles.section}>
              <Checkbox
                disabled
                style={styles.checkbox}
                value={changeStatus?.status1}
                onValueChange={() =>
                  handleChangeStatus("status1", !changeStatus?.status1)
                }
                color={changeStatus?.status1 ? "#4630EB" : undefined}
              />
              <Text style={styles.paragraph}>Chưa xử lý</Text>
            </View>
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={changeStatus?.status2}
                onValueChange={() =>
                  handleChangeStatus("status2", !changeStatus?.status2)
                }
                color={changeStatus?.status2 ? "#4630EB" : undefined}
              />
              <Text style={styles.paragraph}>Đang xử lý</Text>
            </View>
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={changeStatus?.status3}
                onValueChange={() =>
                  handleChangeStatus("status3", !changeStatus?.status3)
                }
                color={changeStatus?.status3 ? "#4630EB" : undefined}
              />
              <Text style={styles.paragraph}>Đã xử lý</Text>
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <Text allowFontScaling={false} style={styles.text}>
              Ngày xử lý
            </Text>
            <TouchableOpacity onPress={() => handleChangeDate("isCheck", true)}>
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
          <View style={{ flexDirection: "row", marginBottom: 10, gap: 10 }}>
            <ButtonSubmit
              text={"Đóng"}
              width={"49%"}
              backgroundColor={"grey"}
              color={"white"}
              onPress={handleCloseTinhTrang}
            />
            <ButtonSubmit
              text={"Cập nhật"}
              width={"49%"}
              backgroundColor={COLORS.bg_button}
              color={"white"}
              onPress={handleSubmitStatus}
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
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
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
});
