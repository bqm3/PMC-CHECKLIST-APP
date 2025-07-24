import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Animated, Dimensions, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import adjust from "../../adjust";
import { COLORS } from "../../constants/theme";

const { width } = Dimensions.get("window");

const CustomModal = React.memo(({ visible, onClose, title, icon, children }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={onClose} />
      <Animated.View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <View style={styles.modalTitleContainer}>
            <Ionicons name={icon} size={24} color={COLORS.color_primary} />
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>
        <View style={styles.modalBody}>{children}</View>
      </Animated.View>
    </View>
  </Modal>
));

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: adjust(20),
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: adjust(24),
    width: "100%",
    maxWidth: width - adjust(40),
    maxHeight: "80%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: adjust(20),
    shadowOffset: { width: 0, height: adjust(10) },
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: adjust(24),
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: adjust(12),
  },
  modalTitle: {
    fontSize: adjust(18),
    fontWeight: "700",
    color: "#1E293B",
  },
  closeButton: {
    padding: adjust(8),
    borderRadius: adjust(12),
    backgroundColor: "#F1F5F9",
  },
  modalBody: {
    padding: adjust(24),
  },
});

export default CustomModal;
