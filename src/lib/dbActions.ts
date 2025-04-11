// src/lib/dbActions.ts
'use server';

import { Stuff, Condition, User, Vendor } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  await prisma.stuff.delete({
    where: { id },
  });
  redirect('/list');
}

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
  foodAversions: string[] = []
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
    } else {
      throw new Error('User not found');
    }
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
  vendorId: string,
  name: string,
  description: string,
  location: string
) {
  try {
    const existingVendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (existingVendor) {
      return await prisma.vendor.update({
        where: { id: vendorId },
        data: { name, description, location },
      });
    } else {
      return await prisma.vendor.create({
        data: { id: vendorId, name, description, location },
      });
    }
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
  vendorData: { name: string; phoneNumber?: string; address?: string }
) {
  try {
    // Start a transaction to ensure atomicity
    const [updatedUser, newVendor] = await prisma.$transaction([
      // Update the user's role to VENDOR
      prisma.user.update({
        where: { email: userEmail },
        data: { role: 'VENDOR' },
      }),
      // Create a new vendor profile
      prisma.vendor.create({
        data: {
          name: vendorData.name,
          email: userEmail,
          phoneNumber: vendorData.phoneNumber,
          address: vendorData.address,
        },
      }),
    ]);

    // Link the user to the vendor
    await prisma.user.update({
      where: { email: userEmail },
      data: { vendorId: newVendor.id },
    });

    return newVendor;
  } catch (error) {
    console.error('Error in convertUserToVendor:', error);
    throw new Error('Failed to convert user to vendor');
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
