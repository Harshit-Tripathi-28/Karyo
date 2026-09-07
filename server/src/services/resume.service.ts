import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";

import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import type { ResumeAnalysis } from "../types/resume";

const getGeminiClient = (): GoogleGenAI => {
  if (!env.geminiApiKey) {
    throw new ApiError(
      500,
      "Gemini API key is not configured. Please set GEMINI_API_KEY in the server environment."
    );
  }

  return new GoogleGenAI({
    apiKey: env.geminiApiKey,
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
  const client = getGeminiClient();

  const systemInstruction = `You are KARYO's neural career intelligence engine.
Analyze the provided resume and return ONLY valid JSON matching this exact structure:
{
  "professionalSummary": "string",
  "targetRole": "string",
  "careerScore": 0-100,
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "highlights": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "duration": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "strengths": ["string"],
  "skillGaps": ["string"],
  "recommendations": ["string"]
}

Strict Rules:
- Never invent experience, education, projects, or skills.
- If information is missing, use an empty array or an empty string.
- careerScore must be an integer from 0 to 100 representing overall profile readiness.
- Identify the most suitable target role based strictly on the resume.
- skillGaps should contain 3-6 critical skills that would materially improve the candidate for the inferred target role.
- recommendations must be practical, actionable, and specific.
- Keep professionalSummary concise and impactful.`;

  const response = await client.models.generateContent({
    model: env.geminiModel,
    contents: `Analyze this resume:\n\n${resumeText}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  const raw = response.text?.trim();

  if (!raw) {
    throw new ApiError(
      502,
      "Gemini AI analysis returned an empty response"
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
      "Gemini AI returned an invalid resume analysis format"
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

  user.markModified("resumeAnalysis");
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
      resumeAnalysis: user.resumeAnalysis ?? null,
      createdAt: user.createdAt,
    },
  };
};