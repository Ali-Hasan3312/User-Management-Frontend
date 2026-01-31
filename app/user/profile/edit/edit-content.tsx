'use client';

import React from "react";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from "@/components/utils";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";


export function UserProfileEditContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    

    api.get('/user/me')
      .then((res) => res.data)
      .then((data) => {
        setName(data.user.name);
        setEmail(data.user.email);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {

      const response = await api.put('/user/me', {
          name,
          email,
          password: newPassword || undefined,
      });

      const data = await response.data;

      if (!response.data) {
        toast.error(data.message || 'Failed to update profile');
        return;
      }

      toast.success('Profile updated successfully!');
      setNewPassword('');
      setConfirmPassword('');

      
    } catch (err) {
      if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("Something went wrong");
  }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-6">                  
                  <div className="space-y-4">

                    <div>
                      <label className="text-sm font-medium">New Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button type="submit" disabled={saving} className="cursor-pointer">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button className="cursor-pointer" type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
