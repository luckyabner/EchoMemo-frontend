import { useRef, useState, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { getCurrentAIPrompt, getCurrentAIStyle } from "@/utils/aiStyles";
import { AIStyle } from "@/types";

export function useAICompletion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [aiStyle, setAiStyle] = useState<AIStyle>();

  const { completion, complete } = useCompletion({
    api: "/api/chat",
    onError: (error) => {
      console.error(error.message);
    },
  });

  const getAiResponse = async (content: string) => {
    try {
      setIsSubmitting(true);

      const currentStyle = await getCurrentAIStyle();
      if (currentStyle !== aiStyle) {
        setAiStyle(currentStyle);
      }

      const prompt = await getCurrentAIPrompt();
      const limitedPrompt =
        prompt +
        "直接回复文本，不要包含任何解释，不要用markdown，也不要过长，100字以内";
      await complete(limitedPrompt, {
        body: {
          message: content,
        },
      });
    } catch (error) {
      console.error("获取 AI 回复出错:", error);
      return "抱歉，获取 AI 回复时出现错误。";
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (completion) {
      setShowResult(true);
    }
  }, [completion]);

  return {
    aiStyle,
    completion,
    isSubmitting,
    showResult,
    setShowResult,
    getAiResponse,
  };
}

export function useForm(onAdd?: (formData: FormData) => void) {
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const {
    aiStyle,
    completion,
    isSubmitting,
    showResult,
    setShowResult,
    getAiResponse,
  } = useAICompletion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }
    await getAiResponse(content);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("ai_response", completion);
      formData.append("ai_style", aiStyle?.name || "喵喵");
      if (onAdd) {
        onAdd(formData);
      }
      setShowResult(false);
      setContent("");
    } catch (error) {
      console.error("保存笔记出错:", error);
    }
  };

  return {
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
    setShowResult,
  };
}
