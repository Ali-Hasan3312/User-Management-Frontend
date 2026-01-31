'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { api } from '@/components/utils';
import {
    CheckCircle,
    Clock,
    Lock,
    LockOpen,
    LogOut,
    Mail,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  isBlocked: boolean;
  createdAt: string;
}

export function AdminDashboardContent() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/allUsers');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: number) => {
    setActionLoading(userId);
    

    try {
      const response = await api.put(`/admin/block/${userId}`);

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      await fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("Something went wrong");
  }
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === 'ALL' || user.role === roleFilter;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !user.isBlocked) ||
      (statusFilter === 'BLOCKED' && user.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background lg:px-20">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-lg lg:text-2xl font-bold">Admin Dashboard</h1>
          </div>

          <div className="flex gap-2">
            <Link href="/admin/profile/edit">
              <Button className='cursor-pointer' variant="outline" size="sm">Edit Profile</Button>
            </Link>
            <Button className='cursor-pointer' variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{users.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {users.filter((u) => !u.isBlocked).length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Blocked Users</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {users.filter((u) => u.isBlocked).length}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 w-full md:w-1/3"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'ADMIN' | 'USER')}
            className="border cursor-pointer rounded-md px-3 py-2 w-full md:w-1/5"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'BLOCKED')}
            className="border cursor-pointer rounded-md px-3 py-2 w-full md:w-1/5"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage users and access</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>

                    <TableCell className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </TableCell>

                    <TableCell className="capitalize">{user.role}</TableCell>

                    <TableCell>
                      {user.isBlocked ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Blocked
                        </span>
                      ) : (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Active
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Clock className="inline h-4 w-4 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {user.isBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBlockUser(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          <LockOpen className="h-3 w-3 mr-1" />
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className='cursor-pointer'
                          variant="destructive"
                          disabled={user.role === 'ADMIN'}
                          onClick={() => handleBlockUser(user.id)}
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          Block
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
