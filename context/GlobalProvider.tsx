import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
//   const [isLogged, setIsLogged] = useState(false);
const { user, login, logout, loading } = useAuth()


  useEffect(() => {
    // getCurrentUser()
    //   .then((res) => {
    //     if (res) {
    //       setIsLogged(true);
    //       setUser(res);
    //     } else {
    //       setIsLogged(false);
    //       setUser(null);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    console.log('GlobalContext user', user);
    console.log('GlobalContext loading', user);
    
    
  }, [user, loading]);


  return (
    <GlobalContext.Provider
      value={{
        user,
        // setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;