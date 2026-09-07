export interface ResumeExperience {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  duration: string;
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  link?: string;
}

export interface ResumeAnalysis {
  professionalSummary: string;
  targetRole: string;
  careerScore: number;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  strengths: string[];
  skillGaps: string[];
  recommendations: string[];
}
