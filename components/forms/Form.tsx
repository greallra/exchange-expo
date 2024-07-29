import { Button, IndexPath, Spinner } from '@ui-kitten/components';
// import { IconInfoCircle } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import FormField from './FormField'
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import styles from "@/common/styles"
import { logger } from "react-native-logs";
var log = logger.createLogger();

interface FormProps {
    fields: Array<FormFieldProps>,
    onSubmit: <T>(data: T) => void,
    validateForm: <T>(data: T) => void,
    error: string,
    formValid: boolean,
    user: object,
    isLoading: boolean
}

const Form = (p: FormProps) => {
    // const { languages } = useLanguages();
    const getInitialState = () => {
        let initialState = {};
        p.fields.forEach((field) => {
            if (field.type === 'select' && !field.value) {
                initialState[field.property] = {
                    selectedValue : new IndexPath(0),
                    value: field.availableValues[0]
                }
            } else {
                initialState[field.property] = field.value
            }
        })
        return initialState
    }
    useEffect(() => {       console.log('state', JSON.stringify(state, null, 2)) }, [state])
    const [state, setState] = useState(getInitialState())
    const handleChange = (property: string, value: string | boolean | number) => {
        console.log('form', property, value);
        
        setState((s) => {
            p.validateForm({...s, [property]: value})
            console.log('{...s, [property]: value}', property, value);
            return {...s, [property]: value}
        })
        
    }
    return <View style={styles.formWrapper}>
        {p.fields.map((field, i) => {
            return <FormField 
                key={i} 
                {...field} 
                onChange={(property: string, value: string | boolean | number) => handleChange(property, value)} 
                value={state[field.property]}/>
        })}
        <Button 
            disabled={p.isLoading} 
            onPress={() => p.onSubmit(state)}
            appearance={p.isLoading ? 'outline' : 'filled'} accessoryLeft={<Spinner size='small' style={{justifyContent: 'center', alignItems: 'center',}} />} >
            {!p.isLoading && 'Submit'}
        </Button>
        {/* <Button onPress={() => p.onSubmit(state)}>Submit</Button> */}
        <Button onPress={() => console.log(JSON.stringify(state, null, 2))}>Log state</Button>
    
    </View>
}

export default Form;