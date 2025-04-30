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
          location: true,
          operatingHours: true,
        },
      },
    },
  });

  const formattedItems = menuItems.map((item) => {
    const rawHours = item.vendor.operatingHours;
    const operatingHours = rawHours && typeof rawHours === 'object' && !Array.isArray(rawHours)
      ? (rawHours as Record<string, string>)
      : {};

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      cuisine: item.cuisine,
      category: item.category,
      price: item.price,
      ingredients: item.ingredients,
      vendor: {
        id: item.vendor.id,
        name: item.vendor.name,
        email: item.vendor.email ?? '',
        phoneNumber: item.vendor.phoneNumber ?? '',
        location: item.vendor.location ?? '',
        operatingHours,
      },
      isSpecial: item.isSpecial,
      specialDays: item.specialDays,
    };
  });

  return (
    <TopPicksBoard
      menuItems={formattedItems}
      userPreferences={userPreferences}
      userAversions={userAversions}
    />
  );
}
