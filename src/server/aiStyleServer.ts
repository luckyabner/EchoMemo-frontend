"use server";
import { AIStyle } from "@/types";
import { getToken } from "@/utils/getToken";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * 获取自定义AI风格
 * @returns {Promise<Note[]>}
 */
export async function fetchCustomAIStyles(): Promise<AIStyle[]> {
  try {
    const token = await getToken();
    const res = await axios.get(`${baseUrl}/api/ai-styles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("获取AI风格失败：", error);
    return [];
  }
}

export async function addAIStyle(style: AIStyle) {
  try {
    const token = await getToken();
    await axios.post(
      `${baseUrl}/api/ai-styles`,
      {
        name: style.name,
        description: style.description,
        prompt: style.prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return { success: true, message: "添加成功" };
  } catch (error) {
    console.error("添加AI风格失败：", error);
    return { success: false, message: "服务器错误" };
  }
}

/**
 * 删除自定义AI风格
 * @param styleId 风格ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteAIStyle(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getToken();
    await axios.delete(`${baseUrl}/api/ai-styles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, message: "删除成功" };
  } catch (error) {
    console.error("删除AI风格失败：", error);
    return { success: false, message: "服务器错误" };
  }
}

export async function updateAIStyle(style: AIStyle) {
  try {
    const token = await getToken();
    await axios.put(
      `${baseUrl}/api/ai-styles/${style.id}`,
      {
        name: style.name,
        description: style.description,
        prompt: style.prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.error("更新AI风格失败：", error);
    return { success: false, message: "服务器错误" };
  }
}
