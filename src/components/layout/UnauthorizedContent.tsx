import React from "react";
import NewNoteForm from "../notes/NewNoteForm";
import { Bot, Sparkles, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedContent() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          {/* 标题区域 */}
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="text-primary h-10 w-10 animate-pulse" />
            <h1 className="font-comfortaa from-primary to-secondary bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent">
              <p>EchoMemo</p>
              {/* <p>回声备忘录</p> */}
            </h1>
          </div>

          {/* 主标语 */}
          <p className="mb-6 max-w-3xl text-center text-xl leading-relaxed md:text-2xl">
            记录想法，获取 AI 回馈，让每一个想法都闪耀
          </p>

          {/* 行动按钮 - 移到更显眼的位置 */}
          <div className="mb-12 flex gap-4">
            <Link href="/login" className="btn btn-primary group px-8 text-lg">
              登录
            </Link>
            <Link href="/register" className="btn btn-outline px-8 text-lg">
              注册
            </Link>
          </div>

          {/* 体验区域 */}
          <div className="mb-12 w-full max-w-3xl">
            <h2 className="mb-6 text-center text-2xl font-bold">立即体验👇🏻</h2>
            <NewNoteForm />
          </div>

          {/* 功能展示区 */}
          <div className="mb-16 w-full max-w-4xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group bg-base-100 relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-primary/10 group-hover:bg-primary/20 absolute -top-4 -right-4 h-24 w-24 rounded-full transition-all duration-300"></div>
                <Bot className="text-primary relative z-10 mb-4 h-10 w-10" />
                <h3 className="relative z-10 mb-2 text-xl font-semibold">
                  AI 智能回馈
                </h3>
                <p className="text-base-content/70 relative z-10">
                  为您的想法提供独特的 AI 回馈，激发更多灵感
                </p>
              </div>

              <div className="group bg-base-100 relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-secondary/10 group-hover:bg-secondary/20 absolute -top-4 -right-4 h-24 w-24 rounded-full transition-all duration-300"></div>
                <MessageSquare className="text-secondary relative z-10 mb-4 h-10 w-10" />
                <h3 className="relative z-10 mb-2 text-xl font-semibold">
                  私密空间
                </h3>
                <p className="text-base-content/70 relative z-10">
                  安全存储您的想法，随时查看和编辑
                </p>
              </div>

              <div className="group bg-base-100 relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="bg-accent/10 group-hover:bg-accent/20 absolute -top-4 -right-4 h-24 w-24 rounded-full transition-all duration-300"></div>
                <Zap className="text-accent relative z-10 mb-4 h-10 w-10" />
                <h3 className="relative z-10 mb-2 text-xl font-semibold">
                  快速记录
                </h3>
                <p className="text-base-content/70 relative z-10">
                  随时随地记录您的想法，不放过任何灵感
                </p>
              </div>
            </div>
          </div>

          {/* 底部再次强调登录/注册 */}
          <div className="mt-8 text-center">
            <p className="mb-4 text-lg">想体验更多玩法？立即加入我们！</p>
            <div className="mb-12 flex gap-4">
              <Link
                href="/login"
                className="btn btn-primary group px-8 text-lg"
              >
                登录
              </Link>
              <Link href="/register" className="btn btn-outline px-8 text-lg">
                注册
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
