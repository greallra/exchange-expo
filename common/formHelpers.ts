export function formatPostDataExchange (data: object) {
    let formattedData = {
        ...data,
        learningLanguageId: data.learningLanguage.id,
        teachingLanguageId: data.teachingLanguage.id,
        capacity: data.capacity.value,
        duration: data.duration.value,
    }
    delete formattedData.learningLanguage;
    delete formattedData.teachingLanguage;
    return formattedData;
}
export function formatPostDataSignup (data: object) {
    let formattedData = {
        ...data,
        learningLanguageId: data.learningLanguage.id,
        teachingLanguageId: data.teachingLanguage.id
    }
    delete formattedData.learningLanguage;
    delete formattedData.teachingLanguage;
    return formattedData;
}

export function updateFormFieldsWithSavedData(formFields: Array, savedData: object) {
    return formFields.map((field) => {
        // if data given to alter field contains field property and has a value, assign it to the field value
        const value = savedData[field.property];
        if (value) {
           field.value = value
        }
        return field
    })
}
export function updateFormFieldsWithDefaultData(formFields: Array, defaultData: object, languages: Array) {
    return formFields.map((field) => {
        // if data given to alter field contains field property and has a value, assign it to the field value
        const value = defaultData[field.property];
        if (value) {
           field.value = value
        }
        // update availableValues property of teching Language // or update any other properties here
        if (languages && field.property === 'teachingLanguage' || languages && field.property === 'learningLanguage') {
            field.options = languages.map( (lang,i) => ({...lang, index: i }) )
        }
        return field
    })
}