import { useEffect } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  MapPin,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
import type { MatchedOpportunity } from "../../types/opportunity";
import { isSafeUrl } from "./opportunityUtils";

interface OpportunityDetailModalProps {
  opportunity: MatchedOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSkillClick?: (skillName: string) => void;
}

export function OpportunityDetailModal({
  opportunity,
  isOpen,
  onClose,
  onSkillClick,
}: OpportunityDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !opportunity) return null;

  const scoreColor =
    opportunity.matchScore >= 80
      ? "text-emerald-300 border-emerald-400/30 bg-emerald-400/10"
      : opportunity.matchScore >= 60
      ? "text-cyan-300 border-cyan-400/30 bg-cyan-400/10"
      : "text-amber-300 border-amber-400/30 bg-amber-400/10";

  const progressGradient =
    opportunity.matchScore >= 80
      ? "from-emerald-400 to-cyan-400"
      : opportunity.matchScore >= 60
      ? "from-cyan-400 to-violet-400"
      : "from-amber-400 to-rose-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#07090e] shadow-2xl shadow-cyan-950/40 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative border-b border-white/[0.08] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {opportunity.companyLogo ? (
                <img
                  src={opportunity.companyLogo}
                  alt={opportunity.company}
                  className="h-12 w-12 rounded-xl border border-white/10 object-contain bg-white/5 p-1"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] text-lg font-bold text-cyan-200">
                  {opportunity.company.charAt(0)}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-xs font-medium text-white/60">
                    {opportunity.company}
                  </span>
                  {opportunity.remote && (
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                      Remote
                    </span>
                  )}
                </div>

                <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  {opportunity.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/40">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-white/30" />
                    <span>{opportunity.location}</span>
                  </div>
                  {opportunity.jobType && (
                    <span className="rounded border border-white/10 px-2 py-0.5 text-[10px]">
                      {opportunity.jobType}
                    </span>
                  )}
                  {opportunity.salary && (
                    <span className="font-mono text-emerald-300/80">
                      ${opportunity.salary.min?.toLocaleString()} - $
                      {opportunity.salary.max?.toLocaleString()} /{" "}
                      {opportunity.salary.period}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 p-2 text-white/40 transition hover:border-white/20 hover:text-white"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Match Score Banner */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-black/40 p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border font-mono text-lg font-bold ${scoreColor}`}
              >
                {opportunity.matchScore}%
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  Neural Role Match
                </p>
                <p className="text-xs font-medium text-white/80">
                  {opportunity.matchScore >= 80
                    ? "High Competency Fit"
                    : opportunity.matchScore >= 60
                    ? "Competitive Profile Alignment"
                    : "Growth Trajectory Fit"}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-48">
              <div className="flex justify-between text-[10px] text-white/40">
                <span>Alignment</span>
                <span>{opportunity.matchScore}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${progressGradient}`}
                  style={{ width: `${opportunity.matchScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          {/* Match Explanation */}
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Why You Match This Role
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-white/70">
              {opportunity.matchExplanation}
            </p>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Matched Skills */}
            <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Verified Competencies ({opportunity.matchedSkills.length})
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {opportunity.matchedSkills.length > 0 ? (
                  opportunity.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      onClick={() => onSkillClick?.(skill)}
                      className="cursor-pointer rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-xs text-emerald-200 transition hover:border-emerald-400/40"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-white/40 italic">
                    No direct skill matches detected.
                  </span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-rose-300">
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Target Skill Gaps ({opportunity.missingSkills.length})
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {opportunity.missingSkills.length > 0 ? (
                  opportunity.missingSkills.map((gap) => (
                    <span
                      key={gap}
                      onClick={() => onSkillClick?.(gap)}
                      className="cursor-pointer rounded-lg border border-rose-400/20 bg-rose-400/[0.08] px-2.5 py-1 text-xs text-rose-200 transition hover:border-rose-400/40"
                    >
                      {gap}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-300 italic">
                    You meet all extracted core requirements!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Adjacent Skills */}
          {opportunity.adjacentSkills.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
              <div className="flex items-center gap-2 text-violet-300">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Recommended Adjacent Competencies
                </span>
              </div>
              <p className="mt-1 text-xs text-white/40">
                Skills in the same technology ecosystem that enhance candidacy for this role:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {opportunity.adjacentSkills.map((adj) => (
                  <span
                    key={adj}
                    className="rounded-lg border border-violet-400/20 bg-violet-400/[0.06] px-2.5 py-1 text-xs text-violet-200"
                  >
                    {adj}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Profile Evidence Backing */}
          {(opportunity.supportingEvidence.projects.length > 0 ||
            opportunity.supportingEvidence.experience.length > 0) && (
            <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5">
              <div className="flex items-center gap-2 text-cyan-200/80">
                <FolderGit2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Profile Evidence Used for Match
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {opportunity.supportingEvidence.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white/90">
                        {proj.name}
                      </span>
                      <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-200">
                        Project Proof
                      </span>
                    </div>
                    {proj.description && (
                      <p className="mt-1 text-white/50 line-clamp-2">
                        {proj.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5 pt-1.5 border-t border-white/[0.04]">
                      <span className="text-[10px] uppercase text-white/30">
                        Validates:
                      </span>
                      {proj.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {opportunity.supportingEvidence.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white/90">
                        {exp.role} at {exp.company}
                      </span>
                      <span className="rounded bg-violet-400/10 px-2 py-0.5 text-[10px] text-violet-200">
                        Work Experience Proof
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 pt-1.5 border-t border-white/[0.04]">
                      <span className="text-[10px] uppercase text-white/30">
                        Applied:
                      </span>
                      {exp.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Overview / Description snippet */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Role Scope & Description
            </h4>
            <p className="mt-3 text-xs leading-6 text-white/55 line-clamp-6">
              {opportunity.description ||
                "Full role description and requirements are available on the application portal."}
            </p>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] bg-black/60 p-5 sm:px-7">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <AlertCircle className="h-3.5 w-3.5 text-cyan-200/60" />
            <span>Real verified external opportunity listing</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Close
            </button>

            {isSafeUrl(opportunity.url) ? (
              <a
                href={opportunity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-semibold text-black shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
              >
                <span>Apply on Company Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-semibold text-white/30 cursor-not-allowed"
                title="External application link unavailable"
              >
                <span>Application Link Unavailable</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
