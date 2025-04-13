// src/app/admin/add-vendor/page.tsx
import { getServerSession } from 'next-auth/next';
// eslint-disable-next-line import/extensions
import { revalidatePath } from 'next/cache';
// eslint-disable-next-line import/extensions
import { redirect } from 'next/navigation'; // Ensure this import is present
// eslint-disable-next-line import/extensions
import authOptions from '@/lib/authOptions';
// eslint-disable-next-line import/extensions
import { adminProtectedPage } from '@/lib/page-protection';
// eslint-disable-next-line import/extensions
import { convertUserToVendor, getAllUsers } from '@/lib/dbActions';
// eslint-disable-next-line import/extensions
import AddVendorForm from '@/components/AddVendorForm';

export default async function AddVendorPage() {
  const session = await getServerSession(authOptions);
  console.log('AddVendorPage Session:', session); // Debug the session
  adminProtectedPage(session);

  // Fetch all users with role USER
  const users = await getAllUsers();

  // Handle form submission
  async function handleSubmit(formData: FormData) {
    'use server';

    const userEmail = formData.get('userEmail') as string;
    const name = formData.get('name') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const location = formData.get('address') as string;

    await convertUserToVendor(userEmail, { name, phoneNumber, location });
    revalidatePath('/admin');
    redirect('/admin');
  }

  // eslint-disable-next-line react/jsx-no-bind
  return <AddVendorForm users={users} handleSubmit={handleSubmit} />;
}
