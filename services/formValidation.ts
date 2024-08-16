import { object, string, email, number, date, InferType, array } from 'yup';

import _ from 'lodash';

let newUserSchema = object({
  firstname: string().required().min(3),
  lastname: string().required().min(3),
  username: string().required().min(3).matches(/^\S*$/, "No whitespace"),
  email: string().email().required(),
  password: string().required().min(6),
  // name: string().required(),
  dob: date().required(),
  gender: number().required(),
  teachingLanguage: object().required(),
  learningLanguage: object().required(),
});

let editUserSchema = object({
  firstname: string().required().min(3),
  lastname: string().required().min(3),
  username: string().required().min(3).matches(/^\S*$/, "No whitespace"),
  // email: string().email().required(),
  // password: string().required().min(6),
  // name: string().required(),
  dob: date().required(),
  gender: number().required(),
  teachingLanguage: object({
    name: string().required(),
  }).required(),
  learningLanguage: object({
    name: string().required(),
  }).required(),
});

const exchangeSchemaServer = object({
  age_range: array(),
  capacity: string(),
  duration: string(),
  gender: number(),
  learningLanguageId: string().min(20),
  location: object({
    geometry: object(),
    address_components: array(),
    structured_formatting: object(),
  }),
  name: string().min(3).max(23),
  organizerId: string().min(20),
  participantIds: array(),
  teachingLanguageId: string().min(20),
  time: date(),
});

let exchangeSchemaFormFields = object({
  name: string().required().min(3).max(23),
  location: object({
    geometry: object().required(),
    address_components: array().required(),
    structured_formatting: object(),
  }).required('You must pick a location'),
  capacity: object({
    value: string().required(),
  }).required('You must pick a capacity'),
  duration: object({
    value: string().required(),
  }).required('You must pick a duration'),
  gender: number().required(),
  age_range: array().required(),
  time: date().required(),
//   duration: string(),
  teachingLanguage: object().required(),
  learningLanguage: object().required(),
}).noUnknown();

// parse and assert validity

export async function validateForm(formType: string, formData: object){
    if (formType === 'newUser') {
        try {
            // parse and assert validity
            const user = await newUserSchema.validate(formData)
            // custom validation
            if (_.isEqual(user.teachingLanguage, user.learningLanguage)) {
              return 'Teaching Language and Learning Language cannot be the same';
            }
            return user
        } catch (error) {
            return error.message
        }           
    }
    if (formType === 'editUser') {
        try {
            // parse and assert validity
            const user = await editUserSchema.validate(formData)
            // custom validation
            if (_.isEqual(user.teachingLanguage, user.learningLanguage)) {
              return 'Teaching Language and Learning Language cannot be the same';
            }
            return user
        } catch (error) {
            return error.message
        }           
    }
    if (formType === 'newExchange') {
        try {
            // parse and assert validity
            const exchange = await exchangeSchemaFormFields.validate(formData)
            // custom validation
            return exchange
        } catch (error) {
            return error.message
        }           
    }
    if (formType === 'editExchange') {
        try {
            // parse and assert validity
            const exchange = await exchangeSchemaFormFields.validate(formData)
            // custom validation
            return exchange
        } catch (error) {
            return error.message
        }           
    }
}
export async function validateFormForServer(formType: string, formData: object){
    if (formType === 'exchange') {
        try {
            // parse and assert validity
            const exchange = await exchangeSchemaServer.validate(formData)
            // custom validation
            return exchange
        } catch (error) {
            return error.message
        }           
    }
}
