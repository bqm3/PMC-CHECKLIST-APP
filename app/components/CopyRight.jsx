import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

const CopyRight = () => {
  return (
    <View
    style={{
      backgroundColor: COLORS.bg_button,
      position: "absolute",
      bottom: 0,
      height: 40,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: "white",
        fontSize: 14,
        fontWeight: "700",
      }}
    >
      Copyright by @Phòng số hóa - PMC
    </Text>
  </View>
  )
}

export default CopyRight