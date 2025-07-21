/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect } from 'react';

import useFetch from '@/hooks_for_api_calls/use-fetch';
import { getCurrentAuthenticatedUser } from '@/supabase_apis/apiAuth';


const urlGlobalContext = createContext();


const UrlGloalProvider = ({ children }) => {

  
  const {
    data: loggedInUser,
    loading,
    executeCallbackFunction: fetchCurrentLoggedInUserFromSupabase,
  } = useFetch(getCurrentAuthenticatedUser);


  const isUserAuthenticated = loggedInUser?.role === 'authenticated';


  useEffect(() => {

    fetchCurrentLoggedInUserFromSupabase();
    
  }, []);


  return (
    <urlGlobalContext.Provider
      value={{
        loggedInUser,
        fetchCurrentLoggedInUserFromSupabase,
        loading,
        isUserAuthenticated,
      }}
    >
      {children}
    </urlGlobalContext.Provider>
  );
};


export const UrlGlobalState = () => {

    return useContext(urlGlobalContext);
    
}


export default UrlGloalProvider;