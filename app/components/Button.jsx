import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, SIZES} from '../constants/theme';

const Button = ({onPress, text}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.bg_main,
        padding: SIZES.padding,
        borderRadius: SIZES.borderRadius,
      }}
      onPress={onPress}>
      <Text
        style={{
          color: 'white',
          fontSize: 15,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {text ? text : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
