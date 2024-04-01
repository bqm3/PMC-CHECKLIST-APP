import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, SIZES} from '../../constants/theme';

const Button = ({onPress, text, backgroundColor, color, border, width}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: backgroundColor ? backgroundColor : 'white',
        padding: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        borderColor: border ? border : COLORS.bg_button,
        borderWidth: 1,
        width: width || 'auto'
      }}
      onPress={onPress}>
      <Text 
        style={{
          color: color,
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
