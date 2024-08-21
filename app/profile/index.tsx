import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { useRoute } from '@react-navigation/native';
import Header from '@/features/header/Header'
import { Button, Spinner, Text as KText, Layout, Modal, Card } from '@ui-kitten/components';

import { getFormFields, formatPostDataUser, validateForm, updateFormFieldsWithDefaultData, updateFormFieldsWithSavedData,
  esUpdateDoc, esGetDoc, esDeleteDocs, checkForLanguageChange, esSetDoc, formatUserData } from 'exchanges-shared'
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebase/firebaseConfig';
import Form from '@/components/forms/Form'

import { useGlobalContext } from "@/context/GlobalProvider";

import { useFocusEffect } from '@react-navigation/native';
import { setActivePage } from '@/features/header/headerSlice'
import { useToast } from "react-native-toast-notifications";
import useLanguages from '@/hooks/useLanguages';
import useAuth from "@/hooks/useAuth";



const Profile = () => {
  const { user } = useGlobalContext();
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(getFormFields('user', 'RN'));
  const [busy, setBusy] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [languageChangeDocsDeleted, setLanguageChangeDocsDeleted] = useState(false);
  const { languages } = useLanguages();
  const toast = useToast();

  const dispatch = useDispatch()
  useFocusEffect(
    useCallback(() => { dispatch(setActivePage({ activePage: 'My Profile', leftside: 'arrow'})) }, [])
  );

  const handleLogout = () => {
    FIREBASE_AUTH.signOut().then((user) => {
      router.push('/')
      console.log('signOut', user);
    })
  }

  async function deleteDocsThenSubmit (stateOfForm) {
    setLoading(true)
    await esDeleteDocs (FIREBASE_DB, 'exchanges', 'organizerId', user.id)
    setLanguageChangeDocsDeleted(true);
    setTimeout(() => {
      handleSubmit(stateOfForm) 
      setModalVisible(false)
    }, 5000);
  
  }

  async function handleSubmit(stateOfForm) {
    console.log(stateOfForm);
    setLoading(true)
    setError('')
    try {
        const isLanguageChange = checkForLanguageChange(stateOfForm, user)
        if(isLanguageChange && !languageChangeDocsDeleted){
          setLoading(false)
          return setModalVisible(true)
        }
        const formFormatted = formatPostDataUser(stateOfForm)
        const validationResponse = await validateForm('editUser', formFormatted)
        console.log('formFormatted', formFormatted);
        console.log('validationResponse', validationResponse);
        
        if (typeof validationResponse === 'string') {
          toast.show('Erors in form', { type: 'error', placement: "top" });
          setLoading(false)
          setError(validationResponse);
          setFormValid(false);
          return
        }
        delete stateOfForm.password
        const { error: updateError, response } = await esSetDoc(FIREBASE_DB, 'users', user.id, formatPostDataUser({...stateOfForm, id: user.id}))
        const { error: getOneDocErr, docSnap } = await esGetDoc(FIREBASE_DB, 'users', user.id)
        if (updateError) {throw(updateError) }
        if (getOneDocErr) {throw(getOneDocErr) }

        const combinedAuthAndCollection = {...user, ...docSnap.data()}     
        console.log('docSnap', docSnap.data());
        console.log('user', user);
        console.log('combinedAuthAndCollection', formatUserData(combinedAuthAndCollection, languages));
        setUser(formatUserData(combinedAuthAndCollection, languages))
        router.push('/exchanges')
        setLoading(false)
        toast.show("Profile updated!", { type: 'success', placement: "top" });
      } catch (error) {
        console.log('error', error);
        // dispatch(cancelLoading())
        setLoading(false)
        toast.show("catch err");
      }
  }

  async function handleValidateForm(form) { 

  }

  useEffect(() => {
    if (languages.length > 0) {
        // saved data
        const dataUpdatedWithSaved = updateFormFieldsWithSavedData(fields, user)
        
        // not really default data, its based on user data, maaybe change in future
        const defaultData = {
            teachingLanguage: languages.map( (lang,i) => ({...lang, index: i }) ).find( lang => lang.id === user.teachingLanguageId),
            learningLanguage: languages.map( (lang,i) => ({...lang, index: i }) ).find( lang => lang.id === user.learningLanguageId),
        }
        
        let updatedFields = updateFormFieldsWithDefaultData(fields, {...dataUpdatedWithSaved, ...defaultData}, languages)
        console.log('updatedFields', languages);
        // dirty fix, need to change
        let teachingLanguageField = updatedFields.find( field => field.name === 'teachingLanguage')
        let learningLanguageField = updatedFields.find( field => field.name === 'learningLanguage')
      
        teachingLanguageField.options = languages.map((lang,i) => ({...lang, index: i}))
        learningLanguageField.options = languages.map((lang,i) => ({...lang, index: i}))
        
        updatedFields = updatedFields.map( field => !['password', 'email'].includes(field.property) ? field : {...field, hideField: true} )
        setFields(updatedFields);
        setBusy(false)
    }
    
  }, [languages])

  return (
    <Layout level='4'>
      <ScrollView style={{width: '100%', height: '100%'}}>
        <Header />
        {!busy ? 
          <Form 
              fields={fields}
              user={user} 
              onSubmit={(stateOfChild) => handleSubmit(stateOfChild)} 
              validateForm={handleValidateForm} 
              error={error} 
              formValid={formValid}
              modalAction={deleteDocsThenSubmit}
              isLoading={loading}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              error={error}
          /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>
        }
        <Button
          style={{margin: 2}}
          status='danger'
          onPress={handleLogout}
        >Logout</Button> 
      </ScrollView>
    </Layout>
  )
}

export default Profile

const styles = StyleSheet.create({
  modalWrapper: {
    height: '100%',
    padding: 50,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})