"use server";
import { Note } from "@/types";
import { getToken } from "@/utils/getToken";
import axios, { AxiosError } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//排序函数
function sortByTime(notes: Note[]) {
  return notes.sort(
    (
      a: { create_time: string; update_time?: string },
      b: { create_time: string; update_time?: string },
    ) => {
      // 优先使用 update_time 排序，如果不存在则使用 create_time
      const timeA = a.update_time
        ? new Date(a.update_time).getTime()
        : new Date(a.create_time).getTime();
      const timeB = b.update_time
        ? new Date(b.update_time).getTime()
        : new Date(b.create_time).getTime();
      return timeB - timeA; // 降序排序，最新的在前面
    },
  );
}

//时区转换
function convertToLocalTime(notes: Note[]) {
  notes.map((note: Note) => {
    // 处理 create_time
    if (note.create_time) {
      const createDate = new Date(note.create_time);
      // 添加 8 小时
      createDate.setHours(createDate.getHours() + 8);
      note.create_time = createDate.toISOString();
    }

    // 处理 update_time（如果存在）
    if (note.update_time) {
      const updateDate = new Date(note.update_time);
      // 添加 8 小时
      updateDate.setHours(updateDate.getHours() + 8);
      note.update_time = updateDate.toISOString();
    }
  });

  return notes;
}

export async function fetchNotes() {
  try {
    const token = await getToken();

    const res = await axios.get(`${baseUrl}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 将时间从 UTC 转换为 UTC+8
    const notesWithLocalTime = convertToLocalTime(res.data);

    return sortByTime(notesWithLocalTime);
  } catch (error) {
    console.error("获取笔记失败:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("登录已过期，请重新登录");
    }
    throw error;
  }
}

export async function addNote(formData: FormData) {
  try {
    const token = await getToken();

    const content = formData.get("content") as string;
    const ai_response = formData.get("ai_response") as string;
    const ai_style = formData.get("ai_style") as string;

    console.log("添加笔记：", { content, ai_response, ai_style });
    if (!content || content.trim() === "") {
      return { success: false, message: "内容不能为空" };
    }

    const res = await axios.post(
      `${baseUrl}/api/notes`,
      { content, ai_response, ai_style },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (res.status === 201) {
      return { success: true, note: res.data };
    }
  } catch (error) {
    console.error("添加笔记失败：", error);
    return { success: false, message: "服务器错误" };
  }
}

export async function deleteNote(id: string) {
  try {
    const token = await getToken();

    if (!token) {
      console.error("认证令牌不存在");
      return [];
    }

    await axios.delete(`${baseUrl}/api/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("删除笔记失败：", error);
    return { success: false, message: "服务器错误" };
  }
}

export async function updateNote(
  id: string,
  content: string,
  ai_response: string,
  ai_style: string,
) {
  try {
    const token = await getToken();
    const res = await axios.put(
      `${baseUrl}/api/notes/${id}`,
      { content, ai_response, ai_style },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (res.status === 201) {
      return { success: true, note: res.data };
    }
  } catch (error) {
    console.error("更新笔记失败：", error);
    return { success: false, message: "服务器错误" };
  }
}

export async function searchNotes(keyword: string) {
  try {
    const token = await getToken();

    if (!token) {
      return { success: false, message: "认证失败，请重新登录" };
    }

    const res = await axios.get(
      `${baseUrl}/api/notes/search?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const notes = sortByTime(convertToLocalTime(res.data));

    return { success: true, note: notes };
  } catch (error) {
    console.error("搜索笔记失败：", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("登录已过期，请重新登录");
    }
    return { success: false, message: "搜索失败" };
  }
}
