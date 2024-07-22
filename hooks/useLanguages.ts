import { useEffect, useState } from 'react';
import { formatLanguages } from '@/common/utils'
import { getCollection } from '@/firebase/apiCalls';

const useLanguages = () => {
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        getCollection ('languages')
        .then(({ data }) => {
            console.log('response.languages', );
            const formattedLanguages = formatLanguages(data)
            setLanguages(formattedLanguages)
        })

    },[])

    return {
        languages
    }
}

export default useLanguages;