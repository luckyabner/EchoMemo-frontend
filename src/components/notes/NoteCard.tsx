"use client";
import { Ellipsis, RefreshCw, Save } from "lucide-react";
import React from "react";
import { Note } from "@/types";
import EditMenu from "../common/EditMenu";
import AIResult from "./AIResult";
import { getAIStyleColor } from "@/utils/aiStyles";
import { useNotes } from "@/hooks/useNotes";
import { useAICompletion } from "@/hooks/useForm";
import formatDate from "@/utils/formatDate";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onUpdate?: (data: {
    id: string;
    content: string;
    ai_response: string;
    ai_style: string;
  }) => void;
}

export default function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  // 使用 useNotes hook 管理笔记相关逻辑
  const {
    showMenu,
    isEditing,
    editedContent,
    setEditedContent,
    menuRef,
    containerRef,
    textareaRef,
    handleMouseEnter,
    handleMouseLeave,
    handleEdit,
    cancelEdit,
    handleDeleteNote,
    setIsEditing, // 新增
  } = useNotes({ note, onDelete, onUpdate });

  // 集成 AI 回复逻辑
  const {
    aiStyle,
    completion,
    isSubmitting,
    showResult,
    setShowResult,
    getAiResponse,
  } = useAICompletion();

  // 保存编辑后的 Note（带 AI 回复）
  const handleSaveWithAI = () => {
    if (onUpdate) {
      onUpdate({
        id: note.id,
        content: editedContent,
        ai_response: completion || "",
        ai_style: aiStyle?.name ?? "",
      });
    }
    setShowResult(false);
    setEditedContent(editedContent);
    setIsEditing(false); // 保存后退出编辑状态
  };

  const aiStyleColor = note.ai_style
    ? getAIStyleColor(note.ai_style)
    : "badge-primary";

  // 格式化日期，优先使用 update_time，如果不存在则使用 create_time
  const formattedDate = note.update_time
    ? formatDate(new Date(note.update_time))
    : formatDate(new Date(note.create_time));

  return (
    <div className="card bg-base-100 mb-4 w-full shadow-md transition-shadow hover:shadow-lg">
      <div className="card-body relative p-4">
        {/* 用户笔记部分 */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm text-gray-500">{formattedDate}</div>
          {!isEditing && (
            <div
              ref={containerRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Ellipsis className="cursor-pointer" />
              {showMenu && (
                <div
                  ref={menuRef}
                  className="absolute top-full right-0 z-10 mt-1"
                >
                  <EditMenu
                    id={note.id}
                    onDelete={handleDeleteNote}
                    onEdit={handleEdit}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              className="textarea textarea-bordered w-full"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={5}
            />
            {/* AI 生成回复及操作按钮 */}
            {completion && showResult && (
              <AIResult completion={completion} style={aiStyle} />
            )}
            <div className="mt-2 flex justify-end space-x-2">
              <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                取消
              </button>
              {showResult ? (
                <>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm gap-2"
                    onClick={() => getAiResponse(editedContent)}
                  >
                    <RefreshCw className="h-4 w-4" />
                    重试
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm gap-2"
                    onClick={handleSaveWithAI}
                  >
                    <Save className="h-4 w-4" />
                    保存
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm gap-2"
                  disabled={isSubmitting}
                  onClick={() => getAiResponse(editedContent)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading loading-spinner loading-xs"></div>
                      获取 AI 回复中...
                    </>
                  ) : (
                    <>更新</>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{note.content}</p>
        )}

        {/* AI回复部分 */}
        {note.ai_response && !isEditing && (
          <AIResult
            completion={note.ai_response || ""}
            style={{ color: `${aiStyleColor}`, name: `${note.ai_style || ""}` }}
          />
        )}
      </div>
    </div>
  );
}
