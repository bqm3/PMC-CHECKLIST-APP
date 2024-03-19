import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DetailChecklist = ({ route, navigation }) => {
    const { itemId, otherParam } = route.params;
    console.log('itemId',itemId)
  return (
    <View>
      <Text>DetailChecklist</Text>
    </View>
  )
}

export default DetailChecklist

const styles = StyleSheet.create({})