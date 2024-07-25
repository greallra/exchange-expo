import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import Header from '@/components/Header'
import { Button, Spinner, Text as KText } from '@ui-kitten/components';
import { signOut, FIREBASE_AUTH } from '@/firebase/firebaseConfig';
import Form from '@/components/forms/Form'

import { useGlobalContext } from "@/context/GlobalProvider";

// import { useSelector, useDispatch } from 'react-redux'
// import { setLoading, cancelLoading } from '@/features/loading/loadingSlice'
import { userFormFields } from '@/common/formFields'
import { validateForm } from '@/services/formValidation'
import { updateFormFieldsWithDefaultData, updateFormFieldsWithSavedData, formatPostDataSignup } from '@/common/formHelpers'
import Toast from 'react-native-toast-message';
import { useToast } from "react-native-toast-notifications";
// import { useDisclosure } from '@mantine/hooks';
// import { Modal, Button, Alert } from '@mantine/core';
// import { IconInfoCircle } from '@tabler/icons-react';
import useLanguages from '@/hooks/useLanguages';
import { updateOneDoc, getOneDoc, deleteMultipleDocs } from '@/firebase/apiCalls'


const Profile = () => {
  const { user } = useGlobalContext();
  const route = useRoute();
  const [error, setError] = useState('');
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [fields, setFields] = useState(userFormFields);
  const [busy, setBusy] = useState(true);
  const { languages } = useLanguages();

  const toast = useToast();

  console.log('route.name', route);
  const handleLogout = () => {
    FIREBASE_AUTH.signOut().then((user) => {
      console.log('signOut', user);
    })
  }


  async function handleSubmit(stateOfForm) {
    console.log(stateOfForm);
    // if (!acceptedWarning) {
    //   return openWarningModal()
    // }
    try {
        // dispatch(setLoading())
        await deleteMultipleDocs ('exchanges', 'organizerId', user.id)
        const { error: updateError, response } = await updateOneDoc('users', user.id, formatPostDataSignup(stateOfForm))
        const { error: getOneDocErr, docSnap } = await getOneDoc('users', user.id)
        // login({...docSnap.data(), id: docSnap.id})
        // dispatch(cancelLoading())
        toast.show("Profile updated!", { type: 'success', placement: "top" });
        console.log('response, response');
      } catch (error) {
        console.log(123, error);
        // dispatch(cancelLoading())
        toast.show("Profile updated!");
      }
  }
  // function openWarningModal(params:type) {
  //   return open()
  // }

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
        console.log('defaultData', defaultData);
        
        let updatedFields = updateFormFieldsWithDefaultData(fields, {...dataUpdatedWithSaved, ...defaultData}, languages)
        updatedFields = updatedFields.filter( field => !['password', 'email'].includes(field.property) )
        console.log('updatedFields', updatedFields);
        setFields(updatedFields);
        setBusy(false)
    }
    
  }, [languages])

  return (
    <ScrollView>
      <Header headerTitle={route.name} headerType="other"/>
      <View style={{backgroundColor: 'pink'}}>
              {!busy ? 
                <Form 
                    fields={fields}
                    user={user} 
                    onSubmit={(stateOfChild) => handleSubmit(stateOfChild)} 
                    validateForm={handleValidateForm} 
                    error={error} 
                    formValid={formValid}
                /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>
              }
              {error && <KText
                status='danger'
              >{error}</KText>}

      </View>

      <Button
        style={{margin: 2}}
        status='danger'
        onPress={handleLogout}
      >Logout</Button> 

    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({})