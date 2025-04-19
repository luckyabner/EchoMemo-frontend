"use client";
import { useAuth } from "@/hooks/useAuth";
import { LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LoginAndLogout() {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (!window.confirm("确定要退出登录吗？")) {
        return;
      }
      await logout();
      window.location.reload();
    } catch (error) {
      console.error("登出失败:", error);
      alert("登出失败，请稍后重试");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="cursor-pointer" onClick={handleLogout} title="退出登录">
        <LogOutIcon />
      </div>
    );
  } else {
    return (
      <Link href={"/login"} title="登录">
        <LogInIcon />
      </Link>
    );
  }
}
