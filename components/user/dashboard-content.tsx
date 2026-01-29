'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Mail, Calendar, CheckCircle } from 'lucide-react';
import { api } from '../utils';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function UserDashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    api.get('/user/me')
      .then((res) => res.data)
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <Button className='cursor-pointer' variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>View and manage your profile information</CardDescription>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <Link href="/user/profile/edit">
                  <Button className="w-full cursor-pointer">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>
          </div>          
        </div>
      </main>
    </div>
  );
}
