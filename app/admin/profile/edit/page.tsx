'use client';

import AdminGuard from '@/components/admin-gaurd';
import { AdminProfileEditContent } from './edit-content';

export default function AdminProfileEditPage() {
  return (
    <AdminGuard>
      <AdminProfileEditContent />
    </AdminGuard>
  );
}
