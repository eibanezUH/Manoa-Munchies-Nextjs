// src/lib/page-protection.ts
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';

export const loggedInProtectedPage = (session: Session | null) => {
  if (!session || !session.user) {
    redirect('/auth/signin');
  }
};

export const adminProtectedPage = (session: Session | null) => {
  loggedInProtectedPage(session);
  if (session?.user.randomKey !== 'ADMIN') {
    redirect('/not-authorized');
  }
};

export async function vendorProtectedPage(session: Session | null) {
  loggedInProtectedPage(session);
  if (session?.user.randomKey !== 'VENDOR') {
    redirect('/not-authorized');
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      vendor: true, // Fetch vendor relation
    },
  });
  if (!user || !user.vendor) {
    redirect('/vendor');
  }
  return user;
}

export const userProtectedPage = (session: Session | null) => {
  loggedInProtectedPage(session);
  if (session?.user.randomKey !== 'USER') {
    redirect('/not-authorized');
  }
};
