import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [total, blogCount, socialCount, emailCount, recentGenerations] =
    await Promise.all([
      prisma.generation.count({ where: { userId: user.userId } }),
      prisma.generation.count({
        where: { userId: user.userId, type: "blog" },
      }),
      prisma.generation.count({
        where: { userId: user.userId, type: "social" },
      }),
      prisma.generation.count({
        where: { userId: user.userId, type: "email" },
      }),
      prisma.generation.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          type: true,
          topic: true,
          createdAt: true,
        },
      }),
    ]);

  return NextResponse.json({
    stats: { total, blog: blogCount, social: socialCount, email: emailCount },
    recentGenerations,
  });
}
