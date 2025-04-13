// src/lib/page-protection.ts
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

export const loggedInProtectedPage = (session: Session | null) => {
  if (!session || !session.user) {
    redirect('/auth/signin');
  }
};

export const adminProtectedPage = (session: Session | null) => {
  loggedInProtectedPage(session);
  const user = session?.user as { randomKey?: string } | undefined;
  if (user?.randomKey !== 'ADMIN') {
    redirect('/not-authorized');
  }
};

export const vendorProtectedPage = (session: Session | null) => {
  loggedInProtectedPage(session);
  const user = session?.user as { randomKey?: string } | undefined;
  if (user?.randomKey !== 'VENDOR') {
    redirect('/not-authorized');
  }
};

export const userProtectedPage = (session: Session | null) => {
  loggedInProtectedPage(session);
  const user = session?.user as { randomKey?: string } | undefined;
  if (user?.randomKey !== 'USER') {
    redirect('/not-authorized');
  }
};
