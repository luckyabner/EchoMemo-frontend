import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

interface ChatRequestBody {
  model: string;
  prompt: string;
  message: string;
}

const API_KEY = process.env.AI_API_KEY as string;
const API_URL = process.env.AI_API_URL as string;
const MODEL = process.env.AI_API_MODEL as string;

// 最大响应时长 (秒)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    };

    const { prompt, message } = (await request.json()) as ChatRequestBody;

    if (!API_KEY || !API_URL) {
      console.error('API key or URL is not set');
      return NextResponse.json({ error: 'API key or URL is not set' }, { status: 500 });
    };

    const openai = createOpenAI({
      baseURL: API_URL,
      apiKey: API_KEY
    });

    const result = streamText({
      model: openai(MODEL),
      system: prompt,
      prompt: message,
      onError({ error }) {
        console.error(error);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}