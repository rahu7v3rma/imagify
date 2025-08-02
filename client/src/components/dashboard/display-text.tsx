"use client";

import { Copy } from "lucide-react";
import clsx from "clsx";

export default function DisplayText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex-1 max-w-md", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Extracted Text
      </label>
      <div className="w-full h-80 border-2 border-gray-300 rounded-lg bg-gray-50 p-4 relative overflow-y-auto">
        <div className="text-gray-900 whitespace-pre-wrap text-sm">
          {text}
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
          className="absolute top-2 right-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200 z-10 flex items-center gap-1"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>
    </div>
  );
}
