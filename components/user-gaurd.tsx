'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { api } from './utils';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function UserGaurd({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log("accessToken", accessToken)
    if (!accessToken) {
      router.push('/login');
      return;
    }

    api.get('/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.data)
      .then((data) => {
        if (!data.user) {
          localStorage.removeItem('accessToken');
          router.push('/login');
          return;
        }

        if(data.user.role === "USER"){
          router.push('/');
          return;
        } else if ( data.user.role === "ADMIN") {
          router.push('/admin/dashboard');
          return;
        }

        if (data.user.isBlocked) {
          localStorage.removeItem('accessToken');
          router.push('/login');
          return;
        }

        setSession(data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        router.push('/login');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
