import { QRCode } from 'react-qrcode-logo';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UrlGlobalState } from '@/context/context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ErrorMessageComponent from './ErrorMessageComponent';
import { Card } from './ui/card';
import useFetch from '@/hooks_for_api_calls/use-fetch';
import { createUrl } from '@/supabase_apis/apiUrl';

const CreateLink = () => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const qrRef = useRef();
  const { loggedInUser } = UrlGlobalState();
  const [searchParams, setSearchParams] = useSearchParams();
  const originalUrlForParams = searchParams.get('createNew');

  const [formValues, setFormValues] = useState({
    title_of_url: "",
    original_url: originalUrlForParams ? originalUrlForParams : "",
    custom_url: ""
  });

  const {
    data,
    loading,
    error,
    executeCallbackFunction: executeCreateShortUrlFunction
  } = useFetch(createUrl, { ...formValues, user_id: loggedInUser?.id });

  useEffect(() => {
  if (error === null && Array.isArray(data) && data[0]?.id) {
    navigate(`/link/${data[0].id}`);
  }
}, [error, data, navigate]);

  const schemaForCreateLinkForm = yup.object().shape({
    title_of_url: yup.string().required('URL title is required'),
    original_url: yup.string().url('Enter a valid URL').required('URL is required'),
    custom_url: yup.string()
  });

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value
    });
  };

  const createNewurlAndStoreItInSupabase = async () => {
    try {
      setErrors([]);
      console.log("=== CreateLink Debug ===");
      console.log("Form values before validation:", formValues);
      console.log("User ID:", loggedInUser?.id);
      
      await schemaForCreateLinkForm.validate(formValues, { abortEarly: false });
      console.log("✅ Validation passed");
      
      const qrCodeCanvas = qrRef.current.canvasRef.current;
      const qrCodeBlob = await new Promise((resolve) => qrCodeCanvas.toBlob(resolve));
      console.log("QR Code blob created:", qrCodeBlob);
      
      console.log("Final data being sent:", { 
        ...formValues, 
        user_id: loggedInUser?.id,
        qrCode: qrCodeBlob 
      });
      
      await executeCreateShortUrlFunction(qrCodeBlob);
      console.log("=== End CreateLink Debug ===");
    } catch (error) {
      console.error("CreateLink Error:", error);
      const newErrors = {};
      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      console.log("Validation errors:", newErrors); 
    }
  }

  return (
    <Dialog
      defaultOpen={!!originalUrlForParams}
      onOpenChange={(res) => {
        if (!res) {
          setSearchParams({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='destructive'>Generate New Link</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md w-full p-4'>
        <DialogHeader>
          <DialogTitle className='text-xl sm:text-2xl font-bold'>Generate New Link</DialogTitle>
          <DialogDescription>
    Create a shortened URL with optional custom name and QR code.
  </DialogDescription>
        </DialogHeader>

        {formValues?.original_url && (
          <div className='flex justify-center mb-4'>
            <QRCode
              ref={qrRef}
              value={formValues?.original_url}
              size={200} // Adjusted size for better mobile display
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        )}

        <Input
          id="title_of_url"
          type="text"
          value={formValues.title_of_url}
          onChange={handleInputChange}
          placeholder="Enter a title of your choice for the link"
          className='w-full mb-2'
        />
        {errors?.title_of_url && <ErrorMessageComponent message={errors?.title_of_url} />}

        <Input
          id="original_url"
          type="url"
          value={formValues.original_url}
          onChange={handleInputChange}
          placeholder="Enter the URL to be shortened"
          className='w-full mb-2'
        />
        {errors?.original_url && <ErrorMessageComponent message={errors?.original_url} />}

        <div className='flex items-center gap-2 mb-2'>
          <Card className='p-2 w-3/4 sm:w-auto'>
            {window.location.origin}
          </Card> /

          <Input
            id="custom_url"
            type="text"
            value={formValues.custom_url}
            onChange={handleInputChange}
            placeholder="Enter a custom link name (optional)"
            className='w-full'
          />
        </div>

        <DialogFooter className='flex justify-center sm:justify-start'>
          <Button
            variant='destructive'
            onClick={createNewurlAndStoreItInSupabase}
            disabled={loading}
            className='w-full sm:w-auto'
          >
            {loading ? <BeatLoader size={10} color="white" /> : <span>Create</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;