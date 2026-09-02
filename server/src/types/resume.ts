export interface ResumeAnalysis {
  professionalSummary: string;

  targetRole: string;

  careerScore: number;

  skills: string[];

  experience: {
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }[];

  education: {
    institution: string;
    degree: string;
    field: string;
    duration: string;
  }[];

  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];

  strengths: string[];

  skillGaps: string[];

  recommendations: string[];
}