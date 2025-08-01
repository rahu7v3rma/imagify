"use client";

import { ClipboardIcon } from "@heroicons/react/24/outline";
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
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
        Extracted Text
      </label>
      <div className="w-full h-80 border-2 border-gray-300 dark:border-zinc-600 rounded-lg bg-gray-50 dark:bg-zinc-800 p-4 relative overflow-y-auto">
        <div className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm">
          {text}
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
          className="absolute top-2 right-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200 z-10 flex items-center gap-1"
        >
          <ClipboardIcon className="w-4 h-4" />
          Copy
        </button>
      </div>
    </div>
  );
}
