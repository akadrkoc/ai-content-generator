import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateContent } from "@/lib/openai";
import { generateSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { type, topic, audience, tone, language, platform } = parsed.data;

    // Require platform for social type
    if (type === "social" && !platform) {
      return NextResponse.json(
        { error: "Platform is required for social posts" },
        { status: 400 }
      );
    }

    const output = await generateContent({
      type,
      topic,
      audience,
      tone,
      language,
      platform,
    });

    const generation = await prisma.generation.create({
      data: {
        userId: user.userId,
        type,
        topic,
        audience,
        tone,
        language,
        platform: platform ?? null,
        output,
      },
    });

    return NextResponse.json({ generation }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
