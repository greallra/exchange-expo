import { StyleSheet, Text, View } from 'react-native'
import { Link, router } from 'expo-router';
import React from 'react'

import { Button, Input, Text as Ktext } from '@ui-kitten/components';

const Signup = () => {
  return (
    <View style={styles.appBody}>
      <Text>Signup</Text>
      <Text>Signup</Text>
      <Text>Signup</Text>
      <Text>Signup</Text>
      <Button
        style={{margin: 2, marginTop: 50}}
        status='primary'
        class="mt-4"
        onPress={() => router.push('/login')}
      >back</Button>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  appBody: {
    padding: 10
  }
})