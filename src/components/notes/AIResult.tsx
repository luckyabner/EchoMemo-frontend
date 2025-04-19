import { BotIcon } from "lucide-react";
import React from "react";

export default function AIResult({
  completion,
  style,
}: {
  completion: string;
  style?: {
    name: string;
    color: string;
  };
}) {
  return (
    <div className="mt-6">
      <div className="bg-base-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-base-200 flex-shrink-0 rounded-full p-2">
            <BotIcon className="text-base-content/70 h-4 w-4" />
          </div>

          <div className="flex-grow">
            <div className="mb-1.5 flex items-center gap-2">
              {/* <p className="text-base-content/60 text-xs">AI 回应</p> */}
              <span className={`badge badge-xs ${style?.color}`}>
                {style?.name}
              </span>
            </div>
            <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-wrap">
              {completion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
