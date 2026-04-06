import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const generateSchema = z.object({
  type: z.enum(["blog", "social", "email"]),
  topic: z.string().min(1, "Topic is required").max(500),
  audience: z.string().min(1, "Audience is required").max(200),
  tone: z.string().min(1, "Tone is required").max(100),
  language: z.string().min(1, "Language is required").max(50),
  platform: z.enum(["twitter", "linkedin", "instagram"]).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GenerateInput = z.infer<typeof generateSchema>;
