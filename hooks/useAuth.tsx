import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, onAuthStateChanged } from "@/firebase/firebaseConfig"
import useLanguages from '@/hooks/useLanguages';
import { getOneDoc } from "@/firebase/apiCalls"
import { formatUserData } from '@/common/utils'

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { languages } = useLanguages();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        console.log('onAuthStateChanged USER = ', user);
        let userDataFromAuth = {
          uid: user.uid,
          accessToken: user.accessToken,
          email: user.email,
          // metadata: user.metadata,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
        }
        getOneDoc ('users', user.uid)
        .then(({docSnap}) => {
        //   console.log('get toc', languages); 
          // setTimeout(() => { console.log('get toc', languages); }, 3000)
          const combinedAuthAndCollection = {...userDataFromAuth, ...docSnap.data()}
          
  
          console.log('languages', languages);
          console.log('combinedAuthAndCollection', formatUserData(combinedAuthAndCollection, languages));
          setUser(formatUserData(combinedAuthAndCollection, languages))
        })
        .catch((e) => console.log(e))
      });
    setTimeout(() =>  setLoading(false),  1500)
    return unsubscribe;
  }, [languages]);

  useEffect(() => {
//     console.log('user', user);
//     getOneDoc ('users', '2l4kxRPQAjTgYjULVmVovUThVP72')
//     .then((res) => {console.log(res);
//     })
//     .catch((e) => {console.log(e);
//     })
    console.log('user state', user);
    // AsyncStorage.getItem('user').then((u) => console.log('user ALS', JSON.parse(u)))
    
    
  }, [user]);

 // the watcher will be responsible for login
 const login = async (data) => {
    // const formattedData = formatUserData(data, languages)
    // setUser(formattedData);
    try {
        setUser(data)
        // await AsyncStorage.setItem('user', JSON.stringify(data));
    } catch (e) {
        console.log('err AsyncStorage'); 
    }
    // navigate("/exchanges");
  };

  const logout = async () => {
    // auth.signOut().then((user) => {
    //   console.log('signOut', user);
    // })
    // await AsyncStorage.removeItem('user');
  };


  return { user, loading, logout, login };
}

export default useAuth