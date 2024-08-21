import { format, formatDistance, formatRelative, subDays, formatISO } from 'date-fns'
import _ from 'lodash'
import { images } from '@/constants'
import { isFirebaseId } from 'exchanges-shared'

// Get image based on env
export function getImage(path) {
    // console.log('import.meta.env.BASE_URL', import.meta.env.BASE_URL);
    // console.log('import.meta.env.MODE', import.meta.env.MODE);
    // console.log('import.meta.env.PROD', import.meta.env.PROD);
    
    // src="/src/assets/logo.png" - this also works
    return path;
}

export function safeImageParse (property: string, obj: object) {
    try {
        if (!property || !obj) {
            console.log('1')
            return images.empty
        }
        if (typeof value === 'string') {
            console.log('2')
            return images.empty
        }
        if (property === 'teachingLanguageUnfolded' || property === 'learningLanguageUnfolded' &&
            obj[property] && obj[property].name
        ) { 
            console.log('3', obj)
            let name = obj[property].name
            return images[name.toLowerCase()]
        } 
    } catch (error) {
        console.log('4')
        console.log(error.message);

        return images.empty
    }
  
}