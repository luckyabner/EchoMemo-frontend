import { Note } from "@/types";
import React, { useState, useEffect, useRef } from "react";
import NoteCard from "./NoteCard";

type NotesListProps = {
  notes: Note[]; // Adjust the type based on your actual data structure
  onDelete?: (id: string) => void; // 添加删除函数属性
  onUpdate?: (data: {
    id: string;
    content: string;
    ai_response: string;
    ai_style: string;
  }) => void;
};

export default function NotesList({
  notes,
  onDelete,
  onUpdate,
}: NotesListProps) {
  // 初始加载的笔记数量
  const initialNotesToLoad = 5;
  // 每次滚动增加的笔记数量
  const notesPerScroll = 5;
  // 当前显示的笔记数量
  const [visibleCount, setVisibleCount] = useState(initialNotesToLoad);
  // 创建一个ref用于最后一个笔记项
  const lastNoteRef = useRef<HTMLDivElement>(null);
  // 创建一个交叉观察器实例
  const observer = useRef<IntersectionObserver | null>(null);

  // 计算当前要显示的笔记列表
  const visibleNotes = notes.slice(0, visibleCount);

  // 处理滚动加载
  useEffect(() => {
    // 如果已经加载了所有笔记，不需要观察
    if (visibleCount >= notes.length) {
      return;
    }

    // 断开之前的观察
    if (observer.current) {
      observer.current.disconnect();
    }

    // 创建新的观察器
    observer.current = new IntersectionObserver(
      (entries) => {
        // 当最后一个笔记元素可见时
        if (entries[0].isIntersecting) {
          // 延迟一点以避免过于频繁的加载
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + notesPerScroll, notes.length),
            );
          }, 300);
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      },
    );

    // 监视最后一个笔记元素
    if (lastNoteRef.current) {
      observer.current.observe(lastNoteRef.current);
    }

    // 清理函数
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [visibleCount, notes.length]);

  // 当notes数组发生变化时重置visibleCount
  useEffect(() => {
    setVisibleCount(initialNotesToLoad);
  }, [notes]);

  return (
    <div className="space-y-4">
      {visibleNotes.map((note, index) => {
        // 如果是当前视图的最后一个元素，添加ref
        const isLastElement = index === visibleNotes.length - 1;

        return (
          <div key={note.id} ref={isLastElement ? lastNoteRef : undefined}>
            <NoteCard note={note} onDelete={onDelete} onUpdate={onUpdate} />
          </div>
        );
      })}

      {visibleCount < notes.length && (
        <div className="flex justify-center py-4">
          <span className="loading loading-dots loading-md text-primary"></span>
        </div>
      )}
    </div>
  );
}
