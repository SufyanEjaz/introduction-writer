'use client';

import { useRouter } from 'next/navigation';
import { useRedirectIfAuthenticated } from './../hooks/useRedirectIfAuthenticated';

export default function Home() {
  const isLoading = useRedirectIfAuthenticated(); // Get loading state
  const router = useRouter();

  if (isLoading) {
    return null; // Don't render anything while checking authentication
  }
  
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-yellow-50">
        <img
          src="/intro.gif"
          alt="Animated GIF"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center bg-white">
        <h1 className="text-3xl font-bold mb-6">Get started</h1>
        <div className="flex gap-4 mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => router.push('/auth/login')}
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => router.push('/auth/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}