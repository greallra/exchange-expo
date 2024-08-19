import { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, onAuthStateChanged, FIREBASE_DB } from "@/firebase/firebaseConfig"
import useLanguages from '@/hooks/useLanguages';
import { getOneDoc } from "@/firebase/apiCalls"
import { appendAuthDataToUser, esGetDoc, formatUserData } from 'exchanges-shared'

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
        const userData = appendAuthDataToUser(user)
   
   
        esGetDoc (FIREBASE_DB, 'users', user.uid)
        .then(({docSnap}) => {

          const combinedAuthAndCollection = {...userData, ...docSnap.data()}  
          console.log('combinedAuthAndCollection', combinedAuthAndCollection);
          
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