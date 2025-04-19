"use client";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

export default function EditMenu({
  id,
  onDelete,
  onEdit,
}: {
  id: string;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
}) {
  const handleDelete = async () => {
    // 调用 onDelete 回调函数
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <ul className="menu bg-base-200 rounded-box">
      <li>
        <a title="编辑" onClick={handleEdit}>
          <Pencil />
        </a>
      </li>
      <li>
        <a title="删除" onClick={handleDelete}>
          <Trash2 />
        </a>
      </li>
    </ul>
  );
}
