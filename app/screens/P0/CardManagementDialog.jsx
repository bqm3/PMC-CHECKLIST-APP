import React, { useState, useEffect } from "react";
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

  const [formValues, setFormValues] = useState({
    Sotheotodk: "",
    Sothexemaydk: "",
    sltheoto: 0,
    slthexemay: 0,
    lydothaydoi: "",
  });

  // Reset form và lấy dữ liệu khi modal được mở
  useEffect(() => {
    if (open) {
      // Reset form về trạng thái ban đầu khi modal được mở
      setFormValues({
        Sotheotodk: "",
        Sothexemaydk: "",
        sltheoto: 0,
        slthexemay: 0,
        lydothaydoi: "",
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
    if (formValues.lydothaydoi.trim() === "") {
      Alert.alert("Vui lòng nhập lý do thay đổi");
      return;
    }

    setIsLoading(true);
    try {
      const dataToSubmit = {
        sltheoto: formValues.sltheoto || formValues.Sotheotodk,
        slthexemay: formValues.slthexemay || formValues.Sothexemaydk,
        lydothaydoi: formValues.lydothaydoi,
      };

      const dataOld = {
        sotheotodk: formValues.Sotheotodk,
        sothexemaydk: formValues.Sothexemaydk,
      };

      await axios.put(
        `${BASE_URL}/s0-thaydoithe/update`,
        { data: dataToSubmit, dataOld },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Reset form và cập nhật dữ liệu sau khi gửi thành công
      setFormValues({
        Sotheotodk: "",
        Sothexemaydk: "",
        sltheoto: 0,
        slthexemay: 0,
        lydothaydoi: "",
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
        Sotheotodk: res.data.data.sltheoto || 0,
        Sothexemaydk: res.data.data.slthexemay || 0,
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
              {/* Hiển thị số lượng đã bàn giao */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Số lượng thẻ đã bàn giao</Text>
              </View>

              <View style={styles.row}>
                {renderInputField("SL thẻ ô tô", formValues.Sotheotodk, null, {
                  editable: false,
                  containerStyle: styles.halfWidth,
                })}

                {renderInputField("SL thẻ xe máy", formValues.Sothexemaydk, null, {
                  editable: false,
                  containerStyle: styles.halfWidth,
                })}
              </View>

              {/* Hiển thị số lượng mới */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Số lượng thẻ cập nhật</Text>
              </View>

              <View style={styles.row}>
                {renderInputField("SL thẻ ô tô", formValues.sltheoto, (value) => handleNumberChange("sltheoto", value), {
                  keyboardType: "numeric",
                  containerStyle: styles.halfWidth,
                  returnKeyType: "done",
                  onSubmitEditing: () => {
                    // Chuyển focus sang trường xe máy khi nhấn Done
                    this.slthexemayInput && this.slthexemayInput.focus();
                  },
                })}

                {renderInputField("SL thẻ xe máy", formValues.slthexemay, (value) => handleNumberChange("slthexemay", value), {
                  keyboardType: "numeric",
                  containerStyle: styles.halfWidth,
                  returnKeyType: "done",
                  onSubmitEditing: () => {
                    // Chuyển focus sang trường lý do khi nhấn Done
                    this.lydothaidoiInput && this.lydothaidoiInput.focus();
                  },
                  inputRef: (ref) => {
                    this.slthexemayInput = ref;
                  },
                })}
              </View>

              {/* Lý do thay đổi */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Lý do thay đổi</Text>
              </View>

              {renderInputField("", formValues.lydothaydoi, (value) => handleChange("lydothaydoi", value), {
                multiline: true,
                inputStyle: styles.reasonInput,
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