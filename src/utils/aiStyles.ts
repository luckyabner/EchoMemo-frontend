import { fetchCustomAIStyles } from "@/server/aiStyleServer";
import { AIStyle } from "@/types";

// 判断是否在浏览器环境中
const isBrowser = typeof window !== "undefined";

// 预设风格集合
export const AI_STYLES: AIStyle[] = [
  {
    id: "preset_1",
    name: "喵喵",
    description: "一只会说话的魔法猫咪",
    prompt: `
    你是一只拥有魔法的猫咪，性格傲娇但内心温柔。请以猫咪的口吻回应用户的记录，用‘喵星人’的视角看待他们的生活。比如：‘哼，你又在为这种小事烦恼？本喵建议你躺下来晒晒太阳，烦恼就会自己消失了喵～’避免过于复杂的语言，而是用简单、可爱的表达方式。  
    `,
    color: "badge-primary",
  },
  {
    id: "preset_2",
    name: "未来",
    description: "以终局思维刺激行动",
    prompt: `
    假设用户此刻站在80岁时的自己面前，老人会对TA的这条记录说什么？  
    要求：  
    1. 开头用"孩子..."称呼  
    2. 必须包含一个具体细节（"就像那年你..."）  
    3. 结尾抛出一个微小但立刻能做的事  
    像黄昏时分的低语。  
    `,
    color: "badge-accent",
  },
  {
    id: "preset_3",
    name: "幽默",
    description: "用荒诞类比化解焦虑",
    prompt: `
    你是一位风趣幽默的喜剧演员，善于从用户的记录中发现有趣的角度。请以诙谐的语言回应他们的记录，用巧妙的比喻或双关语制造笑点，让用户在轻松的氛围中感受到生活的乐趣。避免低俗或冒犯性的幽默，而是以善意和智慧为主。
    `,
    color: "badge-secondary",
  },
  {
    id: "preset_4",
    name: "哲学",
    description: "用极端假设刺激思考",
    prompt: `
    用一句哲学式的极端假设回应用户记录，直接颠覆TA的常规认知。格式固定为：  
    "如果...[用户观点的极端推论]，那...[颠覆性结论]？"  
    然后换行，用一句简短而有力的结语。保持冷酷但不下结论。  
    `,
    color: "badge-info",
  },
  {
    id: "preset_5",
    name: "狂暴",
    description: "用最狠的话点醒你（慎选）",
    prompt: `
      你现在是孙吧吧主+贴吧阴阳人十级学者，任务是让用户破大防。请拉满你的攻击力，
      刀刀带暴击，句句穿甲弹，专治各种不服、嘴硬、自我感动型废物，将用户喷的无地自容。
      `,
    color: "badge-error",
  },
];

//自定义风格缓存
let cachedCustomStyles: AIStyle[] | null = null;

/**
 * 设置AI风格
 * @param style AIStyle
 */
export const setAIStyle = (style: string) => {
  if (isBrowser) {
    localStorage.setItem("echomemo_aiStyle", style);
  }
};

/**
 * 获取当前AI风格
 * @returns 当前AI风格
 */
export const getCurrentAIStyle = () => {
  return getAIStyleByName(getCurrentAIStyleName());
};

/**
 *获取当前AI风格名称
 * @returns 当前AI风格名称
 */
export const getCurrentAIStyleName = () => {
  if (isBrowser) {
    try {
      const storedStyle = localStorage.getItem("echomemo_aiStyle");
      if (storedStyle) {
        return storedStyle;
      }
    } catch (error) {
      console.error("解析存储的AI风格失败:", error);
      // 如果解析失败，清除可能损坏的数据
      localStorage.removeItem("echomemo_aiStyle");
    }
  }
  return "喵喵"; // 返回默认值
};

/**
 * 根据名称获取AI风格
 * @param name
 * @returns AIStyle
 */
export const getAIStyleByName = async (name: string): Promise<AIStyle> => {
  const style = AI_STYLES.find((style) => style.name === name);
  if (style) {
    return style;
  } else {
    if (!cachedCustomStyles) {
      cachedCustomStyles = await fetchCustomAIStyles();
    }
    const customStyle = cachedCustomStyles.find((style) => style.name === name);
    if (customStyle) {
      return customStyle;
    }
  }
  return AI_STYLES[0]; // 如果找不到，返回默认风格
};

/**
 *
 * @param styleName AI风格名称
 * @returns 颜色
 */
export const getAIStyleColor = (styleName: string): string => {
  const style = AI_STYLES.find((style) => style.name === styleName);
  return style ? style.color : "badge-neutral"; // 如果找不到，返回默认颜色
};

/**
 * 获取当前样式对应的 prompt
 * @returns prompt
 */
export const getCurrentAIPrompt = async (): Promise<string> => {
  const style = await getAIStyleByName(getCurrentAIStyleName());
  return style.prompt;
};

/**
 *
 * @returns 所有预设AI风格
 */
export const getAllAIStyles = async (): Promise<AIStyle[]> => {
  const customStyles = await fetchCustomAIStyles();
  return [...AI_STYLES, ...customStyles];
};
