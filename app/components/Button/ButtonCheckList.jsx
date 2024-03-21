import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const ButtonChecklist = ({ text, onPress, color, marginLeft, icon }) => {
  return (
    <TouchableOpacity
      style={{
        width: 'auto',
        backgroundColor: color ? color : COLORS.bg_main,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 8,
        marginLeft: marginLeft ? marginLeft : 0
      }}
      onPress={onPress}>
      <View style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
      }}>
      {icon}
      <Text
        style={{
          color: 'white',
          fontSize: 15,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {text ? text : ''}
      </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonChecklist;
