import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import z from 'zod';

const envSchema = z.object({
  VITE_MAIN_API: z.url({ message: 'VITE_MAIN_API phải là một URL hợp lệ' }),
  VITE_EMPLOYEE_IMAGE_URL: z
    .url({ message: 'VITE_EMPLOYEE_IMAGE_URL phải là một URL hợp lệ' })
    .optional(),
  VITE_APP_VERSION: z.string({ message: 'VITE_APP_VERSION là bắt buộc' }).regex(/^\d+\.\d+\.\d+$/, {
    message: 'VITE_APP_VERSION phải theo định dạng semver (vd: 1.0.0)',
  }),
  VITE_PORT: z.coerce
    .number({ message: 'VITE_PORT phải là một số' })
    .int({ message: 'VITE_PORT phải là số nguyên' })
    .min(1, { message: 'VITE_PORT phải nằm trong khoảng 1-65535' })
    .max(65535, { message: 'VITE_PORT phải nằm trong khoảng 1-65535' })
    .default(5173),
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const result = envSchema.safeParse(env);
  if (!result.success) {
    throw new Error(
      `\n[ENV] Biến môi trường không hợp lệ hoặc thiếu:\n${z.prettifyError(result.error)}\n`,
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: result.data.VITE_PORT,
      strictPort: true,
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '~': path.resolve(import.meta.dirname, 'src'),
      },
    },
  };
});
