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
import { loginUserInSupabase } from '@/supabase_apis/apiAuth';
import { UrlGlobalState } from '@/context/context';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const inputUrlByUserFromParams = searchParams.get('createNew');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {
    data,
    error,
    loading,
    executeCallbackFunction: executeLoginToSupabaseFunction,
  } = useFetch(loginUserInSupabase, formData);

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

  const handleLogin = async () => {
    setErrors([]);

    try {
      const formValidationSchema = Yup.object().shape({
        email: Yup.string()
          .email('invalid email address')
          .required('email address is required'),
        password: Yup.string()
          .min(6, 'password should be minimum of 6 characters')
          .required('password is required'),
      });

      await formValidationSchema.validate(formData, { abortEarly: false });

      await executeLoginToSupabaseFunction();
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
    <Card className="w-full sm:w-[400px] mx-4 sm:mx-0">
      <CardHeader>
        <CardTitle>Login</CardTitle>

        <CardDescription>log in to your account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 flex flex-col gap-3">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="enter your email address"
            onChange={handleInputChange}
          />

          {errors?.email && <ErrorMessageComponent message={errors?.email} />}
        </div>

        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="enter your password"
            onChange={handleInputChange}
          />

          {errors?.password && <ErrorMessageComponent message={errors?.password} />}
        </div>
      </CardContent>

      <CardFooter className="my-3 w-full">
        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? <BeatLoader size={10} color="#2E073F" /> : 'Login'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;