import { Text, View, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams, Link  } from "expo-router";
import { useEffect, useState, useContext, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import useLanguages from '@/hooks/useLanguages';
import { setActivePage } from '@/features/header/headerSlice'
import { useSelector, useDispatch } from 'react-redux'
import { exchangeFormFields } from '@/common/formFields'
import { updateFormFieldsWithDefaultData, updateFormFieldsWithSavedData, formatPostDataExchange, getIndexOfAvailableValues } from '@/common/formHelpers'
import { updateOneDoc, getOneDoc } from '@/firebase/apiCalls'
import { validateForm } from '@/services/formValidation'
import { useGlobalContext } from "@/context/GlobalProvider";
import Form from '@/components/forms/Form'
import { useToast } from "react-native-toast-notifications";

import { Text as KText, Spinner, IndexPath } from '@ui-kitten/components';

export default function EditExchange() {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [savedData, setSavedData] = useState({});
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [fields, setFields] = useState(exchangeFormFields)
  const { user } = useGlobalContext();
  const { languages } = useLanguages();

  // const dispatch = useDispatch()
  const { id } = useLocalSearchParams();
  const toast = useToast();

  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => { dispatch(setActivePage({ activePage: `Edit ${savedData.name ? savedData.name: 'Exchange'}`, leftside: 'arrow'})) }, [savedData])
  );

  async function handleSubmit(stateOfChild: object) {
    try {
        // dispatch(setLoading())
        setIsLoading(true)
        const data = formatPostDataExchange({...stateOfChild, organizerId: user.id, participantIds: [user.id] })
        console.log(data);
        const colRef = await updateOneDoc('exchanges', id, data)
        // dispatch(cancelLoading())
        console.log('colRef', colRef);
        toast.show("Exchange updated!", { type: 'success', placement: "top" });
        setIsLoading(false)
        router.push('/exchanges')
      } catch (error) {
        setIsLoading(false)
        console.log(error);
        toast.show("Error updating exchange!" + " " + error.message, { type: 'error', placement: "top" });
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

  function fetchData() {
      if (languages.length > 0) {
        // saved data
        getOneDoc("exchanges", id)
        .then(({docSnap}) => {
          try {
            console.log(docSnap);
            const mergeData = {...docSnap.data(), id: docSnap.id}
            setSavedData(mergeData)
            // delete mergeData.time
            mergeData.time = new Date(mergeData.time.seconds * 1000)
            
            mergeData.capacity = {
              selectedValue : new IndexPath(getIndexOfAvailableValues(fields, 'capacity', mergeData.capacity)),
              value: Number(mergeData.capacity)
            }
            mergeData.duration = {
              selectedValue : new IndexPath(getIndexOfAvailableValues(fields, 'duration', mergeData.duration)),
              value: Number(mergeData.duration)
            }
            const dataUpdatedWithSaved = updateFormFieldsWithSavedData(fields, mergeData)
            // not really default data, its based on user data, maaybe change in future
            const defaultData = {
                teachingLanguage: languages.find( lang => lang.id === user.teachingLanguageId),
                learningLanguage: languages.find( lang => lang.id === user.learningLanguageId),
            }
            const updatedFields = updateFormFieldsWithDefaultData(fields, {...dataUpdatedWithSaved, ...defaultData})
            setFields(updatedFields);
            setBusy(false)
          } catch (error) {
            console.log(error);
            
          }
  
        })
        .catch((err) => {
          // notifications.show({ color: 'red', title: 'Error', message: err.message })
        })
    }
  }

  useEffect(() => {
    fetchData()
  }, [languages])

  useEffect(() => {
    console.log('effffff', id);
    fetchData(id)
  }, [id]); 

  return (<ScrollView>
    {!busy ? 
      <Form 
          fields={fields}
          user={user} 
          onSubmit={(stateOfChild) => handleSubmit(stateOfChild)} 
          validateForm={handleValidateForm} 
          error={error} 
          formValid={formValid}
          isLoading={isLoading}
      /> : <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>
    }
    {error && <KText
      status='danger'
    >{error}</KText>}
    
</ScrollView>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});