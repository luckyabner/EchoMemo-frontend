export interface Note {
  id: string;
  content: string;
  create_time: string;
  update_time?: string;
  ai_response?: string;
  ai_style?: string;
}

export interface AIStyle {
  id: string | number;
  name: string;
  description: string;
  prompt: string;
  color: string;
}
