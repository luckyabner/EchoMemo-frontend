import { useState, useRef, useEffect } from "react";
import { Note } from "@/types";

interface UseNotesProps {
  note: Note;
  onDelete?: (id: string) => void;
  onUpdate?: (data: {
    id: string;
    content: string;
    ai_response: string;
    ai_style: string;
  }) => void;
}

export function useNotes({ note, onDelete, onUpdate }: UseNotesProps) {
  const { id, content } = note;
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (menuRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const interactiveArea = {
        left: Math.min(containerRect.left, menuRect.left),
        top: Math.min(containerRect.top, menuRect.top),
        right: Math.max(containerRect.right, menuRect.right),
        bottom: Math.max(containerRect.bottom, menuRect.bottom),
      };
      if (
        e.clientX < interactiveArea.left ||
        e.clientX > interactiveArea.right ||
        e.clientY < interactiveArea.top ||
        e.clientY > interactiveArea.bottom
      ) {
        setShowMenu(false);
      }
    }
  };

  useEffect(() => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const handleMenuMouseEnter = () => {
        setShowMenu(true);
      };
      menuElement.addEventListener("mouseenter", handleMenuMouseEnter);
      return () => {
        menuElement.removeEventListener("mouseenter", handleMenuMouseEnter);
      };
    }
  }, [showMenu]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  // 更新Note
  const handleSaveNote = () => {
    if (onUpdate) {
      onUpdate({
        id,
        content: editedContent,
        ai_response: note.ai_response || "",
        ai_style: note.ai_style || "",
      });
    }
    setIsEditing(false);
  };

  // 删除Note
  const handleDeleteNote = () => {
    if (!window.confirm("确认删除？")) {
      return;
    }

    if (onDelete) {
      onDelete(id);
    }
  };

  return {
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
    handleSaveNote,
    handleDeleteNote,
    setShowMenu,
    setIsEditing, // 新增导出 setIsEditing
  };
}
