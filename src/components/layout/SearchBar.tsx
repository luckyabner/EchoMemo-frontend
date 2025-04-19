import React, { useState, useEffect, useRef } from "react";
import { searchNotes } from "@/server/notesServer";
import { Note } from "@/types";

interface SearchBarProps {
  onSearch: (searchResults: Note[] | null, keyword?: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // 使用 useRef 保存 onSearch 函数，避免依赖变化导致的无限循环
  const onSearchRef = useRef(onSearch);

  // 在组件挂载或 onSearch 变化时更新 ref
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // 防抖处理
  useEffect(() => {
    if (!keyword.trim()) {
      onSearchRef.current(null, ""); // 清空搜索条件时返回所有笔记
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await searchNotes(keyword);
        if (result?.success && result.note) {
          onSearchRef.current(result.note, keyword);
        }
      } catch (error) {
        console.error("搜索失败:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [keyword]); // 移除 onSearch 依赖，只依赖 keyword

  const handleClearSearch = () => {
    setKeyword("");
  };

  return (
    <div className="relative my-4">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索笔记内容..."
          className="input w-full pr-10"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={handleClearSearch}
          >
            ×
          </button>
        )}
      </div>
      {isSearching && (
        <div className="mt-2 text-center text-sm text-gray-500">搜索中...</div>
      )}
    </div>
  );
}
