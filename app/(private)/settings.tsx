import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@ui-kitten/components';
import { signOut, FIREBASE_AUTH } from '@/firebase/firebaseConfig';
import React from 'react'

const settings = () => {

  const handleLogout = () => {
    FIREBASE_AUTH.signOut().then((user) => {
      console.log('signOut', user);
    })
  }

  return (
    <View>
      <Text>settings</Text>
      <Button
        style={{margin: 2}}
        status='danger'
        onPress={handleLogout}
      >Logout</Button>
    </View>
  )
}

export default settings

const styles = StyleSheet.create({})