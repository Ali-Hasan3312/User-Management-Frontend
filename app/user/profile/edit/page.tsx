'use client';

import { UserGaurd } from '@/components/user-gaurd';
import { UserProfileEditContent } from './edit-content';

export default function UserProfileEditPage() {
  return (
    <UserGaurd>
      <UserProfileEditContent />
    </UserGaurd>
  );
}
