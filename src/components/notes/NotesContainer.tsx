"use client";
import {
  addNote,
  deleteNote,
  fetchNotes,
  updateNote,
  searchNotes,
} from "@/server/notesServer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NewNoteForm from "./NewNoteForm";
import NotesList from "./NotesList";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types";
import SideBar from "../layout/SideBar";
import { useState, useRef } from "react";
import { formatDateToYMD } from "@/utils/formatDate";

export default function NotesContainer() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [searchResults, setSearchResults] = useState<Note[] | null>(null);
  const [dateFilteredNotes, setDateFilteredNotes] = useState<Note[] | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const currentKeywordRef = useRef<string>("");

  // 使用 React Query 获取笔记列表
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    retry: false,
  });

  // 当前显示的笔记列表（优先显示日期过滤结果，其次是搜索结果，最后是完整列表）
  const displayedNotes = dateFilteredNotes || searchResults || notes;

  // 刷新搜索结果的函数
  const refreshSearchResults = async () => {
    if (currentKeywordRef.current) {
      try {
        const result = await searchNotes(currentKeywordRef.current);
        if (result?.success && result.note) {
          setSearchResults(result.note);
          // 如果同时有日期筛选，需要在搜索结果中再次筛选
          if (selectedDate) {
            const filteredByDate = result.note.filter((note: Note) => {
              const noteDate = new Date(note.create_time)
                .toISOString()
                .split("T")[0];
              return noteDate === selectedDate;
            });
            setDateFilteredNotes(filteredByDate);
          }
        }
      } catch (error) {
        console.error("刷新搜索结果失败:", error);
      }
    }
  };

  // 添加笔记的 mutation
  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      // 成功后自动刷新笔记列表
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // 清空搜索结果，显示最新完整列表
      setSearchResults(null);
      currentKeywordRef.current = "";

      // 如果有日期筛选，保持日期筛选
      if (selectedDate) {
        // 延迟执行以确保新数据已经加载
        setTimeout(() => {
          handleDateSelect(
            selectedDate,
            queryClient.getQueryData(["notes"]) || [],
          );
        }, 100);
      }
    },
  });

  // 删除笔记的 mutation
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      // 成功后自动刷新笔记列表
      await queryClient.invalidateQueries({ queryKey: ["notes"] });

      // 如果处于搜索状态，刷新搜索结果
      if (searchResults !== null && currentKeywordRef.current) {
        refreshSearchResults();
      }

      // 如果有日期筛选，保持日期筛选
      if (selectedDate) {
        const allNotes = queryClient.getQueryData<Note[]>(["notes"]) || [];
        handleDateSelect(selectedDate, allNotes);
      }
    },
  });

  //编辑笔记的 mutation
  const updateNoteMutation = useMutation({
    mutationFn: (data: {
      id: string;
      content: string;
      ai_response: string;
      ai_style: string;
    }) => updateNote(data.id, data.content, data.ai_response, data.ai_style),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });

      // 如果在编辑时有搜索结果，更新后需要刷新搜索结果
      if (searchResults !== null && currentKeywordRef.current) {
        refreshSearchResults();
      }

      // 如果有日期筛选，保持日期筛选
      if (selectedDate) {
        const allNotes = queryClient.getQueryData<Note[]>(["notes"]) || [];
        handleDateSelect(selectedDate, allNotes);
      }
    },
  });

  // 处理添加笔记
  const handleAddNote = (formData: FormData) => {
    addNoteMutation.mutate(formData);
  };

  // 处理删除笔记
  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  //处理更新笔记
  const handleUpdateNote = (data: {
    id: string;
    content: string;
    ai_response: string;
    ai_style: string;
  }) => {
    updateNoteMutation.mutate(data);
  };

  // 处理搜索结果
  const handleSearch = (results: Note[] | null, keyword: string = "") => {
    setSearchResults(results);
    currentKeywordRef.current = keyword;

    // 如果有日期筛选，在搜索结果中继续筛选日期
    if (selectedDate && results) {
      const filteredByDate = results.filter((note) => {
        const noteDate = new Date(note.create_time).toISOString().split("T")[0];
        return noteDate === selectedDate;
      });
      setDateFilteredNotes(filteredByDate);
    } else {
      setDateFilteredNotes(null);
    }
  };

  // 处理日期筛选
  const handleDateSelect = (date: string, notesToFilter: Note[]) => {
    setSelectedDate(date);

    // 如果日期为空，取消筛选
    if (!date) {
      setDateFilteredNotes(null);
      return;
    }

    // 在当前显示的笔记列表中筛选特定日期
    const sourceNotes = searchResults || notesToFilter;
    const filteredByDate = sourceNotes.filter((note) => {
      const noteDate = formatDateToYMD(new Date(note.create_time));
      return noteDate === date;
    });

    setDateFilteredNotes(filteredByDate);
  };

  // 处理登录过期
  if (error instanceof Error && error.message === "登录已过期，请重新登录") {
    logout();
    return (
      <div className="text-error py-4 text-center">登录已过期，请重新登录</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 左侧边栏 */}
      <SideBar
        notes={notes}
        onSearch={handleSearch}
        onDateSelect={handleDateSelect}
      />

      {/* 右侧主要内容区 */}
      <div className="space-y-4 lg:col-span-2">
        {/* 添加笔记表单 */}
        <NewNoteForm onAdd={handleAddNote} />

        {/* 日期筛选状态显示 */}
        {selectedDate && (
          <div className="card border-base-300 flex-row justify-between border p-3 shadow-sm">
            <div className="text-sm">
              <span className="font-medium">当前筛选:</span> {selectedDate}
              <span className="ml-2 text-gray-500">
                ({dateFilteredNotes?.length || 0}条想法)
              </span>
            </div>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => {
                setSelectedDate("");
                setDateFilteredNotes(null);
              }}
            >
              显示全部
            </button>
          </div>
        )}

        {/* 笔记列表 */}
        {isLoading ? (
          <div className="py-4 text-center">加载中...</div>
        ) : (
          <>
            {displayedNotes.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                {selectedDate
                  ? `${selectedDate} 没有记录想法`
                  : searchResults !== null
                    ? "未找到匹配的笔记"
                    : "开始添加你的第一条笔记吧！"}
              </div>
            ) : (
              <NotesList
                notes={displayedNotes}
                onDelete={handleDeleteNote}
                onUpdate={handleUpdateNote}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
