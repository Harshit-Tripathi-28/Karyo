import type { ResumeExperience, ResumeProject } from "../../types/resume";

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Data & Storage"
  | "Cloud & DevOps"
  | "AI & Intelligence"
  | "Architecture & Core"
  | "Target Gap";

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  isGap: boolean;
  x: number;
  y: number;
  radius: number;
  connections: string[];
  associatedProjects: { name: string; description: string }[];
  associatedExperience: { company: string; role: string; highlight: string }[];
}

export interface SkillEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  reason?: string;
}

export const CATEGORY_CONFIG: Record<
  SkillCategory,
  {
    label: string;
    color: string;
    glowColor: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  Frontend: {
    label: "Frontend & Interfaces",
    color: "#22d3ee",
    glowColor: "rgba(34, 211, 238, 0.35)",
    badgeClass: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    dotClass: "bg-cyan-400",
  },
  Backend: {
    label: "Backend & Services",
    color: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.35)",
    badgeClass: "border-violet-400/30 bg-violet-400/10 text-violet-200",
    dotClass: "bg-violet-400",
  },
  "Data & Storage": {
    label: "Data & Databases",
    color: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.35)",
    badgeClass: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    dotClass: "bg-emerald-400",
  },
  "Cloud & DevOps": {
    label: "Cloud & Infrastructure",
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.35)",
    badgeClass: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    dotClass: "bg-amber-400",
  },
  "AI & Intelligence": {
    label: "AI & Machine Learning",
    color: "#e879f9",
    glowColor: "rgba(232, 121, 249, 0.35)",
    badgeClass: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
    dotClass: "bg-fuchsia-400",
  },
  "Architecture & Core": {
    label: "Systems & Engineering",
    color: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.35)",
    badgeClass: "border-blue-400/30 bg-blue-400/10 text-blue-200",
    dotClass: "bg-blue-400",
  },
  "Target Gap": {
    label: "Target Role Gaps",
    color: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.4)",
    badgeClass: "border-rose-400/40 bg-rose-400/10 text-rose-200 border-dashed",
    dotClass: "bg-rose-400",
  },
};

const CATEGORY_PATTERNS: Record<Exclude<SkillCategory, "Target Gap">, RegExp[]> = {
  Frontend: [
    /\b(react|next\.?js|vue|angular|svelte|html|css|tailwind|sass|less|javascript|typescript|redux|zustand|mobx|vite|webpack|ui|ux|responsive|frontend|front-end|dom|canvas|three\.?js|flutter|swift|swiftui|react native)\b/i,
  ],
  Backend: [
    /\b(node\.?js|express|nestjs|python|django|fastapi|flask|go|golang|java|spring|spring boot|c#|\.net|asp\.net|ruby|rails|php|laravel|rust|c\+\+|rest|restful|graphql|grpc|microservices|api|socket\.io|websockets|backend|back-end)\b/i,
  ],
  "Data & Storage": [
    /\b(sql|postgres(ql)?|mysql|mongodb|redis|sqlite|cassandra|dynamodb|oracle|elasticsearch|prisma|mongoose|typeorm|snowflake|bigquery|kafka|rabbitmq|etl|data modeling|data warehousing|pandas|numpy|database|nosql)\b/i,
  ],
  "Cloud & DevOps": [
    /\b(aws|azure|gcp|google cloud|docker|kubernetes|k8s|ci\/cd|github actions|gitlab ci|terraform|ansible|linux|bash|shell|nginx|apache|cloud|serverless|lambda|devops|prometheus|grafana|datadog|helm)\b/i,
  ],
  "AI & Intelligence": [
    /\b(machine learning|deep learning|ml|dl|ai|artificial intelligence|pytorch|tensorflow|keras|scikit-learn|nlp|llm|llms|computer vision|opencv|hugging face|langchain|rag|embeddings|prompt engineering|generative ai|neural networks)\b/i,
  ],
  "Architecture & Core": [
    /\b(git|testing|jest|cypress|unit test|tdd|bdd|agile|scrum|kanban|design patterns|oop|functional programming|system design|distributed systems|security|oauth|jwt|algorithms|data structures)\b/i,
  ],
};

export function categorizeSkill(skillName: string, isGap = false): SkillCategory {
  if (isGap) return "Target Gap";

  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS) as [
    Exclude<SkillCategory, "Target Gap">,
    RegExp[]
  ][]) {
    for (const pattern of patterns) {
      if (pattern.test(skillName)) {
        return category;
      }
    }
  }

  return "Architecture & Core";
}

export function buildSkillGraphData(
  skills: string[],
  skillGaps: string[] = [],
  projects: ResumeProject[] = [],
  experience: ResumeExperience[] = []
): { nodes: SkillNode[]; edges: SkillEdge[]; categories: SkillCategory[] } {
  const uniqueSkillMap = new Map<string, { original: string; isGap: boolean }>();

  // Add existing verified skills
  skills.forEach((skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (!uniqueSkillMap.has(lower)) {
      uniqueSkillMap.set(lower, { original: trimmed, isGap: false });
    }
  });

  // Add skill gaps (that are not already in user's skills)
  skillGaps.forEach((gap) => {
    const trimmed = gap.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (!uniqueSkillMap.has(lower)) {
      uniqueSkillMap.set(lower, { original: trimmed, isGap: true });
    }
  });

  const skillEntries = Array.from(uniqueSkillMap.entries());

  if (skillEntries.length === 0) {
    return { nodes: [], edges: [], categories: [] };
  }

  // Pre-calculate associated projects and experience
  const nodeAssociations = new Map<
    string,
    {
      projects: { name: string; description: string }[];
      experience: { company: string; role: string; highlight: string }[];
    }
  >();

  skillEntries.forEach(([id, { original }]) => {
    const skillRegex = new RegExp(`\\b${escapeRegExp(original)}\\b`, "i");

    const matchedProjects = projects
      .filter((p) => {
        const inTech = p.technologies?.some((t) => t.toLowerCase() === id);
        const inName = skillRegex.test(p.name);
        const inDesc = skillRegex.test(p.description);
        return inTech || inName || inDesc;
      })
      .map((p) => ({ name: p.name, description: p.description }));

    const matchedExperience: { company: string; role: string; highlight: string }[] = [];
    experience.forEach((exp) => {
      exp.highlights?.forEach((h) => {
        if (skillRegex.test(h)) {
          matchedExperience.push({
            company: exp.company,
            role: exp.role,
            highlight: h,
          });
        }
      });
    });

    nodeAssociations.set(id, {
      projects: matchedProjects,
      experience: matchedExperience,
    });
  });

  // Build edges based on co-occurrence in projects or experience
  const edgeMap = new Map<string, SkillEdge>();

  const addEdge = (sourceId: string, targetId: string, reason: string) => {
    if (sourceId === targetId) return;
    const [u, v] = [sourceId, targetId].sort();
    const key = `${u}__${v}`;
    const existing = edgeMap.get(key);
    if (existing) {
      existing.weight += 1;
    } else {
      edgeMap.set(key, {
        id: key,
        source: u,
        target: v,
        weight: 1,
        reason,
      });
    }
  };

  // Co-occurrence in projects
  projects.forEach((proj) => {
    const projTech = (proj.technologies || []).map((t) => t.trim().toLowerCase());
    const matchedInProj = skillEntries
      .map(([id]) => id)
      .filter((id) => projTech.includes(id));

    for (let i = 0; i < matchedInProj.length; i++) {
      for (let j = i + 1; j < matchedInProj.length; j++) {
        addEdge(
          matchedInProj[i],
          matchedInProj[j],
          `Co-applied in project "${proj.name}"`
        );
      }
    }
  });

  // Group nodes by category for clean visual clustering
  const categoryGroups = new Map<SkillCategory, string[]>();
  skillEntries.forEach(([id, { original, isGap }]) => {
    const category = categorizeSkill(original, isGap);
    if (!categoryGroups.has(category)) {
      categoryGroups.set(category, []);
    }
    categoryGroups.get(category)!.push(id);
  });

  // Intra-category connecting edges if isolated
  categoryGroups.forEach((nodeIds) => {
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const u = nodeIds[i];
        const v = nodeIds[j];
        const [a, b] = [u, v].sort();
        const key = `${a}__${b}`;
        if (!edgeMap.has(key) && Math.random() < 0.4) {
          edgeMap.set(key, {
            id: key,
            source: a,
            target: b,
            weight: 0.5,
            reason: "Shared domain capability",
          });
        }
      }
    }
  });

  // Layout positions: Circular / Cluster Layout around center (400, 300) in 800x600 canvas
  const centerX = 400;
  const centerY = 300;
  const categoriesPresent = Array.from(categoryGroups.keys());

  const nodes: SkillNode[] = [];
  const nodeConnections = new Map<string, string[]>();

  edgeMap.forEach((edge) => {
    if (!nodeConnections.has(edge.source)) nodeConnections.set(edge.source, []);
    if (!nodeConnections.has(edge.target)) nodeConnections.set(edge.target, []);
    nodeConnections.get(edge.source)!.push(edge.target);
    nodeConnections.get(edge.target)!.push(edge.source);
  });

  categoriesPresent.forEach((category, catIndex) => {
    const catAngle = (catIndex / categoriesPresent.length) * 2 * Math.PI - Math.PI / 2;
    const catRadius = 160 + (catIndex % 2 === 0 ? 0 : 25);
    const catCenterX = centerX + Math.cos(catAngle) * catRadius;
    const catCenterY = centerY + Math.sin(catAngle) * catRadius;

    const nodeIds = categoryGroups.get(category)!;

    nodeIds.forEach((id, itemIndex) => {
      const { original, isGap } = uniqueSkillMap.get(id)!;
      const subAngle = (itemIndex / Math.max(1, nodeIds.length)) * 2 * Math.PI;
      const subRadius = Math.min(65, 20 + nodeIds.length * 7);

      const x = Math.max(
        40,
        Math.min(760, catCenterX + Math.cos(subAngle) * subRadius)
      );
      const y = Math.max(
        40,
        Math.min(560, catCenterY + Math.sin(subAngle) * subRadius)
      );

      const associations = nodeAssociations.get(id) || {
        projects: [],
        experience: [],
      };

      const connections = nodeConnections.get(id) || [];
      const baseRadius = isGap ? 13 : Math.min(22, 14 + associations.projects.length + associations.experience.length);

      nodes.push({
        id,
        name: original,
        category,
        isGap,
        x,
        y,
        radius: baseRadius,
        connections,
        associatedProjects: associations.projects,
        associatedExperience: associations.experience,
      });
    });
  });

  return {
    nodes,
    edges: Array.from(edgeMap.values()),
    categories: categoriesPresent,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
