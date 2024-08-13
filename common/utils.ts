import { format, formatDistance, formatRelative, subDays, formatISO } from 'date-fns'
import _ from 'lodash'
import { images } from '@/constants'

// Get image based on env
export function getImage(path) {
    // console.log('import.meta.env.BASE_URL', import.meta.env.BASE_URL);
    // console.log('import.meta.env.MODE', import.meta.env.MODE);
    // console.log('import.meta.env.PROD', import.meta.env.PROD);
    
    // src="/src/assets/logo.png" - this also works
    return path;
}

export function isFirebaseId (str: string) {
    return typeof str === 'string' && str.length === 20;
}
// one user object
export function formatUserData(user, languages) {
    let result = {...user}
    if (user.dob) {
        result.dob = new Date(formatISO(user.dob.seconds * 1000))
    }
    return {
        ...result,
        teachingLanguageUnfolded: getObjectById(user.teachingLanguageId, languages),
        learningLanguageUnfolded: getObjectById(user.learningLanguageId, languages),

    }
}
// array of users
export function formatUsersData(users, languages) {
   return users.map((user) => formatUserData(user, languages));
}

export function getObjectById(id: string, items: Array){
    if (!id || !isFirebaseId(id) || !items || items.length === 0) {
        return ''
    }
    return items.find( item => item.id === id) || '';
}

// export function getUserObjectById(id: string, users: Array){
//     if (!id || !isFirebaseId(id) || !users || users.length === 0) {
//         return ''
//     }
//     return users.find( user => user.id === id) || '';
// }

export function formatExchange (exchange: object, languages: Array, users: Array) {
    if (typeof exchange.time === 'object') {
        exchange.timeUnix = format(formatISO(exchange.time.seconds * 1000), 'Pp')
        exchange.timeHour = format(formatISO(exchange.time.seconds * 1000), 'p')
        exchange.datePretty = format(exchange.time.seconds * 1000, 'MM/dd/yyyy')
    }
    if (typeof exchange.name !== 'string') {
        console.log('exchange', {...exchange});
        exchange.name = "not string"
    }
    
    exchange.teachingLanguageUnfolded = getObjectById(exchange.teachingLanguageId, languages)
    exchange.learningLanguageUnfolded = getObjectById(exchange.learningLanguageId, languages)
    
    if (users.length > 0) {
        exchange.organizerUnfolded = users.find( item => item.id === exchange.organizerId)
    }


    return {
        ...exchange
    }
}
export function formatLanguages (languages: Array) {
    return languages.map((lang) => {
        return {
            ...lang,
            label: lang.name
        }
    })
}
export function getUserInitials (user: object) {
    if (!user || !user.firstname || !user.lastname) {
        return "XX"
    }
    return user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase() 
}

export function parseLocation (location: object) {
    if (!location) {
        return "Parse fail (location)"
    }
    // One is web other is RN
    if (location.formatted_address) {
        return location.formatted_address;
    }
    if (location.structured_formatting) {
        return location.structured_formatting.main_text;
    }
    return "Parse fail (location)"
}

export function safeParse (property: string, value: object) {
    if (!property || !value) {
        return 'Parse Fail'
    }
    if (typeof value === 'string') {
        return value
    }
    if (property === 'organizerUnfolded') {
        if (value.username) {
            return value.username
        }
        return 'Parse Fail'
    }
    return 'Parse Fail'
}


export function safeImageParse (property: string, obj: object) {
    try {
        console.log('1')
        if (!property || !obj) {
            return images.empty
        }
        if (typeof value === 'string') {
            return images.empty
        }
        if (property === 'teachingLanguageUnfolded' || property === 'learningLanguageUnfolded' &&
            obj[property] && obj[property].name
        ) { 
            let name = obj[property].name
            return images[name.toLowerCase()]
        } 
    } catch (error) {
        console.log(error.message);

        return images.empty
    }
  
}