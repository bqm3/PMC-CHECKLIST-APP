import React from 'react';
import { Modal, View, ActivityIndicator, Text } from 'react-native';

const ModalLoading = ({ visible, message, color, size, onRequestClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose || (() => {})}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: 250,
            alignItems: 'center', 
          }}
        >
          <ActivityIndicator size={size || 'large'} color={color || '#0000ff'} />
          <Text style={{ marginTop: 10, textAlign: 'center' }}>{message || 'Please wait...'}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ModalLoading;
