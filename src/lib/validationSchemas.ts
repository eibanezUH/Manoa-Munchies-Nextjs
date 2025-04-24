import * as Yup from 'yup';

export type UserPreferencesFormData = {
  foodPreferences: { value: string }[];
  foodAversions: { value: string }[];
};

export const UserPreferencesSchema = Yup.object({
  foodPreferences: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required('Preference cannot be empty'),
      }),
    )
    .min(1, 'At least one preference is required'),
  foodAversions: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required('Aversion cannot be empty'),
      }),
    )
    .nullable(),
});

export const AddUserProfileSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  foodPreferences: Yup.array().of(Yup.string()).nullable(),
  foodAversions: Yup.array().of(Yup.string()).nullable(),
});

export type AddMenuItemFormData = {
  name: string;
  description?: string | null;
  price: number;
  category: string;
  cuisine: string;
  ingredients: { value: string }[];
  isSpecial: boolean;
  specialDays: string[];
};

export const AddMenuItemSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().nullable(),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  category: Yup.string().required('Category is required'),
  cuisine: Yup.string().required('Cuisine is required'),
  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required('Ingredient cannot be empty'),
      }),
    )
    .required('Ingredients are required')
    .min(1, 'At least one ingredient is required'),
  isSpecial: Yup.boolean().required('Please specify if this is a special'),
  specialDays: Yup.array()
    .of(Yup.string().required('Day cannot be empty'))
    .required('Special days must be an array') // Ensure it's always an arrayYu
    .when('isSpecial', {
      is: true,
      then: (schema) => schema.min(1, 'At least one day is required for specials'),
      otherwise: (schema) => schema.min(0), // Allow empty array when not a special
    }),
});

export const EditMenuSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().nullable(),
  ingredients: Yup.array().of(Yup.object().shape({
    value: Yup.string().required(),
  })).nullable(),
  price: Yup.string().required('Price is required'),
  category: Yup.string().required('Category is required'),
  cuisine: Yup.string().optional(), // Make cuisine optional
});
