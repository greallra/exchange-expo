// import { TextInput, Select, Image, Text, PasswordInput, rem, Radio, Group } from '@mantine/core';
// import { LanguagePicker } from '../LanguagePicker';
// import { DateTimePicker, DateInput } from '@mantine/dates';
// import { IconAt, IconCalendarMonth } from '@tabler/icons-react';
// import MapAutoComplete from "@/components/Maps/MapAutoComplete";

// import RangeSlider from 'rn-range-slider';

import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, ScrollView, Platform } from 'react-native'
import { Input, Layout, Select, SelectItem, Datepicker, Icon, Radio, RadioGroup, Text as KText, Avatar, Button } from '@ui-kitten/components';
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

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };


    return (
    <View style={styles.formFieldWrapper}>
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
            <KText category='label' appearance='hint' style={{marginBottom: 5}}>{p.label}:</KText>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{paddingRight: 5}}>{p.value.label}:</Text>
                {p.value && p.value.name ? <Avatar 
                    source={images[p.value.name.toLowerCase()]} 
                    style={{width: 20, height: 20}} 
                />:
                <Avatar 
                    source={images.empty} 
                    style={{width: 20, height: 20}} 
                />}
            </View>
            {p.property === 'learningLanguage' && <Link href="/profile">
            <KText status='primary' category='c2' appearance='hint' style={{textAlign: 'right'}}>Change Language</KText></Link>}
        </>
        }
        {p.type === 'date' &&  (
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
            {p.options.map( option => <Radio key={option} status='warning'>{option}</Radio>)}
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
               
            {p.options.map( option => <Radio key={option} status='warning'>{option.name}</Radio>)}
        </RadioGroup>
        </>)}  
        {p.type === 'datetime' && Platform.OS === 'ios' &&
        <View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <KText category='label' appearance='hint'>{p.label}</KText>
            <DateTimePicker
                testID="dateTimePicker"
                value={p.value}
                mode={p.mode}
                is24Hour={p.is24Hour}
                onChange={(event, selectedDate) => handleDirectChange(selectedDate)}
            />
            <KText category='c1' status='' style={{paddingTop: 5}}>
                Time selected: {p.value ? 
                    (<KText category='label' status='success'>{p.value.toLocaleString()}</KText>) :       
                    (<Icon style={{ width: 16, height: 16, marginLeft: 5 }}
                        fill='alert-circle-outline'
                        name='checkmark-circle-2-outline'
                    />)}
            </KText>          
        </View>
        }
        {p.type === 'datetime' && Platform.OS === 'android' &&
        <View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <KText category='label' appearance='hint'>{p.label}</KText>
            <View style={stylesLocal.fRow}>
                <Button onPress={showDatepicker} size='tiny'>Select Date</Button>
                <Button onPress={showTimepicker} size='tiny'>Select Time</Button>
            </View>
            {show && <DateTimePicker
                testID="dateTimePicker"
                value={p.value}
                mode={mode}
                is24Hour={p.is24Hour}
                onChange={(event, selectedDate) => { setShow(false); handleDirectChange(selectedDate); }}
            />}
             <KText category='c1' status='' style={{paddingTop: 5}}>
                Time selected: {p.value ? 
                    (<KText category='label' status='success'>{p.value.toLocaleString()}</KText>) :       
                    (<Icon style={{ width: 16, height: 16, marginLeft: 5 }}
                        fill='alert-circle-outline'
                        name='checkmark-circle-2-outline'
                    />)}
            </KText>     
        </View>
        }
        {p.type === 'location_picker' && 
        <>  
            <KText category='label' appearance='hint' style={{paddingBottom: 5}}>{p.label}</KText>   
            <ScrollView keyboardShouldPersistTaps='handled'>
                <GooglePlacesAutocomplete
                 listViewDisplayed={false}
                 styles={{
                    textInputContainer: {
                    //   backgroundColor: 'grey',
                    },
                    // textInput: {
                    //   height: 38,
                    //   color: '#5d5d5d',
                    //   fontSize: 16,
                    // },
                    // predefinedPlacesDescription: {
                    //   color: '#1faadb',
                    // },
                  }}
                fetchDetails={true}
                placeholder='Choose a location'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log('map -data', JSON.stringify(data, null, 2));
                    console.log('map -details', JSON.stringify(details, null, 2));
                    handleDirectChange({ address_components: details.address_components, structured_formatting: data.structured_formatting, geometry: details.geometry } )
                }}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                onFail={(e) => console.log(e)}
                />
            </ScrollView>        

            {p.value && <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      
                <KText>Location chosen: <KText category='c1' status='success'>{safeParse (p.property, p.value)}</KText></KText>
                <Icon
                    style={{ width: 16, height: 16, marginLeft: 5 }}
                    fill='green'
                    name='checkmark-circle-2-outline'
                />
            </View>}
        </>
        } 
        {p.type === 'range' && 
        <>
           {/* <Slider
            style={styles.slider}
            min={0}
            max={100}
            step={1}
            floatingLabel
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
            onValueChanged={handleValueChange}
            /> */}
        </>
        } 
    </View>
    )
}

export default FormField;

const stylesLocal = StyleSheet.create({
    fRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
      margin: 2,
    },
    alternativeContainer: {
      borderRadius: 4,
      marginVertical: 2,
      padding: 2,
      backgroundColor: '#3366FF',
    },
  });