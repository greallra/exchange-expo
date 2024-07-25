import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Link, router } from 'expo-router';
import React from 'react'
import { Button, Input, Text as KText, Spinner } from '@ui-kitten/components';
import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { signOut, FIREBASE_AUTH } from '@/firebase/firebaseConfig';
import Form from '@/components/forms/Form'
import useAuth from "@/hooks/useAuth";
import { userFormFields } from '@/common/formFields'
import { validateForm } from '@/services/formValidation'
import { updateFormFieldsWithDefaultData, updateFormFieldsWithSavedData, formatPostDataSignup } from '@/common/formHelpers'
import useLanguages from '@/hooks/useLanguages';
import { createUserWithEmailAndPassword, FIREBASE_DB, getAuth } from '@/firebase/firebaseConfig'
import { updateDoc, getOneDoc, deleteMultipleDocs } from '@/firebase/apiCalls'
// import { db } from "@/firebaseConfig";
import {
    // collection,
    // getDocs,
    // getDoc,
    // addDoc,
    setDoc,
    // updateDoc,
    // deleteDoc,
    doc,
  } from "firebase/firestore";
import MapView from 'react-native-maps';


const Signup = () => {
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [formFields, setFormFields] = useState(false);
  const { languages } = useLanguages();
  const { login } = useAuth();

  // const dispatch = useDispatch()
  async function handleSubmit(stateOfChild) {

    // dispatch(setLoading())
    const data = formatPostDataSignup(stateOfChild)
    console.log('formatPostDataSignup', data);
    
    try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, stateOfChild.email, stateOfChild.password)
        console.log('userCredential', userCredential);
        delete data.password
        await setDoc(doc(FIREBASE_DB, "users", userCredential.user.uid), { id: userCredential.user.uid, ...data });
        // const { error: postError, docRef: usersPostRef } = await postDoc('users', data)
        // notifications.show({ color: 'green', title: 'Success', message: 'User created', })
        // const { error: getOneDocErr, docSnap } = await getOneDoc('users', usersPostRef.id)
        // login({id: userCredential.user.uid, uid: userCredential.user.uid, ...userCredential.user, ...data})
        // dispatch(cancelLoading())
      } catch (error) {
        // dispatch(cancelLoading())
        console.log(error, typeof error, error.message);
        setError(error.message)
        // notifications.show({ color: 'red', title: 'Error', message: 'Error creating user', })
      }

}
async function handleValidateForm(form) {
  // yup validation
  // console.log('form', form);
  
  const validationResponse = await validateForm('newUser', form)
  setError('');
  setFormValid(true);
  if (typeof validationResponse === 'string') {
      setError(validationResponse);
      setFormValid(false);
      return
  }
  if (typeof validationResponse !== 'object') {
      setError('wrong yup repsonse type');
      setFormValid(false);
      return console.log('wrong yup repsonse type')
  }

  // success so make post api call possible
  setError('');
  setFormValid(true);
}

useEffect(() => {
  if (languages.length > 0) {
      const defaultData = {
          // teachingLanguage: languages[Math.floor(Math.random() * languages.length)],
          // learningLanguage: languages[Math.floor(Math.random() * languages.length)],
      }
      const updatedFields = updateFormFieldsWithDefaultData(userFormFields, defaultData, languages)
      
      setFormFields(updatedFields);
      setBusy(false)
  }
  
}, [languages])


  return (
    <ScrollView style={styles.appBody}>
      <View>
        <KText>Sign Up</KText>
        {!busy ? <Form 
            fields={formFields} 
            onSubmit={(stateOfChild) => handleSubmit(stateOfChild)} 
            validateForm={handleValidateForm} 
            error={error} 
            formValid={formValid}
        /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>}
        {error &&  <KText
            status='danger'
          >{error}</KText>}

    </View>
      <Button
        style={{margin: 2, marginTop: 50}}
        status='primary'
        class="mt-4"
        onPress={() => router.push('/login')}
      >back</Button>
    </ScrollView>
  )
}

export default Signup

const styles = StyleSheet.create({
  appBody: {
    padding: 10
  }
})
