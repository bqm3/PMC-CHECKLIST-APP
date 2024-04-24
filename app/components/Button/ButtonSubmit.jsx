import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS} from '../../constants/theme';

const ButtonSubmit = ({text, onPress, isLoading,backgroundColor, color, width,pV}) => {
  return (
    <TouchableOpacity
    disabled={isLoading}
      style={{
        width: width ? width: '100%',
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 8,
      }}
      onPress={onPress}>
      {isLoading  && (
        <ActivityIndicator
          style={{
            // marginRight: 4,
          }}
          size="small"
          color={COLORS.bg_white}
        />
      )}

      <Text  allowFontScaling={false} 
        style={{
          color: color ? color : 'white',
          fontSize: 15,
          textAlign: 'center',
          fontWeight: 'bold',
          paddingVertical: pV ? pV : 16 ,
          paddingHorizontal: 4
        }}>
        {text ? text : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonSubmit;
