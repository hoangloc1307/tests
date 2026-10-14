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
