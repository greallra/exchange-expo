import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
const { user, login, logout, loading } = useAuth()


  useEffect(() => {

    console.log('GlobalContext user', user);
    console.log('GlobalContext loading', user);
    
    
  }, [user, loading]);


  return (
    <GlobalContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;