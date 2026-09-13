import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  AlertCircle,
  BrainCircuit,
  Briefcase,
  Check,
  CheckCircle2,
  FolderGit2,
  GraduationCap,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  Target,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";

import type { User } from "../../types/auth";
import type {
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
} from "../../types/resume";
import { updateUserProfile } from "../../services/user.service";
import { CATEGORY_CONFIG, categorizeSkill } from "../skills/skillUtils";

interface ProfileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  token: string;
  onProfileUpdated: (updatedUser: User) => void;
}

export function ProfileEditorModal(props: ProfileEditorModalProps) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <ProfileEditorDialog
      key={`${props.user.id}-${props.user.name}-${props.user.targetRole || ""}`}
      {...props}
    />
  );
}

function ProfileEditorDialog({
  onClose,
  user,
  token,
  onProfileUpdated,
}: ProfileEditorModalProps) {
  const [activeTab, setActiveTab] = useState<
    "general" | "experience" | "projects" | "education"
  >("general");

  // General tab state
  const [name, setName] = useState(user.name || "");
  const [targetRole, setTargetRole] = useState(
    user.resumeAnalysis?.targetRole || user.targetRole || ""
  );
  const [professionalSummary, setProfessionalSummary] = useState(
    user.resumeAnalysis?.professionalSummary || ""
  );
  const [skills, setSkills] = useState<string[]>(
    user.resumeAnalysis?.skills || user.skills || []
  );

  // Experience state
  const [experience, setExperience] = useState<ResumeExperience[]>(
    user.resumeAnalysis?.experience || []
  );

  // Projects state
  const [projects, setProjects] = useState<ResumeProject[]>(
    user.resumeAnalysis?.projects || []
  );

  // Education state
  const [education, setEducation] = useState<ResumeEducation[]>(
    user.resumeAnalysis?.education || []
  );

  const [newSkillInput, setNewSkillInput] = useState("");
  const [skillError, setSkillError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll and focus on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  // Skill Addition
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    if (trimmed.length > 50) {
      setSkillError("Skill name cannot exceed 50 characters.");
      return;
    }

    const isDuplicate = skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setSkillError(`"${trimmed}" is already in your skills list.`);
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setNewSkillInput("");
    setSkillError(null);
    skillInputRef.current?.focus();
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        company: "Company Name",
        role: "Role / Position",
        duration: "e.g. 2023 - Present",
        highlights: ["Contributed to core architecture and feature delivery."],
      },
    ]);
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof ResumeExperience,
    val: string | string[]
  ) => {
    setExperience((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveExperience = (index: number) => {
    setExperience((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Project Handlers
  const handleAddProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        name: "New Technical Project",
        description: "Technical project implementation and design details.",
        technologies: ["TypeScript", "React"],
      },
    ]);
  };

  const handleUpdateProject = (
    index: number,
    field: keyof ResumeProject,
    val: string | string[]
  ) => {
    setProjects((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveProject = (index: number) => {
    setProjects((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Education Handlers
  const handleAddEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        institution: "Institution / University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        duration: "2019 - 2023",
      },
    ]);
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof ResumeEducation,
    val: string
  ) => {
    setEducation((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handle Profile Save
  const handleSave = async () => {
    setFormError(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Full name is required.");
      setActiveTab("general");
      nameInputRef.current?.focus();
      return;
    }

    if (trimmedName.length > 100) {
      setFormError("Full name cannot exceed 100 characters.");
      setActiveTab("general");
      return;
    }

    const trimmedRole = targetRole.trim();
    if (trimmedRole.length > 100) {
      setFormError("Target role cannot exceed 100 characters.");
      setActiveTab("general");
      return;
    }

    // Deduplicate skills case-insensitively
    const uniqueSkillsMap = new Map<string, string>();
    skills.forEach((s) => {
      const clean = s.trim();
      if (clean && !uniqueSkillsMap.has(clean.toLowerCase())) {
        uniqueSkillsMap.set(clean.toLowerCase(), clean);
      }
    });
    const sanitizedSkills = Array.from(uniqueSkillsMap.values());

    setIsSubmitting(true);

    try {
      const response = await updateUserProfile(token, {
        name: trimmedName,
        targetRole: trimmedRole,
        professionalSummary: professionalSummary.trim(),
        skills: sanitizedSkills,
        experience,
        projects,
        education,
      });

      onProfileUpdated(response.user);
      setSuccessMessage("Career profile updated successfully!");

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-editor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200"
    >
      {/* Backdrop Click Dismiss */}
      <div
        className="fixed inset-0"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      {/* Modal Box */}
      <div className="relative z-10 flex flex-col w-full max-w-3xl max-h-[92vh] rounded-3xl border border-white/10 bg-[#06080e] shadow-2xl shadow-cyan-950/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5 sm:px-8">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300/80" />
              <span className="text-[9px] uppercase tracking-[0.28em] text-cyan-200/50">
                Career Profile OS
              </span>
            </div>
            <h2
              id="profile-editor-title"
              className="mt-1 text-xl font-semibold text-white tracking-tight"
            >
              Edit Career Intelligence Profile
            </h2>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.06] bg-black/30 px-6 sm:px-8">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-medium transition ${
              activeTab === "general"
                ? "border-cyan-400 text-cyan-200"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" />
            General & Skills ({skills.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-medium transition ${
              activeTab === "experience"
                ? "border-cyan-400 text-cyan-200"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Work History ({experience.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-medium transition ${
              activeTab === "projects"
                ? "border-cyan-400 text-cyan-200"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            Projects ({projects.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-medium transition ${
              activeTab === "education"
                ? "border-cyan-400 text-cyan-200"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Education ({education.length})
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          {/* Status Banners */}
          {formError && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/[0.07] p-4 text-xs text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="leading-5">{formError}</div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4 text-xs text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: GENERAL & SKILLS */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="profile-name"
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/70"
                >
                  <UserIcon className="h-3.5 w-3.5 text-cyan-200/70" />
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="profile-name"
                  type="text"
                  disabled={isSubmitting}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/40 transition disabled:opacity-50"
                />
              </div>

              {/* Target Role */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="profile-target-role"
                    className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/70"
                  >
                    <Target className="h-3.5 w-3.5 text-violet-300/70" />
                    Target Role
                  </label>
                  <span className="text-[10px] text-white/35">
                    Powers Opportunity Engine
                  </span>
                </div>
                <input
                  id="profile-target-role"
                  type="text"
                  disabled={isSubmitting}
                  value={targetRole}
                  onChange={(e) => {
                    setTargetRole(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. Senior Full Stack Engineer, AI Architect"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-violet-300/50 focus:outline-none focus:ring-1 focus:ring-violet-300/40 transition disabled:opacity-50"
                />
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <label
                  htmlFor="profile-summary"
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/70"
                >
                  <Layers className="h-3.5 w-3.5 text-cyan-200/70" />
                  Professional Summary
                </label>
                <textarea
                  id="profile-summary"
                  rows={3}
                  disabled={isSubmitting}
                  value={professionalSummary}
                  onChange={(e) => setProfessionalSummary(e.target.value)}
                  placeholder="Brief synopsis of your technical capabilities and career focus..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/40 transition disabled:opacity-50 resize-none"
                />
              </div>

              {/* Skills Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="profile-add-skill"
                    className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/70"
                  >
                    <BrainCircuit className="h-3.5 w-3.5 text-cyan-200/70" />
                    Technical Competencies ({skills.length})
                  </label>
                  <span className="text-[10px] text-white/35">
                    Powers Skill Graph
                  </span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      ref={skillInputRef}
                      id="profile-add-skill"
                      type="text"
                      disabled={isSubmitting}
                      value={newSkillInput}
                      onChange={(e) => {
                        setNewSkillInput(e.target.value);
                        if (skillError) setSkillError(null);
                      }}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Add a competency (e.g. TypeScript, Docker, PyTorch)"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-300/40 transition disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting || !newSkillInput.trim()}
                    onClick={handleAddSkill}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Skill
                  </button>
                </div>

                {skillError && (
                  <p className="text-[11px] text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {skillError}
                  </p>
                )}

                {/* Skills Tags */}
                <div className="mt-2 min-h-[90px] rounded-2xl border border-white/[0.07] bg-black/25 p-4">
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => {
                        const category = categorizeSkill(skill);
                        const conf = CATEGORY_CONFIG[category];

                        return (
                          <span
                            key={`${skill}-${index}`}
                            className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] py-1 pl-2.5 pr-1.5 text-xs text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${conf.dotClass}`}
                              title={`Category: ${category}`}
                            />
                            <span>{skill}</span>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleRemoveSkill(index)}
                              aria-label={`Remove ${skill}`}
                              className="ml-1 rounded p-0.5 text-white/30 transition hover:bg-white/10 hover:text-rose-300 disabled:opacity-50"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center text-xs text-white/35">
                      <BrainCircuit className="h-5 w-5 text-white/20 mb-1.5" />
                      <p>No skills configured yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Employment & Work Experience
                  </h3>
                  <p className="text-[11px] text-white/40">
                    Provides verified timeline proof points for Opportunity Engine matching.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Position
                </button>
              </div>

              {experience.length > 0 ? (
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        className="absolute right-4 top-4 text-white/30 hover:text-rose-300 transition"
                        title="Delete position"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] uppercase text-white/40">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) =>
                              handleUpdateExperience(idx, "company", e.target.value)
                            }
                            placeholder="Company Name"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase text-white/40">
                            Role / Designation
                          </label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) =>
                              handleUpdateExperience(idx, "role", e.target.value)
                            }
                            placeholder="e.g. Senior Software Engineer"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-white/40">
                          Duration / Period
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) =>
                            handleUpdateExperience(idx, "duration", e.target.value)
                          }
                          placeholder="e.g. 2022 - 2024"
                          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-white/40">
                          Highlights (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={(exp.highlights || []).join("\n")}
                          onChange={(e) =>
                            handleUpdateExperience(
                              idx,
                              "highlights",
                              e.target.value.split("\n")
                            )
                          }
                          placeholder="Led backend microservices migration using Node.js..."
                          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/35">
                  <Briefcase className="mx-auto h-6 w-6 text-white/20 mb-2" />
                  No employment history added yet. Click &quot;Add Position&quot; above to add your experience.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Technical Projects & Architecture
                  </h3>
                  <p className="text-[11px] text-white/40">
                    Provides concrete technical validation for your competency scores.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Project
                </button>
              </div>

              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="absolute right-4 top-4 text-white/30 hover:text-rose-300 transition"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div>
                        <label className="text-[10px] uppercase text-white/40">
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) =>
                            handleUpdateProject(idx, "name", e.target.value)
                          }
                          placeholder="e.g. Distributed Analytics Engine"
                          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-white/40">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) =>
                            handleUpdateProject(idx, "description", e.target.value)
                          }
                          placeholder="Key implementation details and architecture..."
                          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-white/40">
                          Technologies (comma separated)
                        </label>
                        <input
                          type="text"
                          value={(proj.technologies || []).join(", ")}
                          onChange={(e) =>
                            handleUpdateProject(
                              idx,
                              "technologies",
                              e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                            )
                          }
                          placeholder="e.g. React, TypeScript, GraphQL, AWS"
                          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/35">
                  <FolderGit2 className="mx-auto h-6 w-6 text-white/20 mb-2" />
                  No technical projects documented yet. Click &quot;Add Project&quot; above to add your portfolio work.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Education & Academic Credentials
                  </h3>
                  <p className="text-[11px] text-white/40">
                    Degrees, universities, and technical certifications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Education
                </button>
              </div>

              {education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="absolute right-4 top-4 text-white/30 hover:text-rose-300 transition"
                        title="Delete education"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] uppercase text-white/40">
                            Institution / University
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              handleUpdateEducation(idx, "institution", e.target.value)
                            }
                            placeholder="e.g. Stanford University"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase text-white/40">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              handleUpdateEducation(idx, "degree", e.target.value)
                            }
                            placeholder="e.g. Bachelor of Science"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] uppercase text-white/40">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) =>
                              handleUpdateEducation(idx, "field", e.target.value)
                            }
                            placeholder="e.g. Computer Science"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase text-white/40">
                            Duration / Graduation Year
                          </label>
                          <input
                            type="text"
                            value={edu.duration}
                            onChange={(e) =>
                              handleUpdateEducation(idx, "duration", e.target.value)
                            }
                            placeholder="e.g. 2019 - 2023"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-300/40 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/35">
                  <GraduationCap className="mx-auto h-6 w-6 text-white/20 mb-2" />
                  No education credentials listed yet. Click &quot;Add Education&quot; above.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-6 py-4 sm:px-8 bg-black/40">
          <div className="text-[11px] text-white/40">
            {user.resumeAnalysis
              ? "Merged with verified resume intelligence."
              : "Self-service career profile active."}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSave}
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : successMessage ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
