// src/app/profile/page.tsx
import React from 'react';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import UserPreferencesForm from '@/components/UserPreferencesForm';
import { getUserPreferences } from '@/lib/dbActions';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/auth/signin');
  }

  const initialData = await getUserPreferences(session.user.email);

  return (
    <div>
      <h1>User Profile</h1>
      <UserPreferencesForm initialData={initialData} />
    </div>
  );
}
