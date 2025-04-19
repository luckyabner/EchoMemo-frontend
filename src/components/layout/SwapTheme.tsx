"use client";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function SwapTheme() {
  const [theme, setTheme] = useState<"cupcake" | "dark">("cupcake");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 从 localStorage 获取保存的主题
    const savedTheme = localStorage.getItem("theme") as "cupcake" | "dark";
    if (savedTheme && (savedTheme === "cupcake" || savedTheme === "dark")) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // 如果没有保存的主题，检查系统偏好
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const initialTheme = prefersDark ? "dark" : "cupcake";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "cupcake" ? "dark" : "cupcake";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // 添加页面过渡效果
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 800);
  };

  if (!mounted) {
    return <div className="h-10 w-10"></div>; // 避免水合不匹配
  }

  return (
    <div className="relative">
      <label className="swap swap-rotate bg-base-200 hover:bg-base-300 cursor-pointer rounded-full p-2 shadow-sm transition-all duration-300">
        {/* 隐藏的复选框控制状态 */}
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
          className="hidden"
        />

        {/* 太阳图标 */}
        <Sun
          className={`swap-on h-5 w-5 text-yellow-500 ${theme === "dark" ? "rotate-0" : "rotate-90"} transition-all duration-500`}
        />

        {/* 月亮图标 */}
        <Moon
          className={`swap-off h-5 w-5 text-blue-500 ${theme === "dark" ? "rotate-90" : "rotate-0"} transition-all duration-500`}
        />

        {/* 主题指示器 */}
        <span className="sr-only">
          {theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
        </span>
      </label>
    </div>
  );
}
