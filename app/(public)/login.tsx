import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router';
import useAuth from "@/hooks/useAuth";
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
        <ScrollView style={styles.appBody}>
          <Ktext category='h1'>Log In</Ktext>
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
          <View style={{height: 100, marginTop: 20, marginBottom: 20}}>
            <Ktext>or</Ktext>
            <Ktext
              style={{marginTop: 20, marginBottom: 20}}
              status='primary'
              onPress={() => router.push('/signup')}
              >Sign Up
            </Ktext>
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  appBody: {
    padding: 10,
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  }
})