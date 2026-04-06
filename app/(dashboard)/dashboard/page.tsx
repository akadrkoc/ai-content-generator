"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

interface Stats {
  total: number;
  blog: number;
  social: number;
  email: number;
}

interface RecentGeneration {
  id: string;
  type: string;
  topic: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data.stats);
        setRecent(data.recentGenerations);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-20">{error}</p>;
  }

  const statCards = [
    { label: "Total", value: stats?.total ?? 0, color: "text-blue-600" },
    { label: "Blog", value: stats?.blog ?? 0, color: "text-green-600" },
    { label: "Social", value: stats?.social ?? 0, color: "text-purple-600" },
    { label: "Email", value: stats?.email ?? 0, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/generate">
          <Button>New Generation</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Generations */}
      <Card title="Recent Generations">
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No generations yet.{" "}
            <Link href="/generate" className="text-blue-600 hover:underline">
              Create your first one!
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((gen) => (
              <div
                key={gen.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{gen.topic}</p>
                  <p className="text-xs text-gray-500">
                    {gen.type.toUpperCase()} &middot;{" "}
                    {new Date(gen.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/history`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
