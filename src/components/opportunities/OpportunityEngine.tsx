import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  Filter,
  FolderGit2,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { ResumeExperience, ResumeProject } from "../../types/resume";
import type { MatchedOpportunity } from "../../types/opportunity";
import { calculateRoleAlignment, isSafeUrl } from "./opportunityUtils";
import { CATEGORY_CONFIG, categorizeSkill } from "../skills/skillUtils";
import { getOpportunities } from "../../services/opportunity.service";
import { OpportunityDetailModal } from "./OpportunityDetailModal";

interface OpportunityEngineProps {
  targetRole?: string;
  skills?: string[];
  skillGaps?: string[];
  projects?: ResumeProject[];
  experience?: ResumeExperience[];
  careerScore?: number;
  recommendations?: string[];
  token?: string;
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
  token,
  onSkillClick,
}: OpportunityEngineProps) {
  const [activeTab, setActiveTab] = useState<
    "opportunities" | "alignment" | "evidence" | "milestones"
  >("opportunities");

  // Real opportunities state
  const [opportunities, setOpportunities] = useState<MatchedOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "date">("score");
  const [refreshCount, setRefreshCount] = useState(0);

  // Detail modal state
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<MatchedOpportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
  }, [
    targetRole,
    skills,
    skillGaps,
    projects,
    experience,
    careerScore,
    recommendations,
  ]);

  // Fetch real opportunities asynchronously without synchronous setState in effect
  useEffect(() => {
    if (!token) return;

    let isCancelled = false;

    const executeFetch = async () => {
      try {
        const response = await getOpportunities(token, {
          query: activeSearch || targetRole,
          remoteOnly,
          sortBy,
        });

        if (!isCancelled) {
          if (response.success && Array.isArray(response.opportunities)) {
            setOpportunities(response.opportunities);
          } else {
            setOpportunities([]);
          }
          setError("");
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to connect to Opportunity Pipeline"
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [token, activeSearch, targetRole, remoteOnly, sortBy, refreshCount]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setActiveSearch(searchQuery.trim());
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError("");
    setRefreshCount((prev) => prev + 1);
  };

  const handleOpenDetail = (opp: MatchedOpportunity) => {
    setSelectedOpportunity(opp);
    setIsDetailOpen(true);
  };

  // If no target role is set, render the setup required state
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
          <h3 className="mt-4 text-lg font-medium text-white">
            Target Role Required
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
            The Opportunity Engine requires a defined target role to calculate
            competency alignment, identify critical missing skills, and match real
            career opportunities.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-violet-300/20 bg-violet-300/[0.05] px-3.5 py-1.5 text-xs text-violet-200/80">
            <AlertCircle className="h-3.5 w-3.5" />
            Upload a resume or set your target role to activate the live opportunity pipeline.
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
            Opportunity Engine & Role Alignment
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Live career opportunities matched deterministically against verified technical capabilities.
          </p>
        </div>

        {/* Target Role Badge */}
        <div className="flex items-center gap-3 self-start rounded-xl border border-violet-300/20 bg-violet-300/[0.06] px-4 py-2.5 md:self-auto">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-300/[0.08]">
            <Zap className="h-4 w-4 text-violet-200" />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-wider text-violet-200/60">
              Target Objective
            </p>
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
              ? `Exceptional alignment for ${metrics.targetRole}. Your verified stack strongly mirrors live market requirements.`
              : metrics.alignmentScore >= 60
              ? `Solid foundation for ${metrics.targetRole}. Closing targeted gaps will significantly strengthen profile readiness.`
              : `Developing trajectory for ${metrics.targetRole}. Focus on key missing competencies to increase role viability.`}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Skill Coverage
              </p>
              <p className="mt-1 font-semibold text-white/90">
                {metrics.skillCoverageRatio}%{" "}
                <span className="text-[10px] text-white/40">
                  ({metrics.matchingSkillsCount}/
                  {metrics.matchingSkillsCount + metrics.gapSkillsCount})
                </span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Evidence Backing
              </p>
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
                Skills extracted from your verified work and project history matching your target profile.
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

      {/* Navigation Tabs Bar */}
      <div className="mt-8 flex flex-wrap border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setActiveTab("opportunities")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition ${
            activeTab === "opportunities"
              ? "border-cyan-400 text-cyan-200"
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span>Live Opportunities</span>
          {opportunities.length > 0 && (
            <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
              {opportunities.length}
            </span>
          )}
        </button>

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
          Supporting Proof Points (
          {metrics.supportingProjects.length +
            metrics.supportingExperience.length}
          )
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

      {/* Tab Contents */}
      <div className="mt-6">
        {/* ==================================================== */}
        {/* TAB 1: LIVE MATCHED OPPORTUNITIES                   */}
        {/* ==================================================== */}
        {activeTab === "opportunities" && (
          <div className="space-y-6">
            {/* Filters and Search Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex-1 max-w-md"
              >
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder={`Search roles (e.g. ${targetRole || "Frontend, React"})...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 transition focus:border-cyan-400/40 focus:outline-none"
                />
              </form>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Remote Only Toggle */}
                <button
                  type="button"
                  onClick={() => setRemoteOnly(!remoteOnly)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition ${
                    remoteOnly
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                      : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white"
                  }`}
                >
                  <Filter className="h-3 w-3" />
                  Remote Only
                </button>

                {/* Sort Toggle */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "score" | "date")}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/70 transition hover:border-white/20 focus:outline-none"
                >
                  <option value="score">Sort: Highest Match</option>
                  <option value="date">Sort: Most Recent</option>
                </select>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-2 text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-200 disabled:opacity-40"
                  title="Refresh opportunities"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center justify-between rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4 text-xs text-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="rounded-lg border border-red-400/30 px-3 py-1 font-medium hover:bg-red-400/10"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-28 rounded bg-white/10" />
                      <div className="h-6 w-16 rounded bg-white/10" />
                    </div>
                    <div className="mt-3 h-5 w-48 rounded bg-white/10" />
                    <div className="mt-2 h-3 w-32 rounded bg-white/5" />
                    <div className="mt-4 flex gap-2">
                      <div className="h-6 w-14 rounded bg-white/5" />
                      <div className="h-6 w-16 rounded bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Opportunity Cards List */}
            {!isLoading && opportunities.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {opportunities.map((opp) => {
                  const scorePill =
                    opp.matchScore >= 80
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : opp.matchScore >= 60
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      : "border-amber-400/30 bg-amber-400/10 text-amber-300";

                  return (
                    <div
                      key={opp.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-black/30 p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.02]"
                    >
                      <div>
                        {/* Top Meta Bar */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            {opp.companyLogo ? (
                              <img
                                src={opp.companyLogo}
                                alt={opp.company}
                                className="h-8 w-8 rounded-lg border border-white/10 object-contain bg-white/5 p-0.5"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white/70">
                                {opp.company.charAt(0)}
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-medium text-white/70">
                                {opp.company}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-white/35">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5" />
                                  {opp.location}
                                </span>
                                {opp.remote && (
                                  <span className="text-cyan-300">Remote</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Match Score Badge */}
                          <div
                            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-mono font-bold ${scorePill}`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {opp.matchScore}%
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="mt-3 text-base font-semibold tracking-tight text-white/90 group-hover:text-cyan-200 transition">
                          {opp.title}
                        </h4>

                        {/* Explanation snippet */}
                        <p className="mt-2 text-xs leading-5 text-white/45 line-clamp-2">
                          {opp.matchExplanation}
                        </p>

                        {/* Matched Skills Tags */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {opp.matchedSkills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSkillClick?.(s);
                              }}
                              className="cursor-pointer rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] px-2 py-0.5 text-[10px] font-medium text-emerald-200 transition hover:border-emerald-400/40"
                            >
                              ✓ {s}
                            </span>
                          ))}
                          {opp.missingSkills.slice(0, 2).map((g) => (
                            <span
                              key={g}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSkillClick?.(g);
                              }}
                              className="cursor-pointer rounded-md border border-rose-400/20 bg-rose-400/[0.06] px-2 py-0.5 text-[10px] font-medium text-rose-200 transition hover:border-rose-400/40"
                            >
                              + {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4 text-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(opp)}
                          className="font-medium text-cyan-300 transition hover:text-cyan-200"
                        >
                          Inspect Match Breakdown →
                        </button>

                        {opp.url && isSafeUrl(opp.url) ? (
                          <a
                            href={opp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white/40 hover:text-white transition"
                            title="Apply on external job portal"
                          >
                            <span>Apply</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-white/20 cursor-not-allowed"
                            title="Application link unavailable"
                          >
                            <span>Apply</span>
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State when 0 jobs matched */}
            {!isLoading && opportunities.length === 0 && !error && (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
                <Building2 className="mx-auto h-8 w-8 text-white/30" />
                <h4 className="mt-3 text-sm font-medium text-white">
                  No Opportunities Found
                </h4>
                <p className="mt-1 text-xs text-white/40">
                  Try clearing your search query or toggling remote filters to see all available tech positions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearch("");
                    setRemoteOnly(false);
                  }}
                  className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-xs text-white/70 hover:text-white hover:border-white/20"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: COMPETENCY BREAKDOWN                         */}
        {/* ==================================================== */}
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

        {/* ==================================================== */}
        {/* TAB 3: EVIDENCE / PROOF POINTS                      */}
        {/* ==================================================== */}
        {activeTab === "evidence" && (
          <div className="space-y-6">
            {/* Supporting Projects */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <FolderGit2 className="h-4 w-4 text-cyan-200" />
                <span>
                  Supporting Technical Projects ({metrics.supportingProjects.length})
                </span>
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
                <span>
                  Supporting Employment Positions ({metrics.supportingExperience.length})
                </span>
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
                        <span className="text-[10px] text-white/40">
                          {exp.duration}
                        </span>
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

        {/* ==================================================== */}
        {/* TAB 4: MILESTONES ROADMAP                           */}
        {/* ==================================================== */}
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

      {/* Live Pipeline Status Banner */}
      <div className="mt-8 flex flex-col justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/30 p-4 text-xs text-white/40 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-ping" />
          <span className="font-medium text-white/60">
            Live Opportunity Pipeline:
          </span>
          <span>
            {opportunities.length > 0
              ? `${opportunities.length} real postings matched against ${skills.length} verified competencies.`
              : "Connected to real-time tech opportunity feeds."}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-200/60">
          Pillar 03 Active
        </span>
      </div>

      {/* Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSkillClick={onSkillClick}
      />
    </section>
  );
}