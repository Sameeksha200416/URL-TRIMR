/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginPage from '../components/LoginPage';
import SignUpPage from '@/components/SignUpPage';
import { UrlGlobalState } from '@/context/context';

const AuthenticationPage = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const urlInputByUserInSearchParam = searchParams.get('createNew');

  const { isUserAuthenticated, loading } = UrlGlobalState();

  useEffect(() => {

    if (isUserAuthenticated && !loading) {
      navigate(`/dashboard?${urlInputByUserInSearchParam ? `createNew=${urlInputByUserInSearchParam}` : ""}`);
    }

  }, [isUserAuthenticated, loading, navigate, urlInputByUserInSearchParam]);

  return (
    <div className="mt-20 flex flex-col items-center gap-6 sm:gap-10 px-4 sm:px-0">

      <h1 className="text-2xl sm:text-3xl font-extrabold text-center">
        {urlInputByUserInSearchParam
          ? 'Hold up! Lets authenticate first'
          : 'LogIn / SignUp'}
      </h1>

      <Tabs defaultValue="logIn" className="w-full sm:w-[400px]">

        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="logIn">LogIn</TabsTrigger>
          <TabsTrigger value="SignUp">SignUp</TabsTrigger>
        </TabsList>

        <TabsContent value="logIn">
          <LoginPage />
        </TabsContent>

        <TabsContent value="SignUp">
          <SignUpPage />
        </TabsContent>

      </Tabs>

    </div>
  );
};

export default AuthenticationPage;