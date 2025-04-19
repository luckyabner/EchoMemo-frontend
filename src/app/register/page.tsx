import RegisterForm from "@/components/auth/RegisterForm";
import React from "react";

export default function RegisterPage() {
  return (
    <div className="bg-base-200 relative flex min-h-screen items-center justify-center px-3 py-5">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary absolute -top-20 -right-20 h-60 w-60 animate-pulse rounded-full opacity-10 blur-3xl sm:-top-40 sm:-right-40 sm:h-80 sm:w-80"></div>
        <div
          className="bg-secondary absolute -bottom-20 -left-20 h-60 w-60 animate-pulse rounded-full opacity-10 blur-3xl sm:-bottom-40 sm:-left-40 sm:h-80 sm:w-80"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="bg-accent absolute top-1/3 left-1/4 h-40 w-40 animate-pulse rounded-full opacity-10 blur-3xl sm:h-60 sm:w-60"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      <div className="z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
