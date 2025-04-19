"use client";
import React, { useState, useEffect } from "react";
import {
  getAllAIStyles,
  getCurrentAIStyle,
  setAIStyle,
} from "@/utils/aiStyles";
import { Settings } from "lucide-react";
import AIStyleModal from "./AIStyleModal";
import { AIStyle } from "@/types";
import {
  addAIStyle,
  deleteAIStyle,
  updateAIStyle,
} from "@/server/aiStyleServer";

export default function AIStyleSelector() {
  const [selectedStyle, setSelectedStyle] = useState<string>("default");
  const [styles, setStyles] = useState<AIStyle[]>([]);
  // const [customStyles, setCustomStyles] = useState<AIStyle[]>([]); // 新增自定义风格状态
  const [showManageModal, setShowManageModal] = useState(false);

  // 处理保存风格
  const handleSaveStyle = async (style: AIStyle) => {
    // 检查是否已经存在同名风格
    const existingStyle = styles.find((s) => s.name === style.name);
    if (existingStyle) {
      try {
        await updateAIStyle(style);
      } catch (error) {
        console.error("更新风格失败:", error);
        alert("更新风格失败");
      }
    } else {
      // 如果不存在同名风格，添加新风格
      try {
        await addAIStyle(style);
      } catch (error) {
        console.error("添加风格失败:", error);
        alert("添加风格失败");
      }
    }
    const allStyles = await getAllAIStyles();
    // 刷新风格列表
    setStyles(allStyles);
  };

  // 处理删除风格
  const handleDeleteStyle = async (styleId: string) => {
    if (window.confirm("确定要删除这个风格吗？此操作不可恢复。")) {
      // 如果删除的是当前选中的风格，需要重置为默认风格
      if (styleId === selectedStyle) {
        setSelectedStyle("喵喵");
        setAIStyle("喵喵");
      }

      try {
        await deleteAIStyle(styleId);
      } catch (error) {
        console.error("删除风格失败:", error);
      }

      //重新加载所有风格
      const styles = await getAllAIStyles();

      // 刷新风格列表
      setStyles(styles);
    }
  };

  // 加载所有风格
  useEffect(() => {
    const getStyles = async () => {
      //加载并设置当前风格
      const currentStyle = await getCurrentAIStyle();
      setSelectedStyle(currentStyle.name);

      const allStyles = await getAllAIStyles();
      // setCustomStyles(customStyles);
      // 将所有风格合并后设置到styles状态
      setStyles(allStyles);
    };

    getStyles();
  }, []);

  // 处理风格选择
  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const styleName = event.target.value;
    setSelectedStyle(styleName);
    setAIStyle(styleName);
  };

  // 获取当前选中的样式对象
  const currentStyle = styles.find((s) => s.name === selectedStyle);

  return (
    <div className="card border-base-300 border shadow-md">
      <div className="card-body p-4">
        <div className="card-title border-base-200 mb-2 flex items-center justify-between border-b pb-2">
          <div className="flex items-center space-x-2">
            <span>AI 风格</span>
            {currentStyle && (
              <div className={`badge ${currentStyle.color || ""} badge-sm`}>
                {currentStyle.name}
              </div>
            )}
          </div>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setShowManageModal(true)}
            title="管理风格"
          >
            <Settings size={16} />
            <span className="ml-1 text-xs">管理</span>
          </button>
        </div>

        <div className="form-control mb-2">
          <div className="input-group w-full">
            <select
              className="select select-bordered w-full text-sm focus:outline-none"
              value={selectedStyle}
              onChange={handleStyleChange}
            >
              {styles.map((style) => (
                <option key={style.name} value={style.name}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          {currentStyle && (
            <div className="text-base-content/70 flex-1 text-xs">
              <p>{currentStyle.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 使用AIStyleModal组件 */}
      <AIStyleModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        styles={styles}
        onSaveStyle={handleSaveStyle}
        onDeleteStyle={handleDeleteStyle}
        selectedStyle={selectedStyle}
      />
    </div>
  );
}
