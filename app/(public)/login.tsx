import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router';
import useAuth from "@/hooks/useAuth";
import tw from 'twrnc';
import { FIREBASE_AUTH, signInWithEmailAndPassword, signOut } from '@/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button, Input, Text as Ktext } from '@ui-kitten/components';
import { PasswordInput } from '@/components/forms/PasswordInput'

const Login = () => {
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { user, login, logout } = useAuth()

  useEffect(() => {
    console.log(email, password);
    
  },[email, password])

  async function myLog() {
    try {
      const value = await AsyncStorage.getItem('firebase:authUser:AIzaSyAkTPwKPtm-6RtWu_PR3LHAuuSx2ISK8bQ:[DEFAULT]');
      if (value !== null) {
        console.log('myLog', value);
        
      }
    } catch (e) {
      console.log('myLog e', e);
      // error reading value
    }
  }

  const handleLogin = () => {
    // login({ email, password })
    // dispatch(setLoading())
    setError('');
    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
    .then((userCredential) => {
      console.log('userCredential', userCredential);
      
        // Signed in - Listener in Auth Hook will handle setting user and navigate to app
        // dispatch(cancelLoading())  
    })
    .catch((error) => {
      console.log(error);
      
        const errorCode = error.code;
        const errorMessage = error.message;
        // dispatch(cancelLoading())
        setError(errorMessage);
    });
}

  return (
    <SafeAreaView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          // style={{
          //   minHeight: Dimensions.get("window").height - 100,
          // }}
        >
        <Input
          placeholder='Write your email'
          label='Email'
          value={email}
          onChangeText={nextValue => setEmail(nextValue)}
        />
        <PasswordInput value={password} setValue={nextValue => setPassword(nextValue)}/>
        {error && <Ktext
          style={styles.text}
          status='danger'
        >{error}</Ktext>}
        <Button
          style={{marginTop: 20, marginBottom: 20}}
          status='danger'
          class="mt-4"
          onPress={handleLogin}
        >Login</Button>
        <View className="flex justify-start">
          <Ktext>or</Ktext>
          <Button
            style={{marginTop: 20, marginBottom: 20}}
            status='danger'
            class="mt-4"
            onPress={() => router.push('/signup')}
          >Sign Up</Button>
          <View className="">
            <Button
              style={{margin: 2, marginTop: 50}}
              status='primary'
              class="mt-4"
              onPress={myLog}
            >myLog</Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})