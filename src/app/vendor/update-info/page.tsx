/* eslint-disable import/extensions */
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import authOptions from '@/lib/authOptions';
import { vendorProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import VendorInfoForm from '@/components/VendorInfoForm';

export default async function VendorUpdateInfoPage() {
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
    const location = formData.get('location') as string;
    const cuisine = (formData.get('cuisine') as string).split(',').map((c) => c.trim());
    const operatingHours = {
      monday: formData.get('monday-open') && formData.get('monday-close')
        ? { open: formData.get('monday-open') as string, close: formData.get('monday-close') as string }
        : null,
      tuesday: formData.get('tuesday-open') && formData.get('tuesday-close')
        ? { open: formData.get('tuesday-open') as string, close: formData.get('tuesday-close') as string }
        : null,
      wednesday: formData.get('wednesday-open') && formData.get('wednesday-close')
        ? { open: formData.get('wednesday-open') as string, close: formData.get('wednesday-close') as string }
        : null,
      thursday: formData.get('thursday-open') && formData.get('thursday-close')
        ? { open: formData.get('thursday-open') as string, close: formData.get('thursday-close') as string }
        : null,
      friday: formData.get('friday-open') && formData.get('friday-close')
        ? { open: formData.get('friday-open') as string, close: formData.get('friday-close') as string }
        : null,
      saturday: formData.get('saturday-open') && formData.get('saturday-close')
        ? { open: formData.get('saturday-open') as string, close: formData.get('saturday-close') as string }
        : null,
      sunday: formData.get('sunday-open') && formData.get('sunday-close')
        ? { open: formData.get('sunday-open') as string, close: formData.get('sunday-close') as string }
        : null,
    };

    await prisma.vendor.update({
      where: { id: user.vendor.id },
      data: { name, location, cuisine, operatingHours },
    });

    redirect('/vendor');
  }

  // eslint-disable-next-line react/jsx-no-bind
  return <VendorInfoForm vendor={user.vendor} handleSubmit={handleSubmit} />;
}
