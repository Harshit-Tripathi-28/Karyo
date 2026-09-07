import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FolderGit2,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { ResumeExperience, ResumeProject } from "../../types/resume";
import {
  calculateRoleAlignment,
  type CareerOpportunity,
} from "./opportunityUtils";
import { CATEGORY_CONFIG, categorizeSkill } from "../skills/skillUtils";

interface OpportunityEngineProps {
  targetRole?: string;
  skills?: string[];
  skillGaps?: string[];
  projects?: ResumeProject[];
  experience?: ResumeExperience[];
  careerScore?: number;
  recommendations?: string[];
  opportunities?: CareerOpportunity[];
  onSkillClick?: (skillName: string) => void;
}

export function OpportunityEngine({
  targetRole,
  skills = [],
  skillGaps = [],
  projects = [],
  experience = [],
  careerScore = 0,
  recommendations = [],
  opportunities = [],
  onSkillClick,
}: OpportunityEngineProps) {
  const [activeTab, setActiveTab] = useState<"alignment" | "evidence" | "milestones">("alignment");

  const metrics = useMemo(() => {
    return calculateRoleAlignment(
      targetRole,
      skills,
      skillGaps,
      projects,
      experience,
      careerScore,
      recommendations
    );
  }, [targetRole, skills, skillGaps, projects, experience, careerScore, recommendations]);

  // If no target role is set, render the clear setup state
  if (!metrics.hasTargetRole) {
    return (
      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-300/70" />
          <span className="text-[9px] uppercase tracking-[0.28em] text-violet-200/50">
            Pillar 03 / Opportunity Engine
          </span>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-300/[0.05]">
            <Target className="h-6 w-6 text-violet-200" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">Target Role Required</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
            The Opportunity Engine requires a defined target role to calculate competency alignment, identify critical missing skills, and generate a career roadmap.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-violet-300/20 bg-violet-300/[0.05] px-3.5 py-1.5 text-xs text-violet-200/80">
            <AlertCircle className="h-3.5 w-3.5" />
            Upload a resume or set your target role to activate alignment calculations.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 lg:p-7 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-300/70" />
            <span className="text-[9px] uppercase tracking-[0.28em] text-violet-200/50">
              Pillar 03 / Opportunity Engine
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Role Alignment & Career Engine
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Target role readiness evaluated against verified technical capabilities and proof points.
          </p>
        </div>

        {/* Target Role Badge */}
        <div className="flex items-center gap-3 self-start rounded-xl border border-violet-300/20 bg-violet-300/[0.06] px-4 py-2.5 md:self-auto">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-300/[0.08]">
            <Zap className="h-4 w-4 text-violet-200" />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-wider text-violet-200/60">Target Objective</p>
            <p className="text-sm font-semibold text-white">{metrics.targetRole}</p>
          </div>
        </div>
      </div>

      {/* Primary Alignment Hero Card */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1.8fr]">
        {/* Alignment Gauge Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 p-6">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              Competency Alignment
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/[0.05] px-2.5 py-0.5 text-[10px] font-medium text-cyan-200">
              <TrendingUp className="h-3 w-3" />
              Calculated
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight text-white">
              {metrics.alignmentScore}%
            </span>
            <span className="text-sm text-white/40">Role Readiness</span>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${metrics.alignmentScore}%` }}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-white/45">
            {metrics.alignmentScore >= 80
              ? `Exceptional alignment for ${metrics.targetRole}. Your verified stack strongly mirrors role expectations.`
              : metrics.alignmentScore >= 60
              ? `Solid foundation for ${metrics.targetRole}. Closing targeted gaps will significantly strengthen profile readiness.`
              : `Developing trajectory for ${metrics.targetRole}. Focus on key missing competencies to increase role viability.`}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30">Skill Coverage</p>
              <p className="mt-1 font-semibold text-white/90">
                {metrics.skillCoverageRatio}%{" "}
                <span className="text-[10px] text-white/40">
                  ({metrics.matchingSkillsCount}/{metrics.matchingSkillsCount + metrics.gapSkillsCount})
                </span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30">Evidence Backing</p>
              <p className="mt-1 font-semibold text-white/90">
                {metrics.evidenceScore}%{" "}
                <span className="text-[10px] text-white/40">reinforced</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Insights Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Verified Capabilities Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-black/20 p-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-300/80">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Verified Matches ({metrics.matchingSkillsCount})
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Skills extracted from your verified work and project history that match this target role.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {metrics.matchingSkills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  onClick={() => onSkillClick?.(skill)}
                  className="cursor-pointer rounded-md border border-emerald-400/20 bg-emerald-400/[0.05] px-2 py-0.5 text-[11px] text-emerald-200/90 transition hover:border-emerald-400/40"
                >
                  {skill}
                </span>
              ))}
              {metrics.matchingSkillsCount > 6 && (
                <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-white/40">
                  +{metrics.matchingSkillsCount - 6} more
                </span>
              )}
            </div>
          </div>

          {/* Critical Gaps Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-black/20 p-5">
            <div>
              <div className="flex items-center gap-2 text-rose-300/90">
                <Target className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Target Gaps ({metrics.gapSkillsCount})
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Competencies specifically highlighted as missing to reach peak competitiveness.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {metrics.gapSkills.length > 0 ? (
                metrics.gapSkills.map((gap) => (
                  <span
                    key={gap}
                    onClick={() => onSkillClick?.(gap)}
                    className="cursor-pointer rounded-md border border-rose-400/30 bg-rose-400/[0.06] px-2 py-0.5 text-[11px] text-rose-200/90 transition hover:border-rose-400/50"
                  >
                    {gap}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-300/70 italic">
                  No major gaps detected for this role profile!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="mt-8 flex border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setActiveTab("alignment")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition ${
            activeTab === "alignment"
              ? "border-cyan-400 text-cyan-200"
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Competency Breakdown
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("evidence")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition ${
            activeTab === "evidence"
              ? "border-cyan-400 text-cyan-200"
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          <FolderGit2 className="h-3.5 w-3.5" />
          Supporting Proof Points ({metrics.supportingProjects.length + metrics.supportingExperience.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("milestones")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition ${
            activeTab === "milestones"
              ? "border-cyan-400 text-cyan-200"
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Actionable Roadmap ({metrics.actionableMilestones.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* 1. Alignment Tab */}
        {activeTab === "alignment" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Matching Skills Column */}
            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-semibold text-emerald-300">
                  Verified Role Competencies
                </span>
                <span className="text-[11px] text-white/40 font-mono">
                  {metrics.matchingSkills.length} Total
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {metrics.matchingSkills.map((skill) => {
                  const category = categorizeSkill(skill);
                  const conf = CATEGORY_CONFIG[category];

                  return (
                    <div
                      key={skill}
                      onClick={() => onSkillClick?.(skill)}
                      className="group flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-white/80 transition hover:border-cyan-300/30 hover:bg-white/[0.04]"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${conf.dotClass}`} />
                      <span>{skill}</span>
                      <span className="text-[10px] text-white/30 group-hover:text-cyan-200">
                        {category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Gaps Column */}
            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-semibold text-rose-300">
                  Required Skill Gaps
                </span>
                <span className="text-[11px] text-white/40 font-mono">
                  {metrics.gapSkills.length} Recommended
                </span>
              </div>

              {metrics.gapSkills.length > 0 ? (
                <div className="mt-4 space-y-2.5">
                  {metrics.gapSkills.map((gap, idx) => (
                    <div
                      key={gap}
                      onClick={() => onSkillClick?.(gap)}
                      className="flex cursor-pointer items-start justify-between rounded-lg border border-rose-400/20 bg-rose-400/[0.03] p-3 text-xs transition hover:border-rose-400/40 hover:bg-rose-400/[0.06]"
                    >
                      <div>
                        <p className="font-medium text-white/90">{gap}</p>
                        <p className="mt-0.5 text-[11px] text-white/40">
                          Priority competency for {metrics.targetRole}
                        </p>
                      </div>
                      <span className="rounded border border-rose-400/30 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                        Priority 0{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center text-xs text-emerald-300/80">
                  All critical competencies for this target role are satisfied!
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Evidence Tab */}
        {activeTab === "evidence" && (
          <div className="space-y-6">
            {/* Supporting Projects */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <FolderGit2 className="h-4 w-4 text-cyan-200" />
                <span>Supporting Technical Projects ({metrics.supportingProjects.length})</span>
              </div>

              {metrics.supportingProjects.length > 0 ? (
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {metrics.supportingProjects.map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-xs"
                    >
                      <h4 className="font-semibold text-white/90">{p.name}</h4>
                      <p className="mt-1.5 leading-5 text-white/45 line-clamp-2">
                        {p.description}
                      </p>
                      {p.matchedSkills.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.05]">
                          <span className="text-[10px] uppercase tracking-wider text-white/30">
                            Validates:
                          </span>
                          {p.matchedSkills.map((s) => (
                            <span
                              key={s}
                              className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-5 text-xs text-white/35">
                  No projects currently mapped to verified competencies.
                </div>
              )}
            </div>

            {/* Supporting Experience */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Briefcase className="h-4 w-4 text-violet-300" />
                <span>Supporting Employment Positions ({metrics.supportingExperience.length})</span>
              </div>

              {metrics.supportingExperience.length > 0 ? (
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {metrics.supportingExperience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-white/90">{exp.role}</h4>
                        <span className="text-[10px] text-white/40">{exp.duration}</span>
                      </div>
                      <p className="mt-1 text-cyan-200/80">{exp.company}</p>

                      {exp.matchedSkills.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.05]">
                          <span className="text-[10px] uppercase tracking-wider text-white/30">
                            Applied:
                          </span>
                          {exp.matchedSkills.map((s) => (
                            <span
                              key={s}
                              className="rounded bg-violet-400/10 px-2 py-0.5 text-[10px] font-medium text-violet-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-5 text-xs text-white/35">
                  No specific employment positions directly linked to matching skills.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Milestones Tab */}
        {activeTab === "milestones" && (
          <div className="space-y-3">
            {metrics.actionableMilestones.length > 0 ? (
              metrics.actionableMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-black/20 p-4.5 transition hover:border-cyan-300/20 hover:bg-white/[0.02]"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-300/15 bg-cyan-300/[0.05]">
                      <ArrowRight className="h-3.5 w-3.5 text-cyan-200" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white/90">
                        {milestone.title}
                      </h4>
                      <p className="mt-1 text-xs leading-5 text-white/50">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      milestone.priority === "high"
                        ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                        : "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                    }`}
                  >
                    {milestone.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-6 text-center text-xs text-white/40">
                No active milestone recommendations for current profile.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extensible Opportunity Feed Notice (Requirement 8) */}
      <div className="mt-8 rounded-xl border border-white/[0.06] bg-black/30 p-4 text-xs text-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-ping" />
          <span className="text-white/60 font-medium">Live Opportunity Pipeline Architecture:</span>
          <span>
            {opportunities.length > 0
              ? `${opportunities.length} live opportunities matched.`
              : "Role alignment is computed from actual resume data. External live job integrations can plug in directly without UI modification."}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-cyan-200/60 font-mono">
          Pillar 03 Ready
        </span>
      </div>
    </section>
  );
}