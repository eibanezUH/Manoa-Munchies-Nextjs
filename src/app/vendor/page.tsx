/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { vendorProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import VendorDashboard from '@/components/VendorDashboard';

export default async function VendorPage() {
  const session = await getServerSession(authOptions);
  vendorProtectedPage(session);

  let user;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      user = await prisma.user.findUnique({
        where: { email: session?.user?.email },
        include: {
          vendor: {
            include: {
              menuItems: true, // ✅ fetch full MenuItem objects
            },
          },
        },
      });
      break;
    } catch (error) {
      console.error(`Vendor page query attempt ${attempt + 1} failed:`, error);
      if (attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!user || !user.vendor) {
    return (
      <main>
        <div>Vendor profile not found.</div>
      </main>
    );
  }

  // If needed, transform vendor (optional)
  const vendor = {
    id: user.vendor.id,
    name: user.vendor.name,
    location: user.vendor.location,
    cuisine: user.vendor.cuisine || [],
    operatingHours: user.vendor.operatingHours as {
      [key: string]: { open: string; close: string } | null;
    } | null,
  };

  return <VendorDashboard vendor={vendor} menuItems={user.vendor.menuItems} />;
}
