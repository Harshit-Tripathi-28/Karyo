import { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findById(req.userId);

  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  res.status(200).json({
    success: true,
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
  });
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const {
    name,
    targetRole,
    skills,
    experience,
    projects,
    education,
    professionalSummary,
  } = req.body;

  const user = await User.findById(req.userId);

  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  if (typeof name === "string" && name.trim()) {
    user.name = name.trim();
  }

  // Ensure resumeAnalysis structure is initialized if user updates profile
  if (!user.resumeAnalysis) {
    user.resumeAnalysis = {
      professionalSummary: `Career profile for ${user.name}.`,
      targetRole: user.targetRole || "",
      careerScore: user.careerScore || 50,
      skills: user.skills || [],
      experience: [],
      education: [],
      projects: [],
      strengths: [],
      skillGaps: [],
      recommendations: [],
    };
  }

  if (typeof targetRole === "string") {
    const trimmedRole = targetRole.trim();
    user.targetRole = trimmedRole;
    user.resumeAnalysis.targetRole = trimmedRole;
  }

  if (Array.isArray(skills)) {
    const updatedSkills = skills
      .filter((skill): skill is string => typeof skill === "string")
      .map((skill) => skill.trim())
      .filter(Boolean);

    user.skills = updatedSkills;
    user.resumeAnalysis.skills = updatedSkills;
  }

  if (typeof professionalSummary === "string" && professionalSummary.trim()) {
    user.resumeAnalysis.professionalSummary = professionalSummary.trim();
  }

  if (Array.isArray(experience)) {
    user.resumeAnalysis.experience = experience
      .filter((e) => e && typeof e === "object" && typeof e.company === "string" && typeof e.role === "string")
      .map((e) => ({
        company: String(e.company).trim(),
        role: String(e.role).trim(),
        duration: String(e.duration || "").trim(),
        highlights: Array.isArray(e.highlights)
          ? e.highlights.map(String).map((h: string) => h.trim()).filter(Boolean)
          : [],
      }));
  }

  if (Array.isArray(projects)) {
    user.resumeAnalysis.projects = projects
      .filter((p) => p && typeof p === "object" && typeof p.name === "string")
      .map((p) => ({
        name: String(p.name).trim(),
        description: String(p.description || "").trim(),
        technologies: Array.isArray(p.technologies)
          ? p.technologies.map(String).map((t: string) => t.trim()).filter(Boolean)
          : [],
      }));
  }

  if (Array.isArray(education)) {
    user.resumeAnalysis.education = education
      .filter((ed) => ed && typeof ed === "object" && typeof ed.institution === "string")
      .map((ed) => ({
        institution: String(ed.institution).trim(),
        degree: String(ed.degree || "").trim(),
        field: String(ed.field || "").trim(),
        duration: String(ed.duration || "").trim(),
      }));
  }

  // Calculate career score based on profile completeness
  const skillCount = user.skills.length;
  const projectCount = user.resumeAnalysis.projects.length;
  const expCount = user.resumeAnalysis.experience.length;
  const eduCount = user.resumeAnalysis.education.length;

  const dynamicScore = Math.min(
    98,
    Math.max(
      user.careerScore || 0,
      40 +
        Math.min(25, skillCount * 5) +
        Math.min(15, projectCount * 5) +
        Math.min(15, expCount * 5) +
        (eduCount > 0 ? 5 : 0)
    )
  );

  user.careerScore = dynamicScore;
  user.resumeAnalysis.careerScore = dynamicScore;

  user.markModified("resumeAnalysis");
  await user.save();

  res.status(200).json({
    success: true,
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
  });
};