'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/authService'; // or '@/utils/auth'

export const useAuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to login
      router.push('/auth/login');
    } else {
      // Otherwise, set loading to false, so the page can render
      setIsLoading(false);
    }
  }, [router]);

  // Return if still loading (so page won't render)
  return isLoading;
};
