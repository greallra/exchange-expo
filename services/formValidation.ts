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
let exchangeSchema = object({
  name: string().required().min(3).max(23),
  location: object({
    geometry: object().required(),
    address_components: array().required(),
    formatted_address: string().required()
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
});

// parse and assert validity

export async function validateForm(form: string, formData: object){
    if (form === 'newUser') {
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
    if (form === 'editUser') {
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
    if (form === 'newExchange') {
        try {
            // parse and assert validity
            const exchange = await exchangeSchema.validate(formData)
            // custom validation
            return exchange
        } catch (error) {
            return error.message
        }           
    }
}
