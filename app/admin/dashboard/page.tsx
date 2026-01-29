'use client';

import AdminGuard from '@/components/admin-gaurd';
import { AdminDashboardContent } from './dashboard-content';

export default function AdminDashboardPage() {
  return (
    <AdminGuard >
      <AdminDashboardContent />
    </AdminGuard>
  );
}
