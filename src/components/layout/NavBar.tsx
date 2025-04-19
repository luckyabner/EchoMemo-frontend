"use client";
import Link from "next/link";
import React from "react";
import SwapTheme from "./SwapTheme";
import LoginAndLogout from "../auth/LoginAndLogout";
import { Menu } from "lucide-react";
import { useGlobalState } from "@/hooks/useGlobalState";

export default function NavBar() {
  const { toggleSidebar } = useGlobalState();

  return (
    <div className="mb-8 flex items-center justify-between">
      <Link href={"/"}>
        <h1 className="font-comfortaa text-2xl font-bold">EchoMemo</h1>
      </Link>

      <div className="flex items-center gap-4">
        <SwapTheme />
        <LoginAndLogout />
        <button
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </button>
      </div>
    </div>
  );
}
