import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  targetRole?: string;
  skills: string[];
  careerScore: number;
  resumeText?: string;
  createdAt: Date;
  updatedAt: Date;
  resumeAnalysis?: {
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
};
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    targetRole: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    skills: {
      type: [String],
      default: [],
    },

    careerScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    resumeText: {
      type: String,
      default: "",
    },
    resumeAnalysis: {
  type: Schema.Types.Mixed,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);