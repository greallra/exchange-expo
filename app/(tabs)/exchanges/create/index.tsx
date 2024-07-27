import { router } from "expo-router";
import { useEffect, useState, useContext, useCallback } from "react";
import useLanguages from '@/hooks/useLanguages';
// import { useSelector, useDispatch } from 'react-redux'
// import { setLoading, cancelLoading } from '@/features/loading/loadingSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setActivePage } from '@/features/header/headerSlice'

import { useFocusEffect } from '@react-navigation/native';
import { exchangeFormFields } from '@/common/formFields'
import { formatPostDataExchange, updateFormFieldsWithDefaultData } from '@/common/formHelpers'
import { postDoc } from '@/firebase/apiCalls'
import { validateForm } from '@/services/formValidation'
import { useGlobalContext } from "@/context/GlobalProvider";
import Form from '@/components/forms/Form'
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Text as KText, Spinner } from '@ui-kitten/components';

export default function CreateExchange (props) {
  // const navigate = useNavigate();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [fields, setFields] = useState([...exchangeFormFields])
  const { user } = useGlobalContext();
  const { languages } = useLanguages();

  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      dispatch(setActivePage({ activePage: 'Create an Exchange', leftside: 'arrow'}))
      setFields([...exchangeFormFields])
    }, [])
  );
  
  async function handleSubmit(stateOfChild: object) {
    try {
        // dispatch(setLoading())
        // e.preventDefault()
        console.log('stateOfChild', stateOfChild);
        console.log('user', user);
        
        const data = formatPostDataExchange({...stateOfChild, organizerId: user.id, participantIds: [user.id] })
        console.log(data);
        const colRef = await postDoc('exchanges', data)
        // dispatch(cancelLoading())
        console.log('colRef', colRef);
        // notifications.show({ color: 'green', title: 'Success', message: 'Exchange created', })
        router.push('/exchanges')
      } catch (error) {
        // dispatch(cancelLoading())
        console.log(error);
        // notifications.show({ color: 'red', title: 'Error', message: 'Error creating Exchange', })
      }
  }
    async function handleValidateForm(form) { 
      // yup validation
      const validationResponse = await validateForm('newExchange', form)
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
    

    return (<ScrollView>
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
              
         </ScrollView>)
}

