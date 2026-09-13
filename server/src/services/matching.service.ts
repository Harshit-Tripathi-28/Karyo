import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import type { IUser } from "../models/User";
import type {
  RawJob,
  MatchedOpportunity,
  SupportingEvidence,
} from "../types/opportunity";

const COMMON_TECH_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Svelte",
  "Node.js", "Express", "NestJS", "Python", "Django", "FastAPI", "Flask",
  "Go", "Golang", "Rust", "Java", "Spring", "C#", ".NET", "C++",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "GraphQL", "REST",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux",
  "Tailwind", "HTML", "CSS", "Git", "GitHub", "Microservices", "System Design",
  "AI/ML", "Machine Learning", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn",
  "Unit Testing", "Jest", "Cypress", "Agile", "Scrum", "DevOps", "Cybersecurity",
];

const SKILL_SYNONYMS: Record<string, string> = {
  js: "JavaScript",
  ts: "TypeScript",
  reactjs: "React",
  "react.js": "React",
  nodejs: "Node.js",
  "node.js": "Node.js",
  golang: "Go",
  postgres: "PostgreSQL",
  mongo: "MongoDB",
  tailwind: "Tailwind",
  tailwindcss: "Tailwind",
  k8s: "Kubernetes",
  "ci/cd": "CI/CD",
  cicd: "CI/CD",
  "next.js": "Next.js",
  nextjs: "Next.js",
  gcp: "GCP",
  aws: "AWS",
  azure: "Azure",
  docker: "Docker",
};

const ADJACENT_SKILLS_MAP: Record<string, string[]> = {
  react: ["Next.js", "TypeScript", "Tailwind", "Redux", "GraphQL"],
  "node.js": ["Express", "MongoDB", "PostgreSQL", "Docker", "REST"],
  typescript: ["React", "Node.js", "GraphQL", "Jest"],
  python: ["FastAPI", "Django", "Docker", "PostgreSQL", "Pandas"],
  aws: ["Docker", "Kubernetes", "Terraform", "CI/CD"],
  docker: ["Kubernetes", "CI/CD", "AWS", "Linux"],
  mongodb: ["Node.js", "Express", "Redis", "Mongoose"],
  postgresql: ["SQL", "Prisma", "Node.js", "Redis"],
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSkill(raw: string): string {
  const clean = raw.trim().toLowerCase();
  return SKILL_SYNONYMS[clean] || raw.trim();
}

/**
 * Extract requirements from job tags, title, and description
 */
export function extractJobRequirements(job: RawJob, userSkills: string[]): string[] {
  const reqs = new Set<string>();

  // Add tags from job
  job.tags.forEach((tag) => {
    const norm = normalizeSkill(tag);
    if (norm.length > 1) {
      reqs.add(norm);
    }
  });

  const fullText = `${job.title} ${job.description}`;

  // Search for common tech skills in text
  COMMON_TECH_SKILLS.forEach((skill) => {
    const pattern = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
    if (pattern.test(fullText)) {
      reqs.add(skill);
    }
  });

  // Search if any of the candidate's existing skills are explicitly mentioned
  userSkills.forEach((userSkill) => {
    const pattern = new RegExp(`\\b${escapeRegex(userSkill)}\\b`, "i");
    if (pattern.test(fullText)) {
      reqs.add(userSkill);
    }
  });

  // Fallback: If no tech skills were recognized, extract high-signal title keywords
  if (reqs.size === 0) {
    const titleWords = job.title
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["senior", "junior", "lead", "staff", "director", "manager", "remote"].includes(w.toLowerCase()));
    titleWords.slice(0, 4).forEach((w) => reqs.add(w));
  }

  return Array.from(reqs);
}

/**
 * Deterministically match a user profile against a real job opportunity
 */
export function matchJobToUser(user: IUser, job: RawJob): MatchedOpportunity {
  const userSkills = (user.skills || []).map(normalizeSkill);
  const userSkillsLower = new Set(userSkills.map((s) => s.toLowerCase()));

  const targetRole = user.targetRole || user.resumeAnalysis?.targetRole || "";
  const projects = user.resumeAnalysis?.projects || [];
  const experience = user.resumeAnalysis?.experience || [];

  const requiredSkills = extractJobRequirements(job, userSkills);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach((req) => {
    if (userSkillsLower.has(req.toLowerCase())) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  // 1. Skill Coverage (0 - 100)
  const totalReq = requiredSkills.length;
  const skillCoverage = totalReq > 0 ? (matchedSkills.length / totalReq) * 100 : 50;

  // 2. Role Affinity (0 - 100)
  let roleAffinity = 40;
  if (targetRole) {
    const targetWords = targetRole.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const jobTitleLower = job.title.toLowerCase();
    const matchingWords = targetWords.filter((w) => jobTitleLower.includes(w));
    if (targetWords.length > 0) {
      roleAffinity = Math.round((matchingWords.length / targetWords.length) * 100);
      if (roleAffinity < 30 && jobTitleLower.includes(targetWords[0])) {
        roleAffinity = 50;
      }
    }
  }

  // 3. Evidence Backing (Projects & Experience)
  const matchedProjectEvidence: SupportingEvidence["projects"] = [];
  const matchedExpEvidence: SupportingEvidence["experience"] = [];
  const skillsWithEvidence = new Set<string>();

  projects.forEach((proj) => {
    const projTechLower = (proj.technologies || []).map((t) => t.toLowerCase());
    const matchedInProj: string[] = [];

    matchedSkills.forEach((skill) => {
      const sLower = skill.toLowerCase();
      const inTech = projTechLower.includes(sLower);
      const inText = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i").test(
        `${proj.name} ${proj.description}`
      );
      if (inTech || inText) {
        matchedInProj.push(skill);
        skillsWithEvidence.add(sLower);
      }
    });

    if (matchedInProj.length > 0) {
      matchedProjectEvidence.push({
        name: proj.name,
        description: proj.description,
        matchedSkills: matchedInProj,
      });
    }
  });

  experience.forEach((exp) => {
    const matchedInExp: string[] = [];

    matchedSkills.forEach((skill) => {
      const sLower = skill.toLowerCase();
      const inHighlights = (exp.highlights || []).some((h) =>
        new RegExp(`\\b${escapeRegex(skill)}\\b`, "i").test(h)
      );
      const inRole = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i").test(exp.role);
      if (inHighlights || inRole) {
        matchedInExp.push(skill);
        skillsWithEvidence.add(sLower);
      }
    });

    if (matchedInExp.length > 0) {
      matchedExpEvidence.push({
        company: exp.company,
        role: exp.role,
        matchedSkills: matchedInExp,
      });
    }
  });

  const evidenceCoverage =
    matchedSkills.length > 0
      ? Math.min(100, Math.round((skillsWithEvidence.size / matchedSkills.length) * 100))
      : 0;

  // Composite Deterministic Score: 50% Skills + 30% Role Affinity + 20% Evidence
  let rawScore = Math.round(
    skillCoverage * 0.5 + roleAffinity * 0.3 + evidenceCoverage * 0.2
  );

  // Reasonable score bounding
  rawScore = Math.max(15, Math.min(98, rawScore));

  // Adjacent / Recommended Skills
  const adjacentSet = new Set<string>();
  matchedSkills.forEach((s) => {
    const adj = ADJACENT_SKILLS_MAP[s.toLowerCase()];
    if (adj) {
      adj.forEach((a) => {
        if (!userSkillsLower.has(a.toLowerCase()) && !adjacentSet.has(a)) {
          adjacentSet.add(a);
        }
      });
    }
  });
  const adjacentSkills = Array.from(adjacentSet).slice(0, 4);

  // Deterministic Explainability Rationale
  let matchExplanation = "";
  if (matchedSkills.length > 0) {
    const skillList = matchedSkills.slice(0, 3).join(", ");
    const evidenceNotice =
      matchedProjectEvidence.length > 0
        ? ` Backed by your project "${matchedProjectEvidence[0].name}".`
        : matchedExpEvidence.length > 0
        ? ` Reinforced by experience at ${matchedExpEvidence[0].company}.`
        : "";
    const gapNotice =
      missingSkills.length > 0
        ? ` Recommended gap to close: ${missingSkills[0]}.`
        : "";

    matchExplanation = `Strong alignment with verified competencies in ${skillList}.${evidenceNotice}${gapNotice}`;
  } else {
    matchExplanation = `Role aligned with target discipline "${targetRole || "Engineering"}". Expand relevant stack to increase competency match.`;
  }

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo,
    location: job.location,
    remote: job.remote,
    jobType: job.jobType,
    url: job.url,
    salary: job.salary,
    postedAt: job.postedAt,
    description: job.description,
    requiredSkills,
    matchScore: rawScore,
    matchedSkills,
    missingSkills,
    adjacentSkills,
    matchExplanation,
    supportingEvidence: {
      projects: matchedProjectEvidence,
      experience: matchedExpEvidence,
    },
  };
}

/**
 * Optional Gemini semantic enhancement for top matched opportunities
 */
export async function enhanceMatchesWithAI(
  user: IUser,
  matches: MatchedOpportunity[]
): Promise<MatchedOpportunity[]> {
  if (!env.geminiApiKey || matches.length === 0) {
    return matches;
  }

  try {
    const topMatches = matches.slice(0, 3);
    const client = new GoogleGenAI({ apiKey: env.geminiApiKey });

    const prompt = `You are KARYO's neural career intelligence engine.
Given the candidate's verified skills: ${user.skills.join(", ")}
Target role: ${user.targetRole || "Software Engineer"}

For each of these ${topMatches.length} job matches, provide a 1-2 sentence concise, explainable rationale on why the role matches the candidate's actual background and what key competency gap they should bridge.
NEVER invent qualifications, skills, or job details.

Jobs:
${topMatches.map((m, i) => `${i + 1}. Title: "${m.title}" at "${m.company}". Matched: [${m.matchedSkills.join(", ")}]. Gaps: [${m.missingSkills.join(", ")}]`).join("\n")}

Respond ONLY with valid JSON in this format:
[
  { "index": 1, "explanation": "string" }
]`;

    const response = await client.models.generateContent({
      model: env.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const raw = response.text?.trim();
    if (!raw) return matches;

    const parsed = JSON.parse(
      raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "")
    ) as Array<{ index: number; explanation: string }>;

    parsed.forEach((item) => {
      const idx = item.index - 1;
      if (topMatches[idx] && item.explanation?.trim()) {
        topMatches[idx].matchExplanation = item.explanation.trim();
      }
    });

    return matches;
  } catch (err) {
    console.warn(
      "[KARYO MATCHING] AI semantic enhancement fallback to deterministic rationale:",
      err instanceof Error ? err.message : err
    );
    return matches;
  }
}
