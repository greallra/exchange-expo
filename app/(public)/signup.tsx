import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Link, router } from 'expo-router';
import React from 'react'
import { Button, Input, Text as KText, Spinner, Layout } from '@ui-kitten/components';
import { useEffect, useState } from 'react'
import Form from '@/components/forms/Form'
import useAuth from "@/hooks/useAuth";
import { getFormFields, updateFormFieldsWithDefaultData, formatPostDataUser, validateForm, esAddUser } from 'exchanges-shared'
import useLanguages from '@/hooks/useLanguages';
import { useToast } from "react-native-toast-notifications";
import { createUserWithEmailAndPassword, FIREBASE_DB, getAuth } from '@/firebase/firebaseConfig'
import styles from '@/common/styles'

const Signup = () => {
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [formFields, setFormFields] = useState(false);
  const { languages } = useLanguages();
  const { login, setLoading, loading } = useAuth();
  const toast = useToast();

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
          toast.show(validationResponse, { type: 'success', placement: "top" });
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
  
}

useEffect(() => {
  if (languages.length > 0) {
      const defaultData = {
          teachingLanguage: languages[Math.floor(0)],
          learningLanguage: languages[Math.floor(1)],
      }
      const updatedFields = updateFormFieldsWithDefaultData(getFormFields('user', 'RN'), defaultData, languages)
      // dirty fix, need to change
      let teachingLanguageField = updatedFields.find( field => field.name === 'teachingLanguage')
      let learningLanguageField = updatedFields.find( field => field.name === 'learningLanguage')
    
      teachingLanguageField.options = [...languages]
      teachingLanguageField.value.index = 0
      learningLanguageField.value.index = 1
      learningLanguageField.options = [...languages]
      
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
          /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>}
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
