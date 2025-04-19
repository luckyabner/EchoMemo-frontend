"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = Cookies.get("echo_mome_username");

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername || null);
    }
  }, []);

  const login = async (username: string, token: string) => {
    try {
      // 通过API设置httpOnly cookie，使用axios
      await axios.post(
        "/api/auth/set-cookie",
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // 只在客户端存储用户名
      Cookies.set("echo_mome_username", username, { expires: 7 });
      setIsLoggedIn(true);
      setUsername(username);
    } catch (error) {
      console.error("设置cookie失败:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 通过API删除httpOnly cookie，使用axios
      await axios.post("/api/auth/clear-cookie");

      // 删除客户端cookie
      Cookies.remove("echo_mome_username");
      setIsLoggedIn(false);
      setUsername(null);
    } catch (error) {
      console.error("清除cookie失败:", error);
      throw error;
    }
  };

  return { isLoggedIn, username, login, logout };
}
