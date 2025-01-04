'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';

export const useRedirectIfAuthenticated = () => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard'); // Redirect to dashboard if authenticated
    } else {
      setIsLoading(false); // Authentication check is complete
    }
  }, [router]);

  return isLoading;
};
