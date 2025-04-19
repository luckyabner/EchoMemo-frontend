"use server";

import axios from "axios";

interface RegisterResponse {
  success: boolean;
  message: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const registerApi = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    if (!username || !email || !password) {
      return { success: false, message: "请填写所有必填字段" };
    }

    await axios.post(`${baseUrl}/api/auth/register`, {
      username,
      email,
      password,
    });

    return { success: true, message: "注册成功" };
  } catch (error: unknown) {
    console.error("注册过程中出错:", error);

    // 提取 Axios 错误响应中的详细信息
    if (axios.isAxiosError(error) && error.response) {
      // 服务器响应了请求，但状态码不在 2xx 范围内
      const errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        `注册失败，错误代码: ${error.response.status}`;
      return { success: false, message: errorMessage };
    } else if (axios.isAxiosError(error) && error.request) {
      // 请求已发送但没有收到响应
      return { success: false, message: "服务器无响应，请检查网络连接" };
    } else {
      // 其他错误
      const errorMessage = (error as Error).message || "未知错误";
      return { success: false, message: "请求配置错误: " + errorMessage };
    }
  }
};

export const loginApi = async (formData: FormData): Promise<LoginResponse> => {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { success: false, message: "请填写所有必填字段" };
    }

    const res = await axios.post(`${baseUrl}/api/auth/login`, {
      username,
      password,
    });

    return {
      success: true,
      message: "登录成功",
      token: res.data.access_token,
    };
  } catch (error: unknown) {
    console.error("登录过程中出错:", error);

    // 提取 Axios 错误响应中的详细信息
    if (axios.isAxiosError(error) && error.response) {
      // 服务器响应了请求，但状态码不在 2xx 范围内
      const errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        `注册失败，错误代码: ${error.response.status}`;
      return { success: false, message: errorMessage };
    } else if (axios.isAxiosError(error) && error.request) {
      // 请求已发送但没有收到响应
      return { success: false, message: "服务器无响应，请检查网络连接" };
    } else {
      // 其他错误
      const errorMessage = (error as Error).message || "未知错误";
      return { success: false, message: "请求配置错误: " + errorMessage };
    }
  }
};

export const resetPasswordApi = async (formData: FormData) => {
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const new_password = formData.get("new_password") as string;

    if (!username || !email || !new_password) {
      return { success: false, message: "请填写所有必填字段" };
    }

    const res = await axios.post(`${baseUrl}/api/auth/reset-password`, {
      username,
      email,
      new_password,
    });
    if (res.status === 200) {
      return { success: true, message: "密码重置成功" };
    }
  } catch (error) {
    console.error("重置密码过程中出错:", error);
    return { success: false, message: "服务器错误，请稍后再试" };
  }
};
