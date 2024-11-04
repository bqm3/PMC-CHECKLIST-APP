// CustomAlertModal.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import ButtonSubmit from "./Button/ButtonSubmit";
import { COLORS } from "../constants/theme";
import adjust from "../adjust";

const CustomAlertModal = ({ isVisible, title, message, onConfirm }) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.messageContainer}>
          {typeof message === "string" ? (
            <Text style={styles.message}>{message}</Text>
          ) : (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <ButtonSubmit
            text={"Xác nhận"}
            width={adjust(120)}
            backgroundColor={COLORS.bg_button}
            color={"white"}
            onPress={onConfirm}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  messageContainer: { marginBottom: 20 },
  buttonContainer: { flexDirection: "row", justifyContent: "flex-end" },
});

export default CustomAlertModal;
