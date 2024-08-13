import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { useRoute } from '@react-navigation/native';
import Header from '@/features/header/Header'
import { Button, Spinner, Text as KText, Layout, Modal, Card } from '@ui-kitten/components';
import { signOut, FIREBASE_AUTH } from '@/firebase/firebaseConfig';
import Form from '@/components/forms/Form'
import { formatUserData } from '@/common/utils'

import { useGlobalContext } from "@/context/GlobalProvider";

import { useFocusEffect } from '@react-navigation/native';
import { setActivePage } from '@/features/header/headerSlice'
import { userFormFields } from '@/common/formFields'
import { validateForm } from '@/services/formValidation'
import { updateFormFieldsWithDefaultData, updateFormFieldsWithSavedData, formatPostDataSignup } from '@/common/formHelpers'
import { useToast } from "react-native-toast-notifications";
import useLanguages from '@/hooks/useLanguages';
import useAuth from "@/hooks/useAuth";
import { setOneDoc, getOneDoc, deleteMultipleDocs } from '@/firebase/apiCalls'


const Profile = () => {
  const { user } = useGlobalContext();
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(userFormFields);
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
    await deleteMultipleDocs ('exchanges', 'organizerId', user.id)
    setLanguageChangeDocsDeleted(true);
    setTimeout(() => {
      handleSubmit(stateOfForm) 
      setModalVisible(false)
    }, 5000);
  
  }


  function checkForLanguageChange(stateOfForm: Object): Boolean{
    if (user.teachingLanguageId === stateOfForm.teachingLanguage.id && user.learningLanguageId === stateOfForm.learningLanguage.id) {
      return false
    } else {
      return true
    }
  }

  async function handleSubmit(stateOfForm) {
    console.log(stateOfForm);
    setLoading(true)
    try {
        const isLanguageChange = checkForLanguageChange(stateOfForm)
        if(isLanguageChange && !languageChangeDocsDeleted){
          setLoading(false)
          return setModalVisible(true)
        }
        delete stateOfForm.password
        const { error: updateError, response } = await setOneDoc('users', user.id, formatPostDataSignup({...stateOfForm, id: user.id}))
        const { error: getOneDocErr, docSnap } = await getOneDoc('users', user.id)
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
        toast.show("Profile updated!");
      }
  }

  async function handleValidateForm(form) { 
    // yup validation
    const validationResponse = await validateForm('editUser', form)
    console.log(validationResponse);
    setError('');
    setFormValid(true);
    if (typeof validationResponse === 'string') {
        setError(validationResponse);
        setFormValid(false);
        return
    }
    if (typeof validationResponse !== 'object') { setError('wrong yup repsonse type'); setFormValid(false); return alert('wrong yup repsonse type')}
    // success so make post api call possible
    setError('');
    setFormValid(true);
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
          /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>
        }
        {error && <KText
          status='danger'
        >{error}</KText>}
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