"use client";

import { useState } from "react";
import GenerateForm from "@/components/forms/GenerateForm";
import ResultDisplay from "@/components/ui/ResultDisplay";

interface GenerationResult {
  id: string;
  type: string;
  topic: string;
  output: string;
  createdAt: string;
}

export default function GeneratePage() {
  const [result, setResult] = useState<GenerationResult | null>(null);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Generate Content</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <GenerateForm onResult={setResult} />
        </div>

        <div>
          {result ? (
            <ResultDisplay
              type={result.type}
              topic={result.topic}
              output={result.output}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center h-full text-gray-400">
              Your generated content will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
