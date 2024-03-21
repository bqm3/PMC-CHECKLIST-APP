import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

export default function ItemHome({item, index, roleUser}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
    onPress={() => {
      navigation.navigate(item.path);
    }}
      style={[
        {
          flexGrow: 1,
          width: '40%',
          position: 'relative',
          backgroundColor:
            roleUser === 2 && item?.role === 1
              ? COLORS.bg_active
              : COLORS.bg_not_active,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        },
        index % 2 === 0
          ? {
              marginRight: 10,
            }
          : {
              marginLeft: 10,
            },
      ]}>
      <Text
        style={{
          color: COLORS.text_main,
          fontSize: 20,
          fontWeight: '600',
          padding: 12,
          textAlign: 'center'
        }}>
        {item.path}
      </Text>
    </TouchableOpacity>
  );
}
