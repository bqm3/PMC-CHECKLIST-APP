import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS} from '../constants/theme';

const ButtonChecklist = ({text, onPress, color,marginLeft}) => {
  return (
    <TouchableOpacity
      // disabled={handleNavigation?.check}
      style={{
        width: 'auto',
        backgroundColor: color ? color : COLORS.bg_main,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 8,
        marginLeft:marginLeft ? marginLeft : 0
      }}
      onPress={onPress}>
      <Text
        style={{
          color: 'white',
          fontSize: 15,
          textAlign: 'center',
          fontWeight: 'bold',
          paddingVertical: 10 ,
          paddingHorizontal: 12
        }}>
        {text ? text : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonChecklist;
