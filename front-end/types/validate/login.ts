import { DashboardLayout } from '@toolpad/core';
import { z } from 'zod';

export const login = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
});

export const giangVien = z.object({
  
})