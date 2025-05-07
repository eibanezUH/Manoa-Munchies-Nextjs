/* eslint-disable @typescript-eslint/no-shadow */
// src/lib/dbActions.ts

'use server';

import { hash } from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { redirect } from 'next/navigation';
import { MenuItem } from '@prisma/client';
import { prisma } from './prisma';

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  const now = new Date(); // Capture current time once
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
      createdAt: now, // Explicitly set createdAt
      updatedAt: now, // Set updatedAt to match createdAt
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Creates or updates a user profile in the database.
 * @param email, the user's email.
 * @param foodPreferences, an array of food preferences.
 * @param foodAversions, an array of food aversions.
 */
export async function upsertUserProfile(
  email: string,
  foodPreferences: string[] = [],
  foodAversions: string[] = [],
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return await prisma.user.update({
        where: { email },
        data: {
          foodPreferences,
          foodAversions,
        },
      });
    }
    throw new Error('User not found');
  } catch (error) {
    console.error('Error in upsertUserProfile:', error);
    throw new Error('User profile update failed');
  }
}

/**
 * Fetches a user's preferences and aversions.
 * @param email, the user's email.
 */
export async function getUserPreferences(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { foodPreferences: true, foodAversions: true },
    });
    if (!user) throw new Error('User not found');
    return {
      foodPreferences: user.foodPreferences || [],
      foodAversions: user.foodAversions || [],
    };
  } catch (error) {
    console.error('Error in getUserPreferences:', error);
    throw new Error('Failed to fetch user preferences');
  }
}

/**
 * Creates or updates a vendor profile in the database.
 * @param vendorId, the vendor's unique ID.
 * @param name, the vendor's name.
 * @param description, the vendor's description.
 * @param location, the vendor's location.
 */
export async function upsertVendorProfile(
  vendorId: number,
  name: string,
  description: string,
  location: string,
  email: string,
) {
  try {
    const existingVendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (existingVendor) {
      return await prisma.vendor.update({
        where: { id: vendorId },
        data: { name, description, location, email },
      });
    }
    return await prisma.vendor.create({
      data: { id: vendorId, name, description, location, email },
    });
  } catch (error) {
    console.error('Error in upsertVendorProfile:', error);
    throw new Error('Vendor profile update failed');
  }
}

/**
 * Converts a user to a vendor by updating their role and creating a vendor profile.
 * @param userEmail, the email of the user to convert.
 * @param vendorData, the vendor details (name, phoneNumber, address).
 */
export async function convertUserToVendor(
  userEmail: string,
  vendorData: { name: string; phoneNumber?: string; location?: string },
) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }

    // Check if vendor email is already taken
    const existingVendor = await prisma.vendor.findUnique({ where: { email: userEmail } });
    if (existingVendor) {
      throw new Error(`Vendor with email ${userEmail} already exists`);
    }

    // Run transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new vendor profile
      const newVendor = await prisma.vendor.create({
        data: {
          name: vendorData.name,
          email: userEmail,
          phoneNumber: vendorData.phoneNumber,
          location: vendorData.location,
        },
      });

      // Update the user's role to VENDOR and link to the new vendor
      const updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: {
          role: 'VENDOR',
          vendorId: newVendor.id,
        },
      });

      return { updatedUser, newVendor };
    });

    return result.newVendor;
  } catch (error) {
    console.error('Error in convertUserToVendor:', error);
    throw error instanceof Error ? error : new Error('Failed to convert user to vendor');
  }
}

/**
 * Fetches all users with role USER for admin to select from.
 */
export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      where: { role: 'USER' },
      select: { id: true, email: true },
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function editMenu(menuItem: MenuItem | any) {
  const ingredientsArray = Array.isArray(menuItem.ingredients)
    ? menuItem.ingredients
    : menuItem.ingredients.split(',').map((i: string) => i.trim());

  await prisma.menuItem.update({
    where: { id: menuItem.id },
    data: {
      name: menuItem.name,
      description: menuItem.description,
      ingredients: ingredientsArray,
      price: menuItem.price,
    },
  });
  redirect('/vendor');
}

export async function deleteMenuItem(id: number) {
  await prisma.menuItem.delete({
    where: { id },
  });
  redirect('/vendor');
}
