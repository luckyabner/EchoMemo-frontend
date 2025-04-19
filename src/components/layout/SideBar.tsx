import React from "react";
import SearchBar from "./SearchBar";
import NotesNumber from "./NotesNumber";
import AIStyleSelector from "./AIStyleSelector";
import { Note } from "@/types";
import { useGlobalState } from "@/hooks/useGlobalState";
import { X } from "lucide-react";

interface SideBarProps {
  notes: Note[];
  onSearch: (results: Note[] | null, keyword?: string) => void;
  onDateSelect: (date: string, notes: Note[]) => void;
}

export default function SideBar({
  notes,
  onSearch,
  onDateSelect,
}: SideBarProps) {
  const { isSidebarOpen, closeSidebar } = useGlobalState();

  return (
    <>
      {/* 移动端遮罩层，点击后关闭侧边栏 */}
      {isSidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-20 bg-black lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* 桌面端固定显示，移动端根据状态显示 */}
      <div
        className={`bg-base-200 fixed inset-y-0 left-0 z-30 transform space-y-4 overflow-y-auto p-4 transition-transform duration-300 ease-in-out lg:static lg:inset-auto lg:z-auto lg:col-span-1 lg:block lg:w-auto lg:transform-none lg:bg-transparent lg:p-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
      >
        {/* 移动端关闭按钮 */}
        <div className="flex justify-end lg:hidden">
          <button
            onClick={closeSidebar}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* 搜索栏 */}
        <SearchBar onSearch={onSearch} />

        {/* 笔记日历 */}
        <NotesNumber
          notes={notes}
          onDateSelect={(date) => onDateSelect(date, notes)}
        />

        {/* AI风格选择器 */}
        <AIStyleSelector />
      </div>
    </>
  );
}
