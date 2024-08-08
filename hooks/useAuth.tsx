import { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, onAuthStateChanged, FIREBASE_DB } from "@/firebase/firebaseConfig"
import useLanguages from '@/hooks/useLanguages';
import { getOneDoc } from "@/firebase/apiCalls"
import { formatUserData } from '@/common/utils'
// import {
//   collection,
//   onSnapshot,
//   doc
// } from "firebase/firestore";
// import _ from 'lodash';

function useAuth() {
  const [user, setUser] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const { languages } = useLanguages();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        console.log('onAuthStateChanged USER = ', user);
        if (!user) {
          setLoading(false)
          return setUser(null)
        }
        let userDataFromAuth = {
          id: user.uid,
          uid: user.uid,
          accessToken: user.accessToken,
          email: user.email,
          // metadata: user.metadata,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
        }
   
   
        getOneDoc ('users', user.uid)
        .then(({docSnap}) => {

          const combinedAuthAndCollection = {...userDataFromAuth, ...docSnap.data()}     
          console.log('languages', languages);
          console.log('combinedAuthAndCollection', formatUserData(combinedAuthAndCollection, languages));
          setUser(formatUserData(combinedAuthAndCollection, languages))
          setTimeout(() => setUserReady(true))
          setLoading(false)
        })
        .catch((e) => { 
          console.log(e)
          setLoading(false)
        })
      });
    return unsubscribe;
  }, [languages]);

  useEffect(() => {
    console.log('user state auuth hook', user);
    
  }, [user]);

 // the watcher will be responsible for login
 const login = async () => {
    // directly with FB
  };

  const logout = async () => {
    // auth.signOut().then((user) => {
    //   console.log('signOut', user);
    // })
  };


  return { user, loading, logout, login, setLoading, setUser };
}

export default useAuth