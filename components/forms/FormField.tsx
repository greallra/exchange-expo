// import { TextInput, Select, Image, Text, PasswordInput, rem, Radio, Group } from '@mantine/core';
// import { LanguagePicker } from '../LanguagePicker';
// import { DateTimePicker, DateInput } from '@mantine/dates';
// import { IconAt, IconCalendarMonth } from '@tabler/icons-react';
// import MapAutoComplete from "@/components/Maps/MapAutoComplete";

// import { useNavigate } from "react-router-dom";

import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native'
import { Input, Layout, Select, SelectItem, Datepicker, Icon, Radio, RadioGroup, Text as KText } from '@ui-kitten/components';
import { Link } from 'expo-router'
import styles from "@/common/styles"
import {safeParse} from "@/common/utils"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import { images } from '@/constants'

var today = new Date();
let datePlus11, dateMinus16;
datePlus11 = today.setDate(today.getDate() + 11);
dateMinus16 = today.setDate(today.getDate() - 16);

const renderIcon = (props): React.ReactElement => (
    <Icon
        {...props}
        name={'eye-off'}
      />
  );

interface FormFieldProps {
    type: "text" | "checkbox",
    name: string,
    placeholder: string,
    property: string,
    value: string | boolean | number,
    options: Array,
}

interface outputProps {
    onChange: <T>(property: string, value: T) => void
}

const FormField = (p: FormFieldProps, outputProps) => {

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.type === 'text' || 'password') {
            p.onChange(p.property, event.target.value)
        }
    }
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.type === 'checkbox') {
            p.onChange(p.property, event.target.value)
        }
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement> | string | number) => {  
       handleTextChange(event)
       handleCheckboxChange(event)
    }
    const handleDirectChange = (value: object) => {  
       p.onChange(p.property, value)
    }


    return (
    <View style={styles.formFieldWrapper}>
        {/* <label htmlFor={p.label}>{p.name}</label>
        <input 
            type={p.type} 
            name={p.property}
            placeholder={p.placeholder}
            id={p.id}
            value={p.value}
            onChange={handleChange}
        /> */}
        {(p.type === 'text'  || p.type === 'email') &&  <Input
            placeholder={p.placeholder}
            label={p.label}
            value={p.value}
            onChangeText={nextValue => handleDirectChange(nextValue)}
        />
        }
        {p.type === 'password' &&  
        <Input
            value={p.value}
            placeholder={p.placeholder}
            label={p.label}
            accessoryRight={renderIcon}
            onChangeText={nextValue => handleDirectChange(nextValue)}
        />
        }
        {p.type === 'select' &&   <Select
            placeholder='Default'
            label={p.label}
            value={p.value.value}
            selectedIndex={p.value.selectedValue}
            onSelect={(index: IndexPath) => handleDirectChange({ selectedValue: index, value: p.availableValues[index.row] } )}
        >
            {p.availableValues.map( value =>  <SelectItem title={value} key={value} />)}
        </Select>
        }  
        {p.type === 'language_shower' && 
        <>
            <Text>{p.label}</Text>
            <View>
            {/* <Avatar source={safeImageParse(`${p.property} Unfolded`, exchange)} size='medium' /> */}
                <Text>{p.value.label}</Text>
            </View>
            {p.property === 'learningLanguage' && <Link href="/profile">Change Language</Link>}
        </>
        }
        {p.type === 'date' && (
        <Datepicker
            label={p.label}
            placeholder={p.placeholder}
            min={new Date("1912-03-25")}
            max={new Date("2007-03-25")}
            date={p.value}
            onSelect={nextDate => handleDirectChange(nextDate)}
            accessoryRight={<Icon name='calendar'/>}
        />)}    
        {p.type === 'radio' && (
        <>
        <KText category='label' appearance='hint'>{p.label}</KText>
        <RadioGroup
            style={{ display: 'flex', flexDirection: 'row', padding: 0}}
            selectedIndex={p.value}
            onChange={index => handleDirectChange(index)}
        >
            {p.options.map( option => <Radio key={option}>{option}</Radio>)}
        </RadioGroup>
        </>)}    
        {p.type === 'radio2' && (
        <>
        <KText category='label' appearance='hint'>{p.label}</KText>
        <RadioGroup
            style={{ display: 'flex', flexDirection: 'row', padding: 0}}
            selectedIndex={p.value && p.value.index}
            onChange={index => handleDirectChange(p.options.find( option => option.index === index))}
        >
               
            {p.options.map( option => <Radio key={option}>{option.name}</Radio>)}
        </RadioGroup>
        </>)}    
        {p.type === 'datetime' && 
        <>
            <DateTimePicker
                testID="dateTimePicker"
                value={p.value}
                mode={p.mode}
                is24Hour={p.is24Hour}
                onChange={(event, selectedDate) => handleDirectChange(selectedDate)}
            />
            <Text>Time selected: {p.value.toLocaleString()}</Text>
        </>
        }
        {p.type === 'location_picker' && 
        <>
            <View style={{zIndex: 1, maxHeight: 200, minHeight: 100}}>
                <GooglePlacesAutocomplete
                fetchDetails={true}
                placeholder='Choose a location'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                    handleDirectChange({ address_components: details.address_components, structured_formatting: data.structured_formatting, ...details.geometry.location })
                }}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                onFail={(e) => console.log(e)}
                />
            </View>
            <Text>{safeParse (p.property, p.value)} </Text>
        </>
        } 
    </View>
    )
}

export default FormField;