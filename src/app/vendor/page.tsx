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
    include: { vendor: true },
  });

  if (!user || !user.vendor) {
    return (
      <main>
        <div>Vendor profile not found.</div>
      </main>
    );
  }

  return <VendorDashboard vendor={user.vendor} />;
}