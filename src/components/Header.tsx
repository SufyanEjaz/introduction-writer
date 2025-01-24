'use client';

import React from 'react';
import { logout } from '@/utils/auth';  // or wherever your logout is
import { useRouter } from 'next/navigation';
import { TbArrowAutofitRight, TbArrowAutofitLeft } from 'react-icons/tb';

type HeaderProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  const router = useRouter();

  const handleLogout = () => {
    logout(); 
    router.push('/auth/login'); // Redirect to login page
  };

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between sticky top-0 z-10">
      {/* Left side: sidebar toggle + title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? (
            <TbArrowAutofitLeft size={20} />
          ) : (
            <TbArrowAutofitRight size={20} />
          )}
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Right side: Logout button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
