// CustomAlertModal.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const CustomAlertModal = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  showCancelButton,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          {showCancelButton && ( 
            <Button title="Hủy" onPress={onCancel} color="gray" />
          )}
          <Button title="Xác nhận" onPress={onConfirm} color="blue" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 16, marginBottom: 20 },
  buttonContainer: { flexDirection: "row", justifyContent: "flex-end" },
});

export default CustomAlertModal;
