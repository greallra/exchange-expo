import { getCollection } from "@/firebase/apiCalls"
import { useEffect, useState } from 'react';

const useFetch = (collectionName: string) => {
    const [data, setData] = useState([])

    useEffect(() => {
        getCollection(collectionName)
        .then(({ data }) => {
            setData(data);
        });
    }, [])
    return {
        data
    }
}

export default useFetch;