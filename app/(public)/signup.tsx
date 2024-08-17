import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Link, router } from 'expo-router';
import React from 'react'
import { Button, Input, Text as KText, Spinner, Layout } from '@ui-kitten/components';
import { useEffect, useState } from 'react'
import Form from '@/components/forms/Form'
import useAuth from "@/hooks/useAuth";
import { userFormFieldsRN, updateFormFieldsWithDefaultData, formatPostDataUser, validateForm, esAddUser } from 'exchanges-shared'
import useLanguages from '@/hooks/useLanguages';
import { createUserWithEmailAndPassword, FIREBASE_DB, getAuth } from '@/firebase/firebaseConfig'
import styles from '@/common/styles'

const Signup = () => {
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [formFields, setFormFields] = useState(false);
  const { languages } = useLanguages();
  const { login, setLoading, loading } = useAuth();

  // const dispatch = useDispatch()
  async function handleSubmit(stateOfChild) {
    setLoading(true)
    setError('');
    try {
        const formattedData = formatPostDataUser(stateOfChild)
        const validationResponse = await validateForm('newUser', formattedData)

        if (typeof validationResponse === 'string') {
          setLoading(false)
          setError(validationResponse);
          setFormValid(false);
          return
        }
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, stateOfChild.email, stateOfChild.password)
        delete formattedData.password
        await esAddUser (FIREBASE_DB, userCredential, 'users', formattedData)
        setLoading(false)
      } catch (error) {
        // dispatch(cancelLoading())
        setLoading(false)
        console.log(error, typeof error, error.message);
        setError(error.message)
      }
}

async function handleValidateForm(form) {
  // const validationResponse = await validateForm('newUser', form)
  // setError('');
  // setFormValid(true);
  // if (typeof validationResponse === 'string') {
  //     setError(validationResponse);
  //     setFormValid(false);
  //     return
  // }
  // if (typeof validationResponse !== 'object') {
  //     setError('wrong yup repsonse type');
  //     setFormValid(false);
  //     return console.log('wrong yup repsonse type')
  // }

  // // success so make post api call possible
  // setError('');
  // setFormValid(true);
}

useEffect(() => {
  if (languages.length > 0) {
      const defaultData = {
          // teachingLanguage: languages[Math.floor(Math.random() * languages.length)],
          // learningLanguage: languages[Math.floor(Math.random() * languages.length)],
      }
      const updatedFields = updateFormFieldsWithDefaultData(userFormFieldsRN, defaultData, languages)
      
      setFormFields(updatedFields);
      setBusy(false)
  }
  
}, [languages])


  return (
    <Layout level="4">
      <ScrollView style={styles.publicScreen}>
          <KText category='h6'>Sign Up</KText>
          {!busy ? <Form 
              fields={formFields} 
              onSubmit={(stateOfChild) => handleSubmit(stateOfChild)} 
              validateForm={handleValidateForm} 
              error={error} 
              formValid={formValid}
              isLoading={loading}
              overrideInlineValidationTemporaryProp={true}
          /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>}
          {error &&  <KText
              status='danger'
            >{error}</KText>}
            
          <KText
            appearance='hint'
            style={{ margin: 2, marginTop: 10, textAlign: 'center'}}
          >or</KText>
          <KText
            style={{height: 100, margin: 2, marginTop: 10, textAlign: 'center'}}
            status='primary'
            onPress={() => router.push('/login')}
          >Login</KText>
      </ScrollView>
    </Layout>
  )
}

export default Signup

// const styles = StyleSheet.create({
 
// })
