import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout from './layouts/app-layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthenticationPage from './pages/AuthenticationPage';
import UrlGloalProvider from './context/context';
import ProtectedRouteComponent from './components/ProtectedRouteComponent';
import LinkUrlStatisticsPage from './pages/LinkUrlStatisticsPage';
import RedirectLink from './pages/RedirectLink';
import { Toaster } from './components/ui/sonner';


const App = () => {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        { 
          path: '/', 
          element: <LandingPage /> 
        },
        { 
          path: '/dashboard', 
          element: <ProtectedRouteComponent><Dashboard /></ProtectedRouteComponent> 
        },
        { 
          path: '/auth', 
          element: <AuthenticationPage /> 
        },
        { 
          path: '/link/:id', 
          element: <ProtectedRouteComponent><LinkUrlStatisticsPage /></ProtectedRouteComponent> 
        },
        { 
          path: '/:id', 
          element: <RedirectLink /> 
        },
      ],
    },
  ]);

  return <UrlGloalProvider>

    <RouterProvider router={router} />

    <Toaster />

  </UrlGloalProvider>
  
};

export default App;
