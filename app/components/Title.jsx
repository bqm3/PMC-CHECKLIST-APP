import {View, Text} from 'react-native';
import React from 'react';

const Title = ({text, top, size}) => {
  return (
    <View>
      <Text
        style={{
          color: 'black',
          fontSize: size ? size: 15,
          textAlign: 'center',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          paddingTop: top? top: '10'
        }}>
        {text ? text : ''}
      </Text>
    </View>
  );
};

export default Title;
