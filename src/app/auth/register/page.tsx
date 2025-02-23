"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { register } from '../../../services/authService';
import { useRedirectIfAuthenticated } from '../../../hooks/useRedirectIfAuthenticated';

const Register = () => {
  const isLoading = useRedirectIfAuthenticated(); // Get loading state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm_password?: string;
    name?: string;
    apiError?: string;
  }>({});
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});
    const customError =
      'An error occurred while registration. Please use valid data.';

    try {
      const data = await register(email, password, name, confirm_password);
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const apiErrors = error.response.data.errors;
          setErrors({
            name: apiErrors.name ? apiErrors.name[0] : '',
            email: apiErrors.email ? apiErrors.email[0] : '',
            password: apiErrors.password ? apiErrors.password[0] : '',
            confirm_password: apiErrors.confirm_password
              ? apiErrors.confirm_password[0]
              : '',
            apiError: error.response.data.message || customError,
          });
        } else {
          setErrors({
            apiError: error.response?.data?.message || customError,
          });
        }
      } else if (error instanceof Error) {
        setErrors({ apiError: error.message });
      } else {
        setErrors({ apiError: customError });
      }
    }
  };

  const handleInputChange = (
    field: 'name' | 'email' | 'password' | 'confirm_password',
    value: string
  ) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirm_password') setConfirmPassword(value);

    setErrors((prev) => ({ ...prev, [field]: '' })); // Clear field-specific error
  };

  if (isLoading) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h1 className="text-xl font-bold mb-4">Register</h1>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            className={`w-full border rounded p-2 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className={`w-full border rounded p-2 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className={`w-full border rounded p-2 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            className={`w-full border rounded p-2 ${
              errors.confirm_password ? 'border-red-500' : 'border-gray-300'
            }`}
            value={confirm_password}
            onChange={(e) =>
              handleInputChange('confirm_password', e.target.value)
            }
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirm_password}
            </p>
          )}
        </div>

        {/* API Error Message */}
        {!(errors.email || errors.password || errors.confirm_password) &&
          errors.apiError && (
            <div className="text-red-500 text-sm mb-4">{errors.apiError}</div>
          )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Register
        </button>
      </form>

      {/* Login Redirect */}
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => router.push('/auth/login')}
          className="text-blue-500 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
