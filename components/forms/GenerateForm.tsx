"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface GenerationResult {
  id: string;
  type: string;
  topic: string;
  output: string;
  createdAt: string;
}

interface GenerateFormProps {
  onResult: (result: GenerationResult) => void;
}

const CONTENT_TYPES = [
  { value: "blog", label: "Blog Post" },
  { value: "social", label: "Social Media" },
  { value: "email", label: "Email" },
];

const PLATFORMS = [
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
];

const TONES = [
  "Professional",
  "Casual",
  "Friendly",
  "Formal",
  "Humorous",
  "Persuasive",
];

const LANGUAGES = [
  "English",
  "Turkish",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Arabic",
  "Chinese",
  "Japanese",
];

export default function GenerateForm({ onResult }: GenerateFormProps) {
  const [type, setType] = useState("blog");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [platform, setPlatform] = useState("twitter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          topic,
          audience,
          tone,
          language,
          ...(type === "social" ? { platform } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      onResult(data.generation);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>
      )}

      {/* Content Type */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Content Type
        </label>
        <div className="flex gap-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setType(ct.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === ct.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform (only for social) */}
      {type === "social" && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <Input
        label="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g. Benefits of AI in healthcare"
        required
      />

      <Input
        label="Target Audience"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        placeholder="e.g. Tech professionals, students"
        required
      />

      {/* Tone */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Generate Content
      </Button>
    </form>
  );
}
