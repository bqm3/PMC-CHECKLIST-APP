import React, { useRef, useCallback } from "react";
import {
  Modal,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import adjust from "../../adjust";

const ModalBottomSheet = React.memo(({ visible, setVisible,setOpacity, children }) => {
  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >   
    <TouchableWithoutFeedback onPress={() => {setVisible(false), setOpacity(1)}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.modalContainer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.contentContainerModal}>
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainerModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: "center",
    paddingTop: adjust(15),
    paddingBottom: adjust(50),
    elevation: 5,
  },
});

export default ModalBottomSheet;
