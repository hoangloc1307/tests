import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().nonempty().length(8),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginWithCardSchema = z.object({
  cardNumber: z.string().trim().nonempty(),
});

export type LoginWithCardInput = z.infer<typeof loginWithCardSchema>;

export const createRoleSchema = z.object({
  username: z.string().trim().nonempty({ message: 'auth:permission.validation.username_required' }),
  roleId: z.string().trim().nonempty({ message: 'auth:permission.validation.role_required' }),
  roleName: z.string().trim().nonempty({ message: 'auth:permission.validation.role_required' }),
  sectionId: z.string().trim().nonempty({ message: 'auth:permission.validation.section_required' }),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  id: z.string().trim().nonempty(),
  roleId: z.string().trim().nonempty({ message: 'auth:permission.validation.role_required' }),
  sectionId: z.string().trim().nonempty({ message: 'auth:permission.validation.section_required' }),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export const deleteRoleSchema = z.object({
  id: z.string().trim().nonempty(),
});

export type DeleteRoleInput = z.infer<typeof deleteRoleSchema>;

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
