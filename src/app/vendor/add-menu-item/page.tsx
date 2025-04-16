/* eslint-disable import/extensions */
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { vendorProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import MenuItemForm from '@/components/AddMenuItemForm';

export default async function AddMenuItemPage() {
  const session = await getServerSession(authOptions);
  vendorProtectedPage(session);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email },
    include: { vendor: true },
  });

  if (!user || !user.vendor) {
    redirect('/vendor');
  }

  async function handleSubmit(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const cuisine = formData.get('cuisine') as string;
    const ingredients = (formData.get('ingredients') as string).split(',').map((i) => i.trim());
    const isSpecial = formData.get('isSpecial') === 'true'; // Convert string to boolean
    const specialDays = (formData.get('specialDays') as string).split(',').filter(Boolean); // Handle empty string

    await prisma.menuItem.create({
      data: {
        name,
        description: description || undefined,
        price,
        category,
        cuisine,
        ingredients,
        vendorId: user!.vendor!.id,
        isSpecial, // New field
        specialDays, // New field
      },
    });

    redirect('/vendor');
  }

  // eslint-disable-next-line react/jsx-no-bind
  return <MenuItemForm handleSubmit={handleSubmit} />;
}
