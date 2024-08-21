import { router } from "expo-router";
import { useEffect, useState, useContext, useCallback } from "react";
import useLanguages from '@/hooks/useLanguages';
// import { useSelector, useDispatch } from 'react-redux'
// import { setLoading, cancelLoading } from '@/features/loading/loadingSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setActivePage } from '@/features/header/headerSlice'

import { useFocusEffect } from '@react-navigation/native';
import { postDoc } from '@/firebase/apiCalls'
import { useGlobalContext } from "@/context/GlobalProvider";
import Form from '@/components/forms/Form'
import { Text, View, StyleSheet, ScrollView, } from "react-native";
import { Text as KText, Spinner, Layout } from '@ui-kitten/components';
import { useToast } from "react-native-toast-notifications";

import { formatPostDataExchange, validateForm, esAddDoc, updateFormFieldsWithDefaultData, getFormFields } from 'exchanges-shared'
import { FIREBASE_DB } from "@/firebase/firebaseConfig";

export default function CreateExchange (props) {
  const [isLoading, setIsLoading] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [fields, setFields] = useState(getFormFields('exchange', 'RN'))
  const { user } = useGlobalContext();
  const { languages } = useLanguages();
  const toast = useToast();

  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      
      dispatch(setActivePage({ activePage: 'Create an Exchange', leftside: 'arrow'}))
      setFields(getFormFields('exchange', 'RN'))
      toast.show("focus", { type: 'success', placement: "top" });
      // console.log('exchangeFormFields', JSON.stringify(exchangeFormFields, null, 2))
    }, [])
  );
  
  async function handleSubmit(stateOfChild: object) {
    try {
        setError('');
        setIsLoading(true)
        const constructForm = {...stateOfChild, organizerId: user.id || user.uid, participantIds: [user.id || user.uid] }
        const formFormatted = formatPostDataExchange(constructForm)
        const validationResponse = await validateForm('newExchange', formFormatted)
        console.log('validationResponse', validationResponse);
        if (typeof validationResponse === 'string') {
          toast.show('Erors in form', { type: 'error', placement: "top" });
          setIsLoading(false)
          setError(validationResponse);
          setFormValid(false);
          return
        }
        const colRef = await esAddDoc(FIREBASE_DB, 'exchanges', validationResponse)
        toast.show("Exchange created!", { type: 'success', placement: "top" });
        setIsLoading(false)
        router.push('/exchanges')
      } catch (error) {
        console.log(error);
        toast.show('Error', { type: 'error', placement: "top" });
      }
  }
    async function handleValidateForm(form) { 

    }

    useEffect(() => {
    
      
    }, [])

    useEffect(() => {
      if (languages.length > 0) {
          // not really default data, its based on user data, maaybe change in future
          const defaultData = {
              teachingLanguage: languages.find( lang => lang.id === user.teachingLanguageId),
              learningLanguage: languages.find( lang => lang.id === user.learningLanguageId),
          }
          const updatedFields = updateFormFieldsWithDefaultData(fields, defaultData)
          setFields(updatedFields);
          setBusy(false)
      } 
      
    }, [languages])
    

    return (
    <Layout level="4">
      <ScrollView style={{ height: '100%' }} keyboardShouldPersistTaps="always">
        {!busy ? 
          <Form 
              fields={fields}
              user={user} 
              onSubmit={(stateOfChild) => handleSubmit(stateOfChild)} 
              validateForm={handleValidateForm} 
              error={error} 
              isLoading={isLoading}
              formValid={formValid}
          /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>
        }
    </ScrollView>
  </Layout>)
}

