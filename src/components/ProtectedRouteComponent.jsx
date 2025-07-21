/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";

import { UrlGlobalState } from "@/context/context";


const ProtectedRouteComponent = ({ children }) => {

  const navigate = useNavigate();

  const { loading, isUserAuthenticated } = UrlGlobalState();


  useEffect(() => {

    if (!isUserAuthenticated && loading === false) {

        navigate('/auth');

    }
    
  }, [loading, isUserAuthenticated]);


  if (loading) {

    return <BarLoader width={'100%'} color="#36d7b7" />

  }

  if (isUserAuthenticated) {

    return children;

  }

}

export default ProtectedRouteComponent;