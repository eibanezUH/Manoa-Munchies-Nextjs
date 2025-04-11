import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { vendorProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { redirect } from 'next/navigation';
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

    await prisma.menuItem.create({
      data: {
        name,
        description: description || undefined,
        price,
        category,
        cuisine,
        ingredients,
        vendorId: user.vendor.id,
      },
    });

    redirect('/vendor');
  }

  return <MenuItemForm handleSubmit={handleSubmit} />;
}