"use client";
import { resetPasswordApi } from "@/server/authServer";
import { registerSchema } from "@/utils/schemas";
import React, { useState } from "react";
import { z } from "zod";

export default function ResetPasswordForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 清除之前的错误
    setErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      // 将 FormData 转换为普通对象
      const formValues = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("new_password") as string,
      };

      registerSchema.parse(formValues);

      const res = await resetPasswordApi(formData);
      if (res?.success) {
        setSuccess(true);
        // 显示成功消息并延迟跳转到登录页面
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // 2秒后跳转
      } else {
        setErrors({ server: res?.message || "注册失败" });
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
        console.error("Registration error:", error);
      }
    }
  }

  return (
    <div className="card bg-base-100 bg-opacity-70 w-96 border shadow-xl backdrop-blur-sm">
      <div className="card-body">
        <div className="mb-8 text-center">
          <h2 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            重置密码
          </h2>
          <p className="text-base-content/70 mt-1 text-sm">
            请填写以下信息重置您的密码
          </p>
        </div>
        <form
          className="flex flex-col items-center gap-5"
          onSubmit={handleReset}
        >
          {success && (
            <div className="alert alert-success shadow-sm">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">
                重置密码成功，即将跳转到登录页面...
              </span>
            </div>
          )}
          <label className="floating-label relative w-full">
            <span className="text-base-content/80 text-sm">用户名</span>
            <div className="relative">
              <input
                name="username"
                className={`input input-bordered w-full pr-10 transition-all duration-200 ${errors.username ? "input-error" : "focus:border-primary"}`}
                type="text"
                placeholder="请输入用户名"
                required
                disabled={success}
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
            <span className="text-base-content/80 text-sm">邮箱</span>
            <div className="relative">
              <input
                name="email"
                className={`input input-bordered w-full pr-10 transition-all duration-200 ${errors.email ? "input-error" : "focus:border-primary"}`}
                type="email"
                placeholder="请输入邮箱"
                required
                disabled={success}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            {errors.email && (
              <div className="text-error mt-1 text-xs">{errors.email}</div>
            )}
          </label>

          <label className="floating-label relative w-full">
            <span className="text-base-content/80 text-sm">新密码</span>
            <div className="relative">
              <input
                name="new_password"
                className={`input input-bordered w-full pr-10 transition-all duration-200 ${errors.password ? "input-error" : "focus:border-primary"}`}
                type="password"
                placeholder="请输入新密码"
                required
                disabled={success}
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
              disabled={success}
            >
              重置密码
            </button>
            <div className="divider text-base-content/50 text-xs">返回</div>
            <a
              href="/login"
              className="btn btn-outline w-full transition-all duration-200 hover:shadow-md"
            >
              返回登录
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
