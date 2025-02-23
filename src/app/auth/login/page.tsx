"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { login } from '../../../services/authService';
import { useRedirectIfAuthenticated } from '../../../hooks/useRedirectIfAuthenticated';

const Login = () => {
  const isLoading = useRedirectIfAuthenticated(); // Get loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; apiError?: string }>({});
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    const customError = 'An error occurred while logging in. Please use valid credentials.';
    
    try {
      // const data = await login(email, password);
      const data = await login();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (error: unknown) {
      // Use Axios error guard if using Axios
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.errors) {
          const apiErrors = error.response.data.errors;
          setErrors({
            email: apiErrors.email ? apiErrors.email[0] : '',
            password: apiErrors.password ? apiErrors.password[0] : '',
            apiError: error.response.data.message || customError,
          });
        } else {
          setErrors({ apiError: error.response?.data?.message || customError });
        }
      } else if (error instanceof Error) {
        // Generic Error fallback
        setErrors({ apiError: error.message });
      } else {
        // Fallback for unknown error type
        setErrors({ apiError: customError });
      }
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: '' })); // Clear email error on change
    } else if (field === 'password') {
      setPassword(value);
      setErrors((prev) => ({ ...prev, password: '' })); // Clear password error on change
    }
  };

  if (isLoading) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className={`w-full border rounded p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className={`w-full border rounded p-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* API Error Message */}
        {!(errors.email || errors.password) && errors.apiError && (
          <div className="text-red-500 text-sm mb-4">
            {errors.apiError}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>

      {/* Register Redirect */}
      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => router.push('/auth/register')}
          className="text-blue-500 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
