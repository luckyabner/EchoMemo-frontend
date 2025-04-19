import { cookies } from "next/headers";

export async function getToken() {
  // 使用 next/headers 中的 cookies() 方法获取令牌
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  if (!token) {
    console.error("认证令牌不存在");
    return;
  }
  return token;
}
