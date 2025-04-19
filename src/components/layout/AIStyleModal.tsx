import React, { useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import { AIStyle } from "@/types";
import ReactDOM from "react-dom";

interface AIStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  styles: AIStyle[];
  onSaveStyle: (style: AIStyle) => void;
  onDeleteStyle: (styleId: string) => void;
  selectedStyle?: string;
}

export default function AIStyleModal({
  isOpen,
  onClose,
  styles,
  onSaveStyle,
  onDeleteStyle,
}: AIStyleModalProps) {
  const [editingStyle, setEditingStyle] = useState<AIStyle | null>(null);

  const isPresetStyle = (styleId?: string | number) => {
    if (typeof styleId === "string") {
      return true;
    }
    return false;
  };

  // 如果模态框未打开，不渲染内容
  if (!isOpen) return null;

  // 使用Portal将模态框渲染到body元素，以避免父元素的宽度限制
  const modalContent = (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-3xl">
        <button
          className="btn btn-sm btn-circle absolute top-2 right-2"
          onClick={() => {
            onClose();
            setEditingStyle(null);
          }}
        >
          ✕
        </button>

        <h3 className="mb-4 text-lg font-bold">AI 风格管理</h3>

        {!editingStyle ? (
          <div className="flex flex-col">
            {/* 风格列表 */}
            <div className="max-h-96 overflow-y-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>风格名称</th>
                    <th>描述</th>
                    <th className="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {styles.map((style) => (
                    <tr key={style.name} className="hover">
                      <td>
                        <div className="flex items-center gap-2">
                          {style.name}
                        </div>
                      </td>
                      <td className="max-w-xs truncate">{style.description}</td>
                      {!isPresetStyle(style.id) && (
                        <td className="text-right">
                          <button
                            className="btn btn-xs btn-ghost"
                            onClick={() => setEditingStyle(style)}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-xs btn-ghost text-error"
                            onClick={() => onDeleteStyle(String(style.id))}
                          >
                            <Trash size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 添加新风格按钮 */}
            <div className="mt-4 text-center">
              <button
                className="btn btn-primary"
                onClick={() =>
                  setEditingStyle({
                    id: "",
                    name: "",
                    description: "",
                    prompt: "",
                    color: "badge-primary",
                  })
                }
              >
                <Plus size={16} className="mr-1" /> 添加风格
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* 风格编辑表单 - 使用最大宽度并居中 */}
            <div className="w-full max-w-md">
              <h4 className="text-center font-bold">
                {editingStyle.name
                  ? `编辑 "${editingStyle.name}" 风格`
                  : "添加新风格"}
              </h4>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-medium">名称</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editingStyle.name}
                  onChange={(e) =>
                    setEditingStyle({ ...editingStyle, name: e.target.value })
                  }
                  placeholder="给风格起个名字"
                />
              </div>

              <div className="form-control mt-3">
                <label className="label">
                  <span className="label-text font-medium">描述</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editingStyle.description}
                  onChange={(e) =>
                    setEditingStyle({
                      ...editingStyle,
                      description: e.target.value,
                    })
                  }
                  placeholder="简短描述这个风格的特点"
                />
              </div>

              <div className="form-control mt-3">
                <label className="label">
                  <span className="label-text font-medium">Prompt 模板</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 w-full font-mono text-sm"
                  value={editingStyle.prompt}
                  onChange={(e) =>
                    setEditingStyle({
                      ...editingStyle,
                      prompt: e.target.value,
                    })
                  }
                  placeholder="输入AI风格的提示词模板..."
                />
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="btn btn-ghost"
                  onClick={() => setEditingStyle(null)}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onSaveStyle(editingStyle);
                    setEditingStyle(null);
                  }}
                  disabled={!editingStyle.name || !editingStyle.prompt}
                >
                  保存风格
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 使用 React Portal 将模态框渲染到 body 上，避免受到父元素的定位和样式限制
  return typeof document !== "undefined"
    ? ReactDOM.createPortal(modalContent, document.body)
    : null;
}
