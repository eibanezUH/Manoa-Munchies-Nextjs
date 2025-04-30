import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import TopPicksBoard from '@/components/TopPicksComp';

export default async function TopPicksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Please log in to view your top picks.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      foodPreferences: true,
      foodAversions: true,
    },
  });

  const userPreferences = user?.foodPreferences ?? [];
  const userAversions = user?.foodAversions ?? [];

  const menuItems = await prisma.menuItem.findMany({
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          operatingHours: true,
        },
      },
    },
  });

  return (
    <TopPicksBoard
      menuItems={menuItems}
      userPreferences={userPreferences}
      userAversions={userAversions}
    />
  );
}
