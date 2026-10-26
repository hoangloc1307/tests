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

export const createRoleSchema = z.object({
  username: z.string().nonempty({ message: 'auth:permission.validation.username_required' }),
  roleId: z.string().nonempty({ message: 'auth:permission.validation.role_required' }),
  roleName: z.string().nonempty({ message: 'auth:permission.validation.role_required' }),
  sectionId: z.string().nonempty({ message: 'auth:permission.validation.section_required' }),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  id: z.string().nonempty(),
  roleId: z.string().nonempty({ message: 'auth:permission.validation.role_required' }),
  sectionId: z.string().nonempty({ message: 'auth:permission.validation.section_required' }),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export const deleteRoleSchema = z.object({
  id: z.string().nonempty(),
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
