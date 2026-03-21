import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
    name: z.string().optional(),
    phone: z.string().optional(),
    role: z.nativeEnum(Role, {
      message: 'Role không hợp lệ',
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  }),
});
