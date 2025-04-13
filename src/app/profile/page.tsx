// src/app/profile/page.tsx
import React from 'react';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';
import { redirect } from 'next/navigation'; // Add this
import { getUserPreferences } from '@/lib/dbActions';
import UserPreferencesForm from '../../components/UserPreferencesForm';

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
