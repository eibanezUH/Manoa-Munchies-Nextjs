import { redirect } from 'next/navigation';
import { Role } from '@prisma/client'; // Ensure this is the role enum from Prisma

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: { user: { email: string; id: string; randomKey: string } } | null) => {
  if (!session) {
    redirect('/auth/signin');
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: { user: { email: string; id: string; randomKey: string } } | null) => {
  loggedInProtectedPage(session);

  // Check if user has the "ADMIN" role (using randomKey)
  if (session && session.user.randomKey !== 'ADMIN') {
    redirect('/not-authorized');
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not a vendor.
 */
export const vendorProtectedPage = (session: { user: { email: string; id: string; randomKey: string } } | null) => {
  loggedInProtectedPage(session);

  // Check if user has the "VENDOR" role (using randomKey)
  if (session && session.user.randomKey !== 'VENDOR') {
    redirect('/not-authorized');
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not a regular user.
 */
export const userProtectedPage = (session: { user: { email: string; id: string; randomKey: string } } | null) => {
  loggedInProtectedPage(session);

  // Check if the user role is "USER" (using randomKey)
  if (session && session.user.randomKey !== 'USER') {
    redirect('/not-authorized');
  }
};
