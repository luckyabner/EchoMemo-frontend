"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/server/authServer";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/utils/schemas";
import { z } from "zod";

export default function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    try {
      const formData = new FormData(e.currentTarget);

      const formValues = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      };

      loginSchema.parse(formValues); // 校验表单数据

      const res = await loginApi(formData);
      if (res.success && res.token) {
        await login(formValues.username, res.token);
        router.push("/"); // 跳转到主页
      } else {
        setErrors({ server: res.message || "登录失败" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ server: "服务器错误，请稍后再试" });
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="card bg-base-100 bg-opacity-70 w-96 border shadow-xl backdrop-blur-sm">
      <div className="card-body">
        <div className="mb-8 text-center">
          <h2 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            登录
          </h2>
          <p className="text-base-content/70 mt-1 text-sm">
            欢迎回来，请登录您的账号
          </p>
        </div>
        <form
          className="flex flex-col items-center space-y-5"
          onSubmit={handleSubmit}
        >
          <label className="floating-label relative w-full">
            <span className="text-base-content/80 text-sm">用户名</span>
            <div className="relative">
              <input
                name="username"
                className={`input input-bordered w-full pr-10 transition-all duration-200 ${errors.username ? "input-error" : "focus:border-primary"}`}
                type="text"
                placeholder="请输入用户名"
                required
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-base-content/50 absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            {errors.username && (
              <div className="text-error mt-1 text-xs">{errors.username}</div>
            )}
          </label>

          <label className="floating-label relative w-full">
            <span className="text-base-content/80 text-sm">密码</span>
            <div className="relative">
              <input
                name="password"
                className={`input input-bordered w-full pr-10 transition-all duration-200 ${errors.password ? "input-error" : "focus:border-primary"}`}
                type="password"
                placeholder="请输入密码"
                required
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-base-content/50 absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            {errors.password && (
              <div className="text-error mt-1 text-xs">{errors.password}</div>
            )}
          </label>

          <div className="flex w-full justify-end">
            <Link
              href="/forgot-password"
              className="link link-hover text-primary text-xs"
            >
              忘记密码?
            </Link>
          </div>

          {errors.server && (
            <div className="alert alert-error py-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errors.server}</span>
            </div>
          )}

          <div className="card-actions mt-4 mb-2 flex w-full flex-col justify-center gap-3">
            <button
              className="btn btn-primary w-full transition-all duration-200 hover:shadow-lg"
              type="submit"
            >
              登录
            </button>
            <div className="divider text-base-content/50 text-xs">或者</div>
            <Link
              href="/register"
              className="btn btn-outline w-full transition-all duration-200 hover:shadow-md"
            >
              创建新账号
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
