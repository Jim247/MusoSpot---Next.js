'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(() => {
          router.replace('/'); // Redirect to home or your desired page
        });
      }
    }
  }, [router]);

  return <div>Signing you in...</div>;
}
