/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import BarLoader from "react-spinners/BarLoader";
import { Filter, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import ErrorMessageComponent from "@/components/ErrorMessageComponent";
import useFetch from "@/hooks_for_api_calls/use-fetch";
import { getAllUrlsOfCurrentLoggedInUser } from "@/supabase_apis/apiUrl";
import { UrlGlobalState } from "@/context/context";
import LinkCard from "@/components/LinkCard";
import CreateLink from "@/components/CreateLink";
import { getClicksForUserUrls } from "@/supabase_apis/apiUrlClicks";

const Dashboard = () => {
  const [totalClicks, setTotalClicks] = useState(0);
  const [ searchForLinksInput, setSearchForLinksInput ] = useState('');

  const { loggedInUser } = UrlGlobalState();
  if (!loggedInUser) {
  return <BarLoader width={'100%'} color="#36d7b7" />;
}
useEffect(() => {
  async function fetchClicks() {
    if (loggedInUser?.id) {
      const clicks = await getClicksForUserUrls(loggedInUser.id);
      console.log(clicks);
      setTotalClicks(clicks.length);
    }
  }
  fetchClicks();
}, [loggedInUser]);


  const { 
    data: allUrls, 
    executeCallbackFunction: executeFetchAllUrlFunction, 
    error: urlError, 
    loading: allUrlsLoading
  } = useFetch(getAllUrlsOfCurrentLoggedInUser, loggedInUser.id);
  


  useEffect(() => {

    executeFetchAllUrlFunction();

  }, []);

  
  const searchUrlBasedOnInputInSearchFilterInputField = useMemo(() => {
    if (!allUrls || allUrls.length === 0) return [];
    
    if (!searchForLinksInput.trim()) return allUrls;
    
    const searchTerm = searchForLinksInput.toLowerCase().trim();
    
    return allUrls.filter((url) => {
      return (
        url?.title_of_url?.toLowerCase().includes(searchTerm) ||
        url?.custom_url?.toLowerCase().includes(searchTerm) ||
        url?.original_url?.toLowerCase().includes(searchTerm)
      );
    });
  }, [allUrls, searchForLinksInput]);

  // Debug logging (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("=== Dashboard Debug ===");
      console.log("allUrls:", allUrls);
      console.log("allUrls length:", allUrls?.length);
      
      // Debug individual URL structure
      if (allUrls && allUrls.length > 0) {
        console.log("First URL structure:", allUrls[0]);
        allUrls.forEach((url, index) => {
          console.log(`URL ${index + 1}:`, {
            id: url.id,
            title_of_url: url.title_of_url,
            original_url: url.original_url,
            custom_url: url.custom_url,
            short_url: url.short_url
          });
        });
      }
      
      console.log("searchForLinksInput:", searchForLinksInput);
      console.log("filtered results:", searchUrlBasedOnInputInSearchFilterInputField);
      console.log("filtered results length:", searchUrlBasedOnInputInSearchFilterInputField.length);
      console.log("urlError:", urlError);
      console.log("allUrlsLoading:", allUrlsLoading);
      console.log("=== End Debug ===");
    }
  }, [allUrls, searchForLinksInput, searchUrlBasedOnInputInSearchFilterInputField, urlError, allUrlsLoading]);
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">


     {allUrlsLoading && <BarLoader width={'100%'} color="#36d7b7" />}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Card>

          <CardHeader>
            <CardTitle>Total Links</CardTitle>
          </CardHeader>

          <CardContent>
            <p>{allUrls?.length}</p>
          </CardContent>

        </Card>
        <Card>
    <CardHeader>
      <CardTitle>Total Clicks</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{totalClicks}</p>
    </CardContent>
  </Card>

      </div>


      <div className="flex flex-col gap-4 md:flex-row justify-between items-center">

        <h1 className="text-3xl md:text-4xl font-extrabold">My Links</h1>

        <CreateLink />
        
      </div>


      <div className="relative mt-4">

        <Input 
          type='text' 
          value={searchForLinksInput} 
          name="searchForLinksInput"
          id="searchForLinksInput"
          placeholder={`Search in ${allUrls?.length || 0} links by title, custom URL, or original URL...`}
          onChange={(e) => setSearchForLinksInput(e.target.value)}
          className="pr-16"
        />

        {searchForLinksInput && (
          <X 
            className="absolute top-2 right-8 p-1 cursor-pointer text-gray-400 hover:text-gray-600" 
            onClick={() => setSearchForLinksInput('')}
          />
        )}

        <Filter className="absolute top-2 right-2 p-1 text-gray-400" />
        
        {searchForLinksInput && (
          <div className="text-sm text-gray-500 mt-1">
            Found {searchUrlBasedOnInputInSearchFilterInputField.length} results
          </div>
        )}

      </div>


      {urlError && <ErrorMessageComponent message={urlError.message} />}



      <div className="flex flex-col gap-4">
        {allUrlsLoading ? (
          <div className="text-center py-8">
            <BarLoader width={'100%'} color="#36d7b7" />
            <p className="mt-2">Loading your links...</p>
          </div>
        ) : urlError ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading links: {urlError.message}</p>
            <button 
              onClick={() => executeFetchAllUrlFunction()} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : !allUrls || allUrls.length === 0 ? (
          <div className="text-center py-8">
            <p>No links created yet. Create your first link!</p>
          </div>
        ) : searchUrlBasedOnInputInSearchFilterInputField.length === 0 && searchForLinksInput ? (
          <div className="text-center py-8">
            <p>No links found matching "{searchForLinksInput}"</p>
            <p className="text-sm text-gray-500 mt-1">Try a different search term or clear the search to see all links.</p>
          </div>
        ) : (
          searchUrlBasedOnInputInSearchFilterInputField.map((url, index) => (
            <LinkCard 
              key={url.id || index} 
              url={url} 
              executeFetchAllUrlFunction={executeFetchAllUrlFunction}
            />
          ))
        )}
      </div>

    </div>
  )
}

export default Dashboard;