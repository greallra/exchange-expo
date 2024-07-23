import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, Link } from 'expo-router';
import React from 'react'

const createExchange = () => {
  return (
    <View>
      <Text>createExchange</Text>
      <Link href="/profile">profile</Link>
    </View>
  )
}

export default createExchange

const styles = StyleSheet.create({})