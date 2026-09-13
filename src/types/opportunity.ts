export interface SupportingEvidence {
  projects: {
    name: string;
    description?: string;
    matchedSkills: string[];
  }[];
  experience: {
    company: string;
    role: string;
    matchedSkills: string[];
  }[];
}

export interface MatchedOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  jobType: string;
  url: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  postedAt?: string;
  description: string;
  requiredSkills: string[];

  // Matching intelligence
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  adjacentSkills: string[];
  matchExplanation: string;
  supportingEvidence: SupportingEvidence;
}

export interface OpportunityQueryFilters {
  query?: string;
  location?: string;
  remoteOnly?: boolean;
  minScore?: number;
  sortBy?: "score" | "date";
}

export interface OpportunityResponse {
  success: boolean;
  count: number;
  hasProfile: boolean;
  targetRole: string;
  opportunities: MatchedOpportunity[];
}
