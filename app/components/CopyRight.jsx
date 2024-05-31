import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
import adjust from '../adjust'

const CopyRight = () => {
  return (
    <View
    style={{
      backgroundColor: COLORS.bg_button,
      position: "absolute",
      bottom: 0,
      height: adjust(40),
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text allowFontScaling={false}   
      style={{
        color: "white",
        fontSize: adjust(14),
        fontWeight: "700",
      }}
    >
      Copyright by @Phòng số hóa - PMC
    </Text>
  </View>
  )
}

export default CopyRight