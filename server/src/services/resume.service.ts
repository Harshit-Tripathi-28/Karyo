import OpenAI from "openai";
import { PDFParse } from "pdf-parse";

import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import type { ResumeAnalysis } from "../types/resume";

const getOpenAIClient = (): OpenAI => {
  if (!env.openaiApiKey) {
    throw new ApiError(
      500,
      "OpenAI API key is not configured"
    );
  }

  return new OpenAI({
    apiKey: env.openaiApiKey,
  });
};

const extractPdfText = async (
  buffer: Buffer
): Promise<string> => {
  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    const text = result.text.trim();

    if (!text) {
      throw new ApiError(
        400,
        "No readable text was found in the resume"
      );
    }

    return text;
  } finally {
    await parser.destroy();
  }
};

const analyzeResumeWithAI = async (
  resumeText: string
): Promise<ResumeAnalysis> => {
  const client = getOpenAIClient();

  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: `
You are KARYO's career intelligence engine.

Analyze the provided resume and return ONLY valid JSON.

Rules:
- Never invent experience, education, projects or skills.
- If information is missing, use an empty array or an empty string.
- careerScore must be an integer from 0 to 100.
- Identify the most suitable target role based only on the resume.
- skillGaps should contain skills that would materially improve the candidate for the inferred target role.
- recommendations must be practical and specific.
- Keep professionalSummary concise.
        `,
      },
      {
        role: "user",
        content: `
Analyze this resume:

${resumeText}
        `,
      },
    ],
  });

  const raw = response.output_text?.trim();

  if (!raw) {
    throw new ApiError(
      502,
      "AI analysis returned an empty response"
    );
  }

  try {
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleaned) as ResumeAnalysis;
  } catch {
    throw new ApiError(
      502,
      "AI returned an invalid resume analysis"
    );
  }
};

export const processResume = async (
  userId: string,
  buffer: Buffer
) => {
  if (buffer.length === 0) {
    throw new ApiError(400, "Uploaded resume is empty");
  }

  const resumeText = await extractPdfText(buffer);

  if (resumeText.length < 100) {
    throw new ApiError(
      400,
      "Resume does not contain enough readable content"
    );
  }

  const analysis = await analyzeResumeWithAI(
    resumeText
  );

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  user.resumeText = resumeText;
  user.resumeAnalysis = analysis;

  user.skills = analysis.skills;
  user.targetRole = analysis.targetRole;
  user.careerScore = Math.min(
    100,
    Math.max(0, analysis.careerScore)
  );

  await user.save();

  return {
    resumeAnalysis: analysis,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      skills: user.skills,
      careerScore: user.careerScore,
      createdAt: user.createdAt,
    },
  };
};