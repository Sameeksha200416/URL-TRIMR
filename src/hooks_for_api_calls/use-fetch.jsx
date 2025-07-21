import { useState } from "react";


const useFetch = (callbackFunction, options = {}) => {


  const [data, setData] = useState(null);

  const [loading, setLoading] = useState();

  const [error, setError] = useState(null);


  const executeCallbackFunction = async (...args) => {

    setLoading(true);

    setError(null);

    try {

      const response = await callbackFunction(options, ...args);

      setData(response);

    } catch (error) {

      setError(error);

    } finally {

      setLoading(false);

    }

  };


  return { data, loading, error, executeCallbackFunction };

};


export default useFetch;