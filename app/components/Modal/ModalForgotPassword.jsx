import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";

const ModalForgotPassword = ({
  username,
  setUsername,
  email,
  setEmail,
  handleCloseModal,
  handleForgotPassword,
  isLoadingPW,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.modalOverlay}>
        {isLoadingPW == true && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              zIndex: 1,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.bg_button} />
          </View>
        )}
        <View
          style={[
            styles.modalContainer,
            {
              pointerEvents: isLoadingPW ? "none" : "auto",
            },
          ]}
        >
          <Text style={styles.modalTitle}>Quên mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleForgotPassword}
            >
              <Text style={styles.buttonText}>Gửi yêu cầu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCloseModal}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Hủy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ModalForgotPassword;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: adjust(20),
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: adjust(18),
    fontWeight: "bold",
    marginBottom: adjust(15),
    color: "#333",
  },
  input: {
    width: "100%",
    height: adjust(45),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: adjust(10),
    marginBottom: adjust(15),
    fontSize: adjust(14),
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: adjust(20),
    marginTop: adjust(15),
    gap: adjust(12),
  },
  button: {
    flex: 1,
    height: adjust(45),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  submitButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    fontSize: adjust(16),
    fontWeight: "600",
    color: "#ffffff",
  },
  cancelButtonText: {
    color: "#007BFF",
  },
});
