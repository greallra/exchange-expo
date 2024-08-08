import { getCollection } from "@/firebase/apiCalls"
import { FIREBASE_DB } from "@/firebase/firebaseConfig"
import { useEffect, useState } from 'react';
import {
    collection,
    onSnapshot
  } from "firebase/firestore";

const useFetch = (collectionName: string) => {
    const [data, setData] = useState([])
    useEffect(() => {
        const colRef = collection(FIREBASE_DB, collectionName)
        onSnapshot(colRef, (snapshot) => {
            let data: Array<object> = []
            snapshot.docs.forEach((doc) => {
                data.push({...doc.data(), id: doc.id })
            })
            console.log('onSnapshot', data);
            
            setData(data)
        });
    }, [])

    return {
        data
    }
}

export default useFetch;