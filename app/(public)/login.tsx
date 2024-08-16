import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router';
import useAuth from "@/hooks/useAuth";
import { FIREBASE_AUTH, signInWithEmailAndPassword, signOut } from '@/firebase/firebaseConfig';
import styles from '@/common/styles'
// import { setLoading } from '@/features/loading/loadingSlice'
import { useSelector, useDispatch } from 'react-redux'
import LoadingButton from "@/components/LoadingButton"

import { Button, Input, Text as Ktext, Spinner, Layout } from '@ui-kitten/components';
import { PasswordInput } from '@/components/forms/PasswordInput'

const Login = () => {
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { user, login, logout, loading, setLoading } = useAuth()
  const dispatch = useDispatch()

  useEffect(() => {
    console.log(email, password);
    
  },[email, password])


  const handleLogin = () => {
    setLoading(true)
    setError('');
    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
    .then((userCredential) => {
        console.log('userCredential', userCredential);
        // setLoading(false)
    })
    .catch((error) => {
      console.log(error);
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        // dispatch(cancelLoading())
        setError(errorMessage);
    });
}

  return (
    <SafeAreaView>
        <Layout level='4' style={styles.publicScreen}>
          <ScrollView>
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
            {!loading &&<Button 
              style={{marginTop: 20, marginBottom: 20}}
              disabled={loading} 
              onPress={handleLogin} >
              Login
            </Button>}
            {loading && <LoadingButton status="primary"/>}
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
        </Layout>
    </SafeAreaView>
  )
}

export default Login
