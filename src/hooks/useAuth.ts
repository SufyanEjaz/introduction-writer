'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';

export const useAuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login'); // Redirect to login if not authenticated
    } else {
      setIsLoading(false); // User is authenticated, allow the page to load
    }
  }, [router]);

  return isLoading;
};
