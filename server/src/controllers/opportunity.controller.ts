import { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { fetchRealJobs } from "../services/jobProvider.service";
import {
  matchJobToUser,
  enhanceMatchesWithAI,
} from "../services/matching.service";
import type { MatchedOpportunity } from "../types/opportunity";

export const getOpportunities = async (
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

  const queryParam = typeof req.query.query === "string" ? req.query.query.trim() : "";
  const locationParam = typeof req.query.location === "string" ? req.query.location.trim() : "";
  const remoteOnly = req.query.remoteOnly === "true";
  const sortBy = req.query.sortBy === "date" ? "date" : "score";
  const minScore = Number(req.query.minScore) || 0;

  // Derive search keyword from user profile if not explicitly provided
  const targetRole = user.targetRole || user.resumeAnalysis?.targetRole || "";
  const searchQuery =
    queryParam ||
    targetRole ||
    (user.skills.length > 0 ? user.skills[0] : "developer");

  const rawJobs = await fetchRealJobs({
    query: searchQuery,
    location: locationParam,
    remoteOnly,
    limit: 40,
  });

  // Deterministically match user skills against every real job posting
  let matchedOpportunities: MatchedOpportunity[] = rawJobs.map((job) =>
    matchJobToUser(user, job)
  );

  // Filter by minScore if requested
  if (minScore > 0) {
    matchedOpportunities = matchedOpportunities.filter((o) => o.matchScore >= minScore);
  }

  // Sort
  if (sortBy === "date") {
    matchedOpportunities.sort((a, b) => {
      const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return timeB - timeA;
    });
  } else {
    matchedOpportunities.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Optional AI explanation enhancement on top matches
  if (matchedOpportunities.length > 0) {
    matchedOpportunities = await enhanceMatchesWithAI(user, matchedOpportunities);
  }

  res.status(200).json({
    success: true,
    count: matchedOpportunities.length,
    hasProfile: Boolean(user.skills.length || user.targetRole),
    targetRole,
    opportunities: matchedOpportunities,
  });
};

export const getOpportunityById = async (
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

  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Opportunity ID is required");
  }

  const rawJobs = await fetchRealJobs({ limit: 50 });
  const rawJob = rawJobs.find((j) => j.id === id);

  if (!rawJob) {
    throw new ApiError(404, "Opportunity not found or expired");
  }

  const matched = matchJobToUser(user, rawJob);

  res.status(200).json({
    success: true,
    opportunity: matched,
  });
};
