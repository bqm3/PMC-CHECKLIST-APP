import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../constants/config";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";

const CardManagementDialog = ({ open, onClose }) => {
  const { user, authToken } = useSelector((state) => state.authReducer);
  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng useRef thay vì this
  const coiInputRef = useRef(null);
  const gayGiaoThongInputRef = useRef(null);
  const aoMuaInputRef = useRef(null);
  const denPinInputRef = useRef(null);
  const lydoQTTRef = useRef(null);

  const [formValues, setFormValues] = useState({
    coi: 0,
    gay_giao_thong: 0,
    ao_mua: 0,
    den_pin: 0,
    lydoQTT: "",
  });

  // Reset form và lấy dữ liệu khi modal được mở
  useEffect(() => {
    if (open) {
      // Reset form về trạng thái ban đầu khi modal được mở
      setFormValues({
        coi: 0,
        gay_giao_thong: 0,
        ao_mua: 0,
        den_pin: 0,
        lydoQTT: "",
      });
      getSoThe(); // Lấy dữ liệu ban đầu từ server
    }
  }, [open]); // Chạy lại khi open thay đổi

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleNumberChange = (name, value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      setFormValues({
        ...formValues,
        [name]: value === "" ? 0 : parseInt(value, 10),
      });
    }
  };

  const handleSubmit = async () => {
    if (formValues.lydoQTT.trim() === "") {
      Alert.alert("Vui lòng nhập lý do thay đổi");
      return;
    }

    setIsLoading(true);
    try {
      const dataToSubmit = {
        coi: formValues.coi,
        gay_giao_thong: formValues.gay_giao_thong,
        ao_mua: formValues.ao_mua,
        den_pin: formValues.den_pin,
        lydoQTT: formValues.lydoQTT,
      };

      await axios.put(
        `${BASE_URL}/s0-thaydoithe/quan-tu-trang`,
        { data: dataToSubmit },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Reset form và cập nhật dữ liệu sau khi gửi thành công
      setFormValues({
        coi: 0,
        gay_giao_thong: 0,
        ao_mua: 0,
        den_pin: 0,
        lydoQTT: "",
      });
      await getSoThe();

      Alert.alert("Thành công", "Cập nhật số lượng thẻ thành công!");
      onClose();
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSoThe = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/s0-thaydoithe/${user?.ID_Duan}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      setFormValues((prevValues) => ({
        ...prevValues,
        coi: res.data.data.coi || 0,
        gay_giao_thong: res.data.data.gay_giao_thong || 0,
        ao_mua: res.data.data.ao_mua || 0,
        den_pin: res.data.data.den_pin || 0,
        lydoQTT: "", // Luôn reset về rỗng
      }));
    } catch (error) {
      Alert.alert("Đã có lỗi xảy ra. Vui lòng thử lại", false);
    }
  };

  const renderInputField = (label, value, onChangeText, options = {}) => (
    <View style={[styles.inputContainer, options.containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, options.multiline && styles.textArea, options.editable === false && styles.readOnlyInput, options.inputStyle]}
        value={String(value)}
        onChangeText={onChangeText}
        keyboardType={options.keyboardType || "default"}
        multiline={options.multiline || false}
        editable={options.editable !== false}
        placeholderTextColor="#999"
        returnKeyType={options.returnKeyType || "done"}
        blurOnSubmit={options.blurOnSubmit !== false}
        onSubmitEditing={options.onSubmitEditing}
        ref={options.inputRef}
      />
    </View>
  );

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Thay đổi số lượng thẻ xe</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Hiển thị số lượng thẻ hiện tại */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Cập nhật số lượng thẻ</Text>
              </View>

              <View style={styles.row}>
                {renderInputField(`Còi (${formValues.coi || 0})`, formValues.coi, (value) => handleNumberChange("coi", value), {
                  keyboardType: "numeric",
                  containerStyle: styles.halfWidth,
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    gayGiaoThongInputRef.current?.focus();
                  },
                  inputRef: coiInputRef,
                })}

                {renderInputField(`Gậy giao thông (${formValues.gay_giao_thong || 0})`, formValues.gay_giao_thong, (value) => handleNumberChange("gay_giao_thong", value), {
                  keyboardType: "numeric",
                  containerStyle: styles.halfWidth,
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    aoMuaInputRef.current?.focus();
                  },
                  inputRef: gayGiaoThongInputRef,
                })}
              </View>

              <View style={styles.row}>
                {renderInputField(`Áo mưa (${formValues.ao_mua || 0})`, formValues.ao_mua, (value) => handleNumberChange("ao_mua", value), {
                  keyboardType: "numeric",
                  containerStyle: styles.halfWidth,
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    denPinInputRef.current?.focus();
                  },
                  inputRef: aoMuaInputRef,
                })}

                {renderInputField(`Đèn pin (${formValues.den_pin || 0})`, formValues.den_pin, (value) => handleNumberChange("den_pin", value), {
                  keyboardType: "numeric",
                  containerStyle: styles.halfWidth,
                  returnKeyType: "next",
                  onSubmitEditing: () => {
                    lydoQTTRef.current?.focus();
                  },
                  inputRef: denPinInputRef,
                })}
              </View>

              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Lý do thay đổi</Text>
              </View>

              {renderInputField("", formValues.lydoQTT, (value) => handleChange("lydoQTT", value), {
                multiline: true,
                inputStyle: styles.reasonInput,
                inputRef: lydoQTTRef,
                returnKeyType: "done",
              })}
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleSubmit}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.bg_button} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    backgroundColor: "#21409A",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    padding: 16,
    maxHeight: 400,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#21409A",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 14,
  },
  readOnlyInput: {
    backgroundColor: "#eee",
    color: "#666",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  reasonInput: {
    height: 100,
    textAlignVertical: "top",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#21409A",
  },
  disabledButton: {
    backgroundColor: "#8899c5",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  flex: {
    flex: 1,
  },
});

export default CardManagementDialog;