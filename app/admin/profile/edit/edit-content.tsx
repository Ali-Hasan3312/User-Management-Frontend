"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/components/utils";

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function AdminProfileEditContent() {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("accessToken");

 
  useEffect(() => {

    if (!token) {
      router.replace("/login");
      return;
    }

    api
      .get("/user/me")
      .then((res) => {
        setAdmin(res.data.user);
        setName(res.data.user.name);
        setEmail(res.data.user.email);
      })
      .catch((err) => {
        console.log("err", err)
        router.replace("/login")
      })
      .finally(() => setLoading(false));
  }, [router]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      await api.put("/admin/me", {
        name,
        email,
        newPassword: newPassword || undefined,
      });

      setSuccess("Profile updated successfully!");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile");
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
          <Link href="/admin/dashboard" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Edit Admin Profile</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Input value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={saving} />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={saving}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
