import React from 'react';
import { TbLoader3 } from 'react-icons/tb';

type LoadingButtonProps = {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  type = 'button',
  loading,
  children,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg 
                  hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled || loading}
    >
      {loading && <TbLoader3 className="loader mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default LoadingButton;
