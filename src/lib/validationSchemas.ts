import * as Yup from 'yup';

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

// Other schemas remain unchanged
export const AddUserProfileSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  foodPreferences: Yup.array().of(Yup.string()).nullable(),
  foodAversions: Yup.array().of(Yup.string()).nullable(),
});
