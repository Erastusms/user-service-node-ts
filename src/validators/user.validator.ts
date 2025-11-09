import { z } from 'zod';

// 🔹 Enum optional — kalau gender terbatas
const genderEnum = z.enum(['male', 'female', 'other']).optional();

// 🔹 Schema dasar user
export const userBaseSchema = z.object({
  username: z
    .string({ message: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters'),
  email: z
    .string({ message: 'Email is required' })
    .email('Invalid email format'),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, 'Phone number must be between 10–15 digits')
    .optional()
    .nullable(),
  fullName: z
    .string({ message: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters'),
  gender: genderEnum,
  dateOfBirth: z
    .preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date().optional().nullable()
    )
    .refine(
      (date) => !date || !isNaN(date.getTime()),
      'Invalid date format — must be ISO-8601 or valid Date'
    ),
  address: z.string().max(255).optional().nullable(),
  avatarUrl: z.string().url('Invalid URL format').optional().nullable(),
  isActive: z.boolean().optional(),
});

// 🔹 Create user schema
export const createUserSchema = userBaseSchema.strict();

// 🔹 Update user schema — semua optional
export const updateUserSchema = userBaseSchema.partial().strict();

// 🔹 Query/search user schema
export const queryUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  isActive: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

// 🔹 Type helpers
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type QueryUserDto = z.infer<typeof queryUserSchema>;
