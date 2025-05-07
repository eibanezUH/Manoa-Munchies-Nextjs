import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { vendorProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import VendorDashboard from '@/components/VendorDashboard';

export default async function VendorPage() {
  const session = await getServerSession(authOptions);
  vendorProtectedPage(session);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email },
    include: {
      vendor: {
        include: {
          menuItems: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              ingredients: true,
              isSpecial: true,
              specialDays: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.vendor) {
    return (
      <main>
        <div>Vendor profile not found.</div>
      </main>
    );
  }

  // Transform vendor to match expected type
  const vendor = {
    id: user.vendor.id,
    name: user.vendor.name,
    location: user.vendor.location,
    cuisine: user.vendor.cuisine || [],
    operatingHours: user.vendor.operatingHours as { [key: string]: { open: string; close: string } | null } | null,
  };

  return <VendorDashboard vendor={vendor} menuItems={user.vendor.menuItems} />;
}
