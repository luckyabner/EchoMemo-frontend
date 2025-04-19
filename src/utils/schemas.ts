import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, "用户名至少2个字符"),
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少6个字符"),
});

export const loginSchema = z.object({
  username: z.string().min(2, "用户名至少2个字符"),
  password: z.string().min(6, "密码至少6个字符"),
});

export const aiStyleSchema = z.object({
  name: z.string().min(2, "风格名称至少2个字符"),
  description: z.string().min(2, "风格描述至少2个字符"),
  prompt: z.string().min(2, "风格提示至少2个字符"),
});
