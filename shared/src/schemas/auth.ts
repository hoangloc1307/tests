import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().nonempty().length(8),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginWithCardSchema = z.object({
  cardNumber: z.string().nonempty(),
});

export type LoginWithCardInput = z.infer<typeof loginWithCardSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'auth:validation.confirmPasswordMismatch',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
