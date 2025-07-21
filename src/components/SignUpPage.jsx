/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import ErrorMessageComponent from './ErrorMessageComponent';
import useFetch from '@/hooks_for_api_calls/use-fetch';
import { signUpUserInSupabase } from '@/supabase_apis/apiAuth';
import { UrlGlobalState } from '@/context/context';
import { checkStorageBucketSetup, testImageUpload } from '@/utils/storageDebug';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: null,
  });

  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const inputUrlByUserFromParams = searchParams.get('createNew');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));

    // Debug storage setup when file is selected
    if (name === 'profile_pic' && files && files[0]) {
      console.log("Profile picture selected:", files[0]);
      checkStorageBucketSetup();
      testImageUpload(files[0]).then(success => {
        console.log("Test upload result:", success);
      });
    }
  };

  const {
    data,
    error,
    loading,
    executeCallbackFunction: executeSignUpToSupabaseFunction,
  } = useFetch(signUpUserInSupabase, formData);

  const { fetchCurrentLoggedInUserFromSupabase } = UrlGlobalState();

  useEffect(() => {
    if (error === null && data) {
      navigate(
        `/dashboard?${
          inputUrlByUserFromParams
            ? `createNew=${inputUrlByUserFromParams}`
            : ''
        }`
      );

      fetchCurrentLoggedInUserFromSupabase();
    }
  }, [data, error, navigate, fetchCurrentLoggedInUserFromSupabase, inputUrlByUserFromParams]);

  const handleSignUp = async () => {
    setErrors([]);

    try {
      const formValidationSchema = Yup.object().shape({
        name: Yup.string()
          .min(4, 'fullname should be minimum of 4 characters')
          .required('fullname is required'),
        email: Yup.string()
          .email('invalid email address')
          .required('email address is required'),
        password: Yup.string()
          .min(6, 'password should be minimum of 6 characters')
          .required('password is required'),
        profile_pic: Yup.mixed().required('Profile picture is required'),
      });

      await formValidationSchema.validate(formData, { abortEarly: false });
      console.log(formData.profile_pic);
      await executeSignUpToSupabaseFunction();

    } catch (error) {
      console.log(error);

      const newErrors = {};

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card className="w-full sm:w-[400px] mx-4 sm:mx-auto">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Signup</CardTitle>

        <CardDescription className="text-sm sm:text-base">Create your account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col">
        <div className="space-y-2">
          <Input
            name="name"
            type="text"
            placeholder="Enter your full name"
            onChange={handleInputChange}
            className="w-full"
          />

          {errors?.name && <ErrorMessageComponent message={errors?.name} />}
        </div>

        <div className="space-y-2">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email address"
            onChange={handleInputChange}
            className="w-full"
          />

          {errors?.email && <ErrorMessageComponent message={errors?.email} />}
        </div>

        <div className="space-y-2">
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleInputChange}
            className="w-full"
          />

          {errors?.password && <ErrorMessageComponent message={errors?.password} />}
        </div>

        <div className="space-y-2">
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full"
          />
          
          {formData.profile_pic && (
            <div className="text-sm text-green-600">
              ✅ Selected: {formData.profile_pic.name}
            </div>
          )}

          {errors?.profile_pic && <ErrorMessageComponent message={errors?.profile_pic} />}
        </div>
      </CardContent>

      <CardFooter className="w-full mt-4">
        <Button className="w-full" onClick={handleSignUp} disabled={loading}>
          {loading ? (
            <BeatLoader size={10} color="#2E073F" />
          ) : (
            'Create Account'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUpPage;