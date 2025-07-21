import { useNavigate, useParams } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import { useEffect, useState } from "react";
import { Copy, Download, Trash } from "lucide-react";
import BeatLoader from 'react-spinners/BeatLoader';

import { Button } from "@/components/ui/button";
import { UrlGlobalState } from "@/context/context";
import useFetch from "@/hooks_for_api_calls/use-fetch";
import { deleteUrl, getSelectedUrlById } from "@/supabase_apis/apiUrl";
import { getAllClicksOfTheSelectedUrl } from "@/supabase_apis/apiUrl";
import supabase from "@/db/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LocationStatisticsComponent from "@/components/LocationStatisticsComponent";
import DeviceStatisticsComponent from "@/components/DeviceStatisticsComponent";
import { toast } from "sonner";

const LinkUrlPage = () => {

  const { id } = useParams();
  
  const { loggedInUser } = UrlGlobalState();

  const navigate = useNavigate();

  const [urlStatistics, setUrlStatistics] = useState([]);

  const {
    data: selectedUrlOfCurrentUserData,
    loading: allUrlsLoading,
    executeCallbackFunction: executeGetSelectedUrlOfCurrentUserDataCallbackFunction
  } = useFetch(getSelectedUrlById, { url_id: id, user_id: loggedInUser?.id });

  const {
    data: allStatisticsOfTheUrlData,
    loading: allClicksStatsLoading,
    executeCallbackFunction: executeGetAllClicksOfTheUrlCallbackFunction
  } = useFetch(getAllClicksOfTheSelectedUrl, id);

  const { 
    loading: loadingDeleteUrl, 
    executeCallbackFunction: executeDeleteUrlFunction
   } = useFetch(deleteUrl, id);

   const downloadQrCodeImage = () => {
    const urlofQrCodeImage = selectedUrlOfCurrentUserData?.qr_code;
    const titleOfTheUrl = selectedUrlOfCurrentUserData?.title_of_url;

    const anchorElement = document.createElement('a');
    anchorElement.href = urlofQrCodeImage;
    anchorElement.download = titleOfTheUrl;

    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  }

  useEffect(() => {
    executeGetSelectedUrlOfCurrentUserDataCallbackFunction();
    executeGetAllClicksOfTheUrlCallbackFunction();
    
    // Set up auto-refresh every 5 seconds to check for new clicks
    const interval = setInterval(() => {
      executeGetAllClicksOfTheUrlCallbackFunction();
    }, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [id]);

  // Debug logs
  console.log("Selected URL Data:", selectedUrlOfCurrentUserData);
  console.log("Statistics Data:", allStatisticsOfTheUrlData);
  console.log("Stats Loading:", allClicksStatsLoading);

let shortOrCustomLink = "";
  

  if (selectedUrlOfCurrentUserData) {
    shortOrCustomLink = selectedUrlOfCurrentUserData.custom_url ? selectedUrlOfCurrentUserData.custom_url : selectedUrlOfCurrentUserData.short_url;
  }


  const copyShortUrlToClipboard = () => {

    const shortUrl = selectedUrlOfCurrentUserData?.custom_url || selectedUrlOfCurrentUserData?.short_url;
    navigator.clipboard.writeText(`${window.location.origin}/${shortUrl}`);

    toast("short url has been successfully copied to clipboard", {
      position: 'top-right'
    });
    
  }

  
  return (
    <>
      {(allUrlsLoading || allClicksStatsLoading) && (
        <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />
      )}

      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          {/* Display title prominently */}
          <span className="text-4xl sm:text-6xl font-extrabold break-words">{selectedUrlOfCurrentUserData?.title || 'Untitled Link'}</span>

          <a 
            className="text-xl sm:text-3xl text-blue-400 font-bold hover:underline cursor-pointer break-words" 
            href={`${window.location.origin}/${selectedUrlOfCurrentUserData?.short_url}`} 
            target="_blank"
          >{window.location.origin}/{selectedUrlOfCurrentUserData?.short_url}</a>
          
          <a 
            href={`${selectedUrlOfCurrentUserData?.original_url}`} 
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer break-words"
          >
            {selectedUrlOfCurrentUserData?.original_url}
          </a>

          <div className="flex items-center gap-2">
            <span className="font-semibold">Date of Creation</span>
            <span className="flex items-end font-extrabold text-sm">{new Date(selectedUrlOfCurrentUserData?.created_at).toLocaleString()}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              variant='ghost'
              onClick={copyShortUrlToClipboard}
            >
              <Copy />
            </Button>

            <Button 
              variant='ghost'
              onClick={downloadQrCodeImage}
            >
              <Download />
            </Button>

            <Button 
              variant='ghost'
              onClick={() => executeDeleteUrlFunction().then(() => {
                  navigate("/dashboard");
              })}
            >
              { loadingDeleteUrl ? <BeatLoader size={5} color="white" /> : <Trash /> } 
            </Button>
          </div>          <img 
            src={selectedUrlOfCurrentUserData?.qr} 
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain" 
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5 w-full">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-4xl font-extrabold">Statistics</CardTitle>
          </CardHeader>

          {allStatisticsOfTheUrlData && allStatisticsOfTheUrlData?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{allStatisticsOfTheUrlData?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <LocationStatisticsComponent urlStatistics={allStatisticsOfTheUrlData} />

              <CardTitle>Device Information</CardTitle>
              <DeviceStatisticsComponent urlStatistics={allStatisticsOfTheUrlData} />
            </CardContent>
          ) : (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>0</p>
                </CardContent>
              </Card>
              
              <div className="text-center py-8">
                <p className="text-lg text-gray-400 mb-2">📊 No Statistics Yet</p>
                <p className="text-sm text-gray-500">Share your short link to start seeing analytics!</p>
                <p className="text-xs text-gray-400 mt-2">Graphs and charts will appear once people start clicking your link</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

export default LinkUrlPage;