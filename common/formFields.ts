export const userFormFields = [
    { 
        type: "text",
        name: "firstname",
        label: "First Name",
        placeholder: "Enter your firstname",
        property: "firstname",
        value: ""
    },
    { 
        type: "text",
        name: "lastname",
        label: "Last Name",
        placeholder: "Enter your lastname",
        property: "lastname",
        value: ""
    },
    { 
        type: "text",
        name: "username",
        label: "Username",
        placeholder: "Enter a username",
        property: "username",
        value: ""
    },
    { 
     type: "email",
     name: "email",
     label: "Email",
     placeholder: "example@gmail.com",
     property: "email",
     value: ""
    },
    { 
     type: "password",
     name: "password",
     label: "Password",
     placeholder: "Enter a password",
     property: "password",
     value: ""
    },
    { 
     type: "date",
     name: "dob",
     label: "Date of birth",
     placeholder: "Enter your date of birth",
     property: "dob",
     value: null
    },
    { 
     type: "radio",
     name: "gender",
     label: "Gender",
     placeholder: "Enter your Gender",
     property: "gender",
     options: ['male', 'female'],
     value: 0
    },
    { 
     type: "radio2",
     name: "teachingLanguage",
     label: "Enter your native language",
    //  placeholder: "Enter your teachingLanguage",
     property: "teachingLanguage",
     value: null,
     options: [],
    },
    { 
     type: "radio2",
     name: "learningLanguage",
     label: "What language are you learning?",
    //  placeholder: "Enter your learningLanguage",
     property: "learningLanguage",
     value: null,
     options: [],
    },
 ];

export const exchangeFormFields = [
    { 
     type: "text",
     name: "name",
     label: "Exchange Name",
     placeholder: "Exchange name",
     property: "name",
     value: "",
     withAsterisk: true
    },
    { 
     type: "location_picker",
     name: "location",
     label: "Location Name",
     placeholder: "Type a location",
     property: "location",
     value: null
    },
    { 
     type: "select",
     name: "capacity",
     label: "Number of Participants",
     placeholder: "Number of Participants",
     property: "capacity",
     value: { value: null, selectedValue: null },
     availableValues: ['2', '4', '6', '8', '10', '12'], // web - mantine
     // options: [{ title: '2', }, { title: '4', }, { title: '6', }, { title: '8', }, { title: '10', }, { title: '12', }], // react native - kitten ui
    },
    { 
     type: "datetime",
     name: "time",
     label: "Time and Date",
     placeholder: "Pick a time and date",
     property: "time",
     value: new Date(),
     mode: 'datetime',
     is24Hour: true,
     format: "DD MMM YYYY hh:mm A"
    },
    { 
     type: "select",
     name: "duration",
     label: "Duration of Exchange (minutes)",
     placeholder: "Duration of Exchange (minutes)",
     property: "duration",
     value: { value: null, selectedValue: null },
     availableValues: ['30', '45', '60', '120', '180'],// web - mantine
     // options: [{ title: '15', }, { title: '30', }, { title: '45', }, { title: '60', }, { title: '90', }, { title: '120', }], react native - kitten ui
    },
    { 
    type: "radio",
    name: "gender",
    label: "Do you want to filter by gender",
    property: "gender",
    options: ['male', 'female', 'Any gender'],
    value: 2
    },
    { 
    type: "range",
    name: "age",
    label: "Do you want to filter by age",
    property: "age",
    value: null
    },
    { 
    type: "language_shower",
    name: "teachingLanguage",
    label: "Your teaching language is",
    property: "teachingLanguage",
    value: null
    },
    { 
    type: "language_shower",
    name: "learningLanguage",
    label: "Your teaching language is",
    property: "learningLanguage",
    value: null
    },     
];