import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import Header from '@/components/Header'
import { Button } from '@ui-kitten/components';
import { signOut, FIREBASE_AUTH } from '@/firebase/firebaseConfig';

const Profile = () => {
  const route = useRoute();
  console.log('route.name', route);
  const handleLogout = () => {
    FIREBASE_AUTH.signOut().then((user) => {
      console.log('signOut', user);
    })
  }

  return (
    <View>
      <Header headerTitle={route.name} headerType="other"/>
      <Button
        style={{margin: 2}}
        status='danger'
        onPress={handleLogout}
      >Logout</Button> 
   

    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})