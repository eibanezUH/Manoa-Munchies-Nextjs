// src/app/admin/add-vendor/page.tsx
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';
import { adminProtectedPage } from '@/lib/page-protection';
import { convertUserToVendor, getAllUsers } from '@/lib/dbActions';
import { revalidatePath } from 'next/cache';
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
    const address = formData.get('address') as string;

    await convertUserToVendor(userEmail, { name, phoneNumber, address });
    revalidatePath('/admin');
    redirect('/admin');
  }

  return <AddVendorForm users={users} handleSubmit={handleSubmit} />;
}