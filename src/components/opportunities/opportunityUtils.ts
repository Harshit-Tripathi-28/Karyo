import type { ResumeExperience, ResumeProject } from "../../types/resume";

export interface SupportingProject {
  name: string;
  description: string;
  technologies: string[];
  matchedSkills: string[];
}

export interface SupportingExperience {
  company: string;
  role: string;
  duration: string;
  matchedSkills: string[];
}

export interface ActionableMilestone {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "skill_gap" | "evidence" | "strategic";
  relatedSkill?: string;
}

export interface RoleAlignmentMetrics {
  targetRole: string;
  hasTargetRole: boolean;
  alignmentScore: number;
  skillCoverageRatio: number;
  evidenceScore: number;
  matchingSkillsCount: number;
  gapSkillsCount: number;
  matchingSkills: string[];
  gapSkills: string[];
  supportingProjects: SupportingProject[];
  supportingExperience: SupportingExperience[];
  actionableMilestones: ActionableMilestone[];
}

export interface CareerOpportunity {
  id: string;
  title: string;
  organization?: string;
  location?: string;
  type?: string;
  url?: string;
  matchScore: number;
  requiredSkills: string[];
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function calculateRoleAlignment(
  targetRole?: string,
  skills: string[] = [],
  skillGaps: string[] = [],
  projects: ResumeProject[] = [],
  experience: ResumeExperience[] = [],
  careerScore = 0,
  recommendations: string[] = []
): RoleAlignmentMetrics {
  const normalizedRole = targetRole?.trim();
  const hasTargetRole = Boolean(normalizedRole);

  if (!hasTargetRole) {
    return {
      targetRole: "",
      hasTargetRole: false,
      alignmentScore: 0,
      skillCoverageRatio: 0,
      evidenceScore: 0,
      matchingSkillsCount: 0,
      gapSkillsCount: 0,
      matchingSkills: [],
      gapSkills: [],
      supportingProjects: [],
      supportingExperience: [],
      actionableMilestones: [],
    };
  }

  // Clean and deduplicate skills
  const cleanSkillsMap = new Map<string, string>();
  skills.forEach((s) => {
    const trimmed = s.trim();
    if (trimmed) {
      cleanSkillsMap.set(trimmed.toLowerCase(), trimmed);
    }
  });

  const matchingSkills = Array.from(cleanSkillsMap.values());

  // Clean gaps that are not already matched
  const cleanGapsMap = new Map<string, string>();
  skillGaps.forEach((g) => {
    const trimmed = g.trim();
    if (trimmed && !cleanSkillsMap.has(trimmed.toLowerCase())) {
      cleanGapsMap.set(trimmed.toLowerCase(), trimmed);
    }
  });

  const gapSkills = Array.from(cleanGapsMap.values());
  const totalEvaluatedSkills = matchingSkills.length + gapSkills.length;

  const skillCoverageRatio =
    totalEvaluatedSkills > 0
      ? Math.round((matchingSkills.length / totalEvaluatedSkills) * 100)
      : 0;

  // Track which skills have project or experience backing
  const skillsWithEvidence = new Set<string>();

  // Supporting Projects
  const supportingProjects: SupportingProject[] = [];
  projects.forEach((proj) => {
    const matchedInProj: string[] = [];
    const projTechLower = (proj.technologies || []).map((t) => t.toLowerCase());

    matchingSkills.forEach((skill) => {
      const sLower = skill.toLowerCase();
      const inTech = projTechLower.includes(sLower);
      const skillRegex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i");
      const inText = skillRegex.test(proj.name) || skillRegex.test(proj.description);

      if (inTech || inText) {
        matchedInProj.push(skill);
        skillsWithEvidence.add(sLower);
      }
    });

    if (matchedInProj.length > 0 || proj.technologies?.length > 0) {
      supportingProjects.push({
        name: proj.name,
        description: proj.description,
        technologies: proj.technologies || [],
        matchedSkills: matchedInProj,
      });
    }
  });

  // Supporting Experience
  const supportingExperience: SupportingExperience[] = [];
  experience.forEach((exp) => {
    const matchedInExp: string[] = [];

    matchingSkills.forEach((skill) => {
      const sLower = skill.toLowerCase();
      const skillRegex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i");
      const inRole = skillRegex.test(exp.role);
      const inHighlights = (exp.highlights || []).some((h) => skillRegex.test(h));

      if (inRole || inHighlights) {
        matchedInExp.push(skill);
        skillsWithEvidence.add(sLower);
      }
    });

    if (matchedInExp.length > 0) {
      supportingExperience.push({
        company: exp.company,
        role: exp.role,
        duration: exp.duration,
        matchedSkills: matchedInExp,
      });
    }
  });

  const evidenceDepthRatio =
    matchingSkills.length > 0
      ? Math.min(1, skillsWithEvidence.size / matchingSkills.length)
      : 0;

  const evidenceScore = Math.round(evidenceDepthRatio * 100);

  // Transparent composite alignment calculation
  let alignmentScore: number;
  if (careerScore > 0) {
    alignmentScore = Math.round(
      0.5 * skillCoverageRatio + 0.3 * careerScore + 0.2 * evidenceScore
    );
  } else {
    alignmentScore = Math.round(
      0.7 * skillCoverageRatio + 0.3 * evidenceScore
    );
  }

  alignmentScore = Math.max(0, Math.min(100, alignmentScore));

  // Actionable Milestones derived strictly from available data
  const actionableMilestones: ActionableMilestone[] = [];

  // 1. Target Skill Gap Milestones
  gapSkills.slice(0, 4).forEach((gap, index) => {
    actionableMilestones.push({
      id: `gap-${index}`,
      title: `Acquire & Verify: ${gap}`,
      description: `Your target role "${normalizedRole}" expects competency in ${gap}. Build practical implementations to close this gap.`,
      priority: index === 0 ? "high" : "medium",
      category: "skill_gap",
      relatedSkill: gap,
    });
  });

  // 2. Project Evidence Milestones
  if (supportingProjects.length === 0 && matchingSkills.length > 0) {
    actionableMilestones.push({
      id: "evidence-proj-missing",
      title: "Document Applied Project Evidence",
      description: "You have verified skills without standalone project backing. Add project case studies showcasing your core technical stack.",
      priority: "high",
      category: "evidence",
    });
  } else if (matchingSkills.length > skillsWithEvidence.size) {
    const unevidenced = matchingSkills
      .filter((s) => !skillsWithEvidence.has(s.toLowerCase()))
      .slice(0, 3)
      .join(", ");
    if (unevidenced) {
      actionableMilestones.push({
        id: "evidence-skills-unbacked",
        title: "Reinforce Skill Evidence in Work & Projects",
        description: `Skills such as ${unevidenced} are listed but lack explicit project or employment bullet evidence.`,
        priority: "medium",
        category: "evidence",
      });
    }
  }

  // 3. Strategic Recommendations from AI analysis
  recommendations.slice(0, 2).forEach((rec, index) => {
    actionableMilestones.push({
      id: `strat-${index}`,
      title: `Strategic Milestone: Step ${index + 1}`,
      description: rec,
      priority: "medium",
      category: "strategic",
    });
  });

  return {
    targetRole: normalizedRole || "",
    hasTargetRole: true,
    alignmentScore,
    skillCoverageRatio,
    evidenceScore,
    matchingSkillsCount: matchingSkills.length,
    gapSkillsCount: gapSkills.length,
    matchingSkills,
    gapSkills,
    supportingProjects,
    supportingExperience,
    actionableMilestones,
  };
}

/**
 * Strict protocol validation for external links.
 * Ensures the URL begins with http:// or https:// to prevent script injection (e.g. javascript:)
 */
export function isSafeUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed);
}