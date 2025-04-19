import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import UserDashboard from '@/components/UserDashboard';

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
          location: true, // include location field from Vendor table
        },
      },
    },
  });

  const formattedItems = menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    cuisine: item.cuisine,
    ingredients: item.ingredients,
    vendor: {
      id: item.vendor.id,
      name: item.vendor.name,
      location: item.vendor.location, // add location field
    },
  }));

  return <UserDashboard menuItems={formattedItems} />;
}
