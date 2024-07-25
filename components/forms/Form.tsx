import { Button, IndexPath } from '@ui-kitten/components';
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
    user: object
}

const Form = (p: FormProps) => {
    // const { languages } = useLanguages();
    const getInitialState = () => {
        let initialState = {};
        p.fields.forEach((field) => {
            if (field.property === 'select') {
                initialState[field.property] = {
                    selectedValue : new IndexPath(0),
                    value: field.value
                }
            } else {
                initialState[field.property] = field.value
            }
        })
        return initialState
    }
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
        <Button disabled={!p.formValid} onPress={() => p.onSubmit(state)}>Submit</Button>
        {/* <Button onPress={() => p.onSubmit(state)}>Submit</Button> */}
        <Button onPress={() => log.error(JSON.stringify(state))}>Log state</Button>
    
    </View>
}

export default Form;