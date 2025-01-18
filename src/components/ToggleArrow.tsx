'use client';

import React from 'react';
import { TbArrowAutofitRight, TbArrowAutofitLeft } from "react-icons/tb";

type ToggleArrowProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

const ToggleArrow: React.FC<ToggleArrowProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`absolute flex items-center justify-center z-10 top-4 left-4 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300`}
      style={{
        position: 'fixed',
        top: '16px',
        left: sidebarOpen ? '16px' : '',
        zIndex: 10,
      }}
    >
      <button onClick={toggleSidebar}>
        {sidebarOpen ? <TbArrowAutofitLeft fontSize="medium" /> : <TbArrowAutofitRight fontSize="medium" />}
      </button>
    </div>
  );
};

export default ToggleArrow;
