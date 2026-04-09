"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

interface ResultDisplayProps {
  type: string;
  topic: string;
  output: string;
}

export default function ResultDisplay({
  type,
  topic,
  output,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-medium uppercase px-2 py-1 rounded bg-blue-100 text-blue-700">
            {type}
          </span>
          <h3 className="mt-2 text-lg font-semibold">{topic}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
        {output}
      </div>
    </Card>
  );
}
