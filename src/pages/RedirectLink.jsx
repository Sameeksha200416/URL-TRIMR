/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import BarLoader from 'react-spinners/BarLoader';

import useFetch from "@/hooks_for_api_calls/use-fetch";
import { findTargetUrlForRedirection, storeClicksDetailsOfUrlsOnClick } from "@/supabase_apis/apiUrlClicks";

const RedirectLink = () => {
  const { id } = useParams();

  const {
    data: targetUrlData,
    loading: targetUrlLoading,
    executeCallbackFunction: executeFindTargetUrlFunction
  } = useFetch(findTargetUrlForRedirection, id);

  const {
    loading: storeClicksLoading,
    executeCallbackFunction: executeStoreClicksFunction
  } = useFetch(storeClicksDetailsOfUrlsOnClick, {
    url_id: targetUrlData && targetUrlData[0] ? targetUrlData[0].id : null,
    original_url: targetUrlData && targetUrlData[0] ? targetUrlData[0].original_url : null
  });

  useEffect(() => {
    executeFindTargetUrlFunction();
  }, []);

  useEffect(() => {
  if (!targetUrlLoading && targetUrlData && Array.isArray(targetUrlData) && targetUrlData.length > 0) {
    const urlData = targetUrlData[0]; // Get first item from array
    if (urlData.id && urlData.original_url) {
      const storeClickWithLocation = async () => {
        try {
          await executeStoreClicksFunction();
          // Redirect to original URL after storing click data
          window.location.href = urlData.original_url;
        } catch (error) {
          await executeStoreClicksFunction();
          // Redirect even if there's an error storing click data
          window.location.href = urlData.original_url;
        }
      };
      storeClickWithLocation();
    }
  }
  }, [targetUrlLoading, targetUrlData]);

  if (storeClicksLoading || targetUrlLoading) {
    return (
      <>
        <BarLoader width={'100%'} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectLink;