import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { MenuItem } from '@prisma/client';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import EditMenuForm from '@/components/EditMenuForm';

export default async function EditMenuPage({ params }: { params: { id: string | string[] } }) {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // If rawId is missing or can't be converted to a number, show 404
  if (!rawId || !/^\d+$/.test(rawId)) {
    return notFound();
  }

  const id = parseInt(rawId, 10);

  const menuItem: MenuItem | null = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!menuItem) {
    return notFound();
  }

  return (
    <main>
      <EditMenuForm menuItem={menuItem} />
    </main>
  );
}
