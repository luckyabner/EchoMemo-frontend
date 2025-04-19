import NotesContainer from "@/components/notes/NotesContainer";
import { cookies } from "next/headers";
import { Suspense } from "react";
import UnauthorizedContent from "@/components/layout/UnauthorizedContent";
import NavBar from "@/components/layout/NavBar";

// 服务器组件
async function NotesSection() {
  const cookieStore = cookies();
  const userName = (await cookieStore).get("echo_mome_username")?.value;
  if (!userName) {
    return <UnauthorizedContent />;
  }
  return <NotesContainer />;
}

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* 顶部导航栏 */}
      <NavBar />

      <Suspense fallback={<div className="py-4 text-center">加载中...</div>}>
        <NotesSection />
      </Suspense>
    </div>
  );
}
