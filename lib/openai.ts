import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ContentType = "blog" | "social" | "email";

interface GenerateParams {
  type: ContentType;
  topic: string;
  audience: string;
  tone: string;
  language: string;
  platform?: string; // only for social type
}

// Build a system prompt based on content type
function buildSystemPrompt(params: GenerateParams): string {
  const { type, language, platform } = params;

  const langInstruction = `Write the content in ${language}.`;

  switch (type) {
    case "blog":
      return `You are an expert SEO blog writer. Write long-form, well-structured blog posts with headings (H2, H3), bullet points where appropriate, an engaging introduction, and a strong conclusion. Optimize for readability and SEO. ${langInstruction}`;

    case "social":
      return `You are a social media content expert specializing in ${platform || "general social media"}. Write short, engaging, attention-grabbing posts optimized for ${platform || "social media"}. Include relevant hashtags and a call-to-action. ${
        platform === "twitter"
          ? "Keep it under 280 characters."
          : platform === "linkedin"
            ? "Use a professional but engaging tone. Use line breaks for readability."
            : platform === "instagram"
              ? "Make it visual and emoji-friendly. Include 5-10 relevant hashtags at the end."
              : ""
      } ${langInstruction}`;

    case "email":
      return `You are an expert email copywriter. Write a compelling email with a catchy subject line and persuasive body text. Include a clear call-to-action (CTA). Format as:\nSubject: [subject line]\n\n[email body]\n\nCTA: [call to action] ${langInstruction}`;

    default:
      return `You are a helpful content writer. ${langInstruction}`;
  }
}

function buildUserPrompt(params: GenerateParams): string {
  const { type, topic, audience, tone } = params;
  return `Create a ${type} post about "${topic}" for the target audience: ${audience}. Use a ${tone} tone.`;
}

export async function generateContent(
  params: GenerateParams
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: buildSystemPrompt(params) },
      { role: "user", content: buildUserPrompt(params) },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || "No content generated.";
}
