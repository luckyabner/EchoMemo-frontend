"use client";
import React from "react";
import { Sparkles, RefreshCw, Save } from "lucide-react";
import AIResult from "./AIResult";
import { useForm } from "@/hooks/useForm";
import Link from "next/link";

export default function NewNoteForm({
  onAdd,
}: {
  onAdd?: (formData: FormData) => void;
}) {
  const {
    content,
    setContent,
    isSubmitting,
    showResult,
    formRef,
    aiStyle,
    completion,
    handleSubmit,
    handleSave,
    getAiResponse,
  } = useForm(onAdd);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-base-100 border-base-300 my-4 rounded-lg border p-4 shadow-md"
    >
      <h2 className="mb-2 text-lg font-bold">写下你现在的想法</h2>
      <div className="mb-4">
        <label
          className="mb-1 block text-sm font-medium"
          htmlFor="content"
        ></label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea textarea-bordered w-full"
          rows={4}
          placeholder="今天有什么新想法..."
          required
        />
      </div>
      {completion && showResult && (
        <AIResult completion={completion} style={aiStyle} />
      )}
      <div className="mt-4 flex justify-end gap-2">
        {showResult ? (
          <>
            <button
              type="button"
              className="btn btn-ghost gap-2"
              onClick={() => getAiResponse(content)}
            >
              <RefreshCw className="h-4 w-4" />
              重试
            </button>
            {onAdd ? (
              <button
                type="button"
                className="btn btn-primary gap-2"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                保存
              </button>
            ) : (
              <Link
                type="submit"
                className="btn btn-primary gap-2"
                href={"/login"}
              >
                登录体验更多玩法
              </Link>
            )}
          </>
        ) : (
          <button
            type="submit"
            className="btn btn-primary gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading loading-spinner loading-xs"></div>
                获取 AI 回复中...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                记录
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
