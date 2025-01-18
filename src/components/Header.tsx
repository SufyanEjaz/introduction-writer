import React, { useState } from 'react';
import { logout } from '../utils/auth';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Remove token and logout user
    router.push('/auth/login'); // Redirect to login page
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold text-center flex-1">Dashboard</h1>
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
