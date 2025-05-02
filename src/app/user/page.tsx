import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import UserDashboard from '@/components/UserDashboard';
import '../user.css';

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Please log in to access your dashboard.</div>;
  }

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
      ? (rawHours as Record<string, { open: string; close: string }>)
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

  return <UserDashboard menuItems={formattedItems} />;
}
