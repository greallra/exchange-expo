import { getCollection } from "@/firebase/apiCalls"
import { FIREBASE_DB } from "@/firebase/firebaseConfig"
import { useEffect, useState } from 'react';
import {
    collection,
    onSnapshot
  } from "firebase/firestore";

const useFetch = (collectionName: string) => {
    const [data, setData] = useState([])
    // const [data2, setData2] = useState([])
    // const [exchanges, setExchanges] = useState([])

    // useEffect(() => {
    //     getCollection(collectionName)
    //     .then(({ data }) => {
    //         setData(data);
    //     });
    // }, [])
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
    // useEffect(() => {
    //     const colRef = collection(FIREBASE_DB, collectionName)
    //     onSnapshot(colRef, (snapshot) => {
    //         let data2: Array<object> = []
    //         snapshot.docs.forEach((doc) => {
    //             data2.push({...doc.data(), id: doc.id })
    //         })
    //         console.log('onSnapshot', data2);
            
    //         setExchanges(data2)
    //     });
    // }, [])
    return {
        data,
        // data2,
        // exchanges
    }
}

export default useFetch;