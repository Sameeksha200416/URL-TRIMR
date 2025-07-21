import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <main className='min-h-screen container mx-auto px-4 sm:px-6 lg:px-8'>
        <Header />
        <Outlet />
      </main>

      <footer className='bg-gray-800 py-4'>
        <div className='max-w-screen-xl mx-auto px-4 py-5 text-center text-white'>
          Made with 💖 by Sameeksha
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;