/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { Copy, Download, Trash } from "lucide-react";
import BeatLoader from 'react-spinners/BeatLoader';

import { Button } from "./ui/button";
import useFetch from "@/hooks_for_api_calls/use-fetch";
import { deleteUrl } from "@/supabase_apis/apiUrl";
import { toast } from "sonner";


// Function to generate title from URL
const generateTitleFromUrl = (originalUrl) => {
  if (!originalUrl) return "Link";
  
  try {
    const url = new URL(originalUrl);
    const domain = url.hostname.replace('www.', '');
    
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return 'YT';
    } else if (domain.includes('takeuforward.org')) {
      if (originalUrl.includes('interview')) {
        return 'Interview Course';
      } else if (originalUrl.includes('striver')) {
        return 'Striver Course';
      } else {
        return 'TakeUForward';
      }
    } else if (domain.includes('codehelp.in')) {
      return 'CodeHelp Course';
    } else if (domain.includes('github.com')) {
      return 'GitHub';
    } else {
      // Extract domain name and capitalize
      const domainName = domain.split('.')[0];
      return domainName.charAt(0).toUpperCase() + domainName.slice(1);
    }
  } catch (error) {
    return 'Link';
  }
};


const LinkCard = ({ url, executeFetchAllUrlFunction }) => {

  const { 
    loading: loadingDeleteUrl, 
    executeCallbackFunction: executeDeleteUrlFunction
   } = useFetch(deleteUrl, url?.id);

  const downloadQrCodeImage = () => {
    const urlofQrCodeImage = url?.qr_code;
    const titleOfTheUrl = url?.title_of_url;

    const anchorElement = document.createElement('a');
    anchorElement.href = urlofQrCodeImage;
    anchorElement.download = titleOfTheUrl;

    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  }

  const copyShortUrlToClipboard = () => {

    navigator.clipboard.writeText(`${window.location.origin}/${url?.short_url}`)

    toast("short url has been successfully copied to clipboard", {
      position: 'top-right'
    });
    
  }
    
  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">

      <img 
        src={url?.qr} 
        alt='qrcode'
        className="h-32 object-contain ring ring-blue-500 self-start"
      />

      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 gap-2">

        <span className="text-xl md:text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title_of_url || generateTitleFromUrl(url?.original_url)}
        </span>

        <span className="text-lg md:text-2xl text-blue-400 font-bold hover:underline cursor-pointer break-all">
          {window.location.origin}/{url?.custom_url ? url?.custom_url : url?.short_url}
        </span>

        <span className="text-sm md:text-base flex items-center gap-1 hover:underline cursor-pointer overflow-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700">
          {url?.original_url}
        </span>

        <span className="flex items-end font-extralight text-xs md:text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>

      </Link>

      <div className="flex gap-2 self-end md:self-center">

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
          onClick={() => executeDeleteUrlFunction().then(() => executeFetchAllUrlFunction())}
        >
          { loadingDeleteUrl ? <BeatLoader size={5} color="white" /> : <Trash /> } 
        </Button>

      </div>

    </div>
  )
}

export default LinkCard;