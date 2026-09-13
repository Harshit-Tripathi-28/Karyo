import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  LogOut,
  Network,
  Pencil,
  Sparkles,
  Target,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  analyzeResume,
  deleteResume,
} from "../../services/resume.service";
import { EducationSection } from "../../components/dashboard/EducationSection";
import { ExperienceTimeline } from "../../components/dashboard/ExperienceTimeline";
import { ProjectsSection } from "../../components/dashboard/ProjectsSection";
import { SkillGraph } from "../../components/skills/SkillGraph";
import { OpportunityEngine } from "../../components/opportunities/OpportunityEngine";
import { ProfileEditorModal } from "../../components/profile/ProfileEditorModal";

export default function Dashboard() {
  const {
    user,
    token,
    logout,
    updateUser,
  } = useAuth();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [isProfileEditorOpen, setIsProfileEditorOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!user || !token) {
    return null;
  }

  const analysis = user.resumeAnalysis ?? null;

  const handleResumeUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Resume must be smaller than 5 MB."
      );
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const response = await analyzeResume(
        token,
        file
      );

      updateUser(response.user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Resume analysis failed"
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleClearResume = async () => {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your current resume and career analysis? This cannot be undone."
    );

    if (!confirmed) return;

    setError("");
    setIsDeleting(true);

    try {
      const response = await deleteResume(token);
      updateUser(response.user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to clear resume"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const displayAnalysis =
    analysis ??
    (user.skills.length > 0 || Boolean(user.targetRole)
      ? {
          professionalSummary: `Career profile for ${user.name}${
            user.targetRole ? ` targeting ${user.targetRole}` : ""
          }.`,
          targetRole: user.targetRole || "",
          careerScore: user.careerScore || 50,
          skills: user.skills,
          experience: [],
          education: [],
          projects: [],
          strengths: user.skills
            .slice(0, 3)
            .map((s) => `Verified competency in ${s}`),
          skillGaps: [],
          recommendations: user.targetRole
            ? [
                `Build focused portfolio projects demonstrating ${user.targetRole} capabilities.`,
              ]
            : [],
        }
      : null);

  return (
    <main className="min-h-screen bg-[#020307] text-white">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link
            to="/"
            className="flex items-center gap-3 transition opacity-90 hover:opacity-100"
            title="Return to KARYO Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06]">
              <Network className="h-5 w-5 text-cyan-200" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.14em]">
                KARYO
              </p>

              <p className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                Career Intelligence
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/45 transition hover:border-white/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex items-center gap-2 text-cyan-200/60">
          <UserRound className="h-4 w-4" />

          <span className="text-[9px] uppercase tracking-[0.28em]">
            Career intelligence
          </span>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em]">
              Welcome, {user.name}.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
              Your career intelligence layer starts with your
              resume. Upload it and let KARYO map your profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsProfileEditorOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-medium text-white/80 transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5 text-cyan-200" />
              Edit profile
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] px-4 py-3">
              <BrainCircuit className="h-4 w-4 text-cyan-200/70" />

              <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/50">
                AI intelligence ready
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.05]">
                <FileText className="h-5 w-5 text-cyan-200/80" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-cyan-200/45">
                  Resume intelligence
                </p>

                <h2 className="mt-2 text-xl font-medium">
                  {analysis
                    ? "Resume analyzed"
                    : "Connect your resume"}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/30">
                  {analysis
                    ? "KARYO has mapped your career profile. You can upload a newer resume anytime."
                    : "Upload a PDF resume. KARYO will extract your career data and build your first intelligence profile."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={isUploading || isDeleting}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <BrainCircuit className="h-4 w-4 animate-pulse" />
                    Analyzing resume...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {analysis
                      ? "Analyze new resume"
                      : "Upload resume"}
                  </>
                )}
              </button>

              {analysis && (
                <button
                  type="button"
                  disabled={isUploading || isDeleting}
                  onClick={handleClearResume}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3.5 text-sm text-red-300 transition hover:border-red-400/40 hover:bg-red-400/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "Clearing..." : "Clear resume"}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-xs text-red-200/80">
              {error}
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
              Career score
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {analysis?.careerScore ??
                user.careerScore}
              <span className="ml-1 text-base text-white/25">
                /100
              </span>
            </p>
          </div>

          <div className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:border-white/15">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Target role
              </p>
              <button
                type="button"
                onClick={() => setIsProfileEditorOpen(true)}
                className="opacity-0 group-hover:opacity-100 transition rounded-md p-1 text-white/40 hover:text-cyan-200"
                title="Edit target role"
                aria-label="Edit target role"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>

            <p className="mt-4 text-lg text-white/80">
              {analysis?.targetRole ||
                user.targetRole ||
                "Not defined"}
            </p>
          </div>

          <div className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:border-white/15">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Skills mapped
              </p>
              <button
                type="button"
                onClick={() => setIsProfileEditorOpen(true)}
                className="opacity-0 group-hover:opacity-100 transition rounded-md p-1 text-white/40 hover:text-cyan-200"
                title="Edit skills"
                aria-label="Edit skills"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {analysis?.skills.length ??
                user.skills.length}
            </p>
          </div>
        </div>

        {displayAnalysis && (
          <>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-200/70" />

                  <p className="text-[9px] uppercase tracking-[0.25em] text-cyan-200/50">
                    AI summary
                  </p>
                </div>

                <p className="mt-5 text-base leading-7 text-white/60">
                  {displayAnalysis.professionalSummary}
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-violet-300/70" />

                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                      Target role
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsProfileEditorOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/50 transition hover:border-violet-300/30 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Pencil className="h-3 w-3 text-violet-300/80" />
                    Edit
                  </button>
                </div>

                <p className="mt-5 text-xl text-white/85">
                  {displayAnalysis.targetRole || "Not defined"}
                </p>
              </section>
            </div>

            <SkillGraph
              skills={displayAnalysis.skills}
              skillGaps={displayAnalysis.skillGaps}
              projects={displayAnalysis.projects}
              experience={displayAnalysis.experience}
              targetRole={displayAnalysis.targetRole || user.targetRole}
            />

            <OpportunityEngine
              targetRole={displayAnalysis.targetRole || user.targetRole}
              skills={displayAnalysis.skills}
              skillGaps={displayAnalysis.skillGaps}
              projects={displayAnalysis.projects}
              experience={displayAnalysis.experience}
              careerScore={displayAnalysis.careerScore || user.careerScore}
              recommendations={displayAnalysis.recommendations}
              token={token}
            />

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300/70" />

                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                    Strengths
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {displayAnalysis.strengths.map(
                    (strength) => (
                      <div
                        key={strength}
                        className="flex gap-3 text-sm leading-6 text-white/45"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300/60" />
                        {strength}
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-amber-300/70" />

                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                    Skill gaps
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {displayAnalysis.skillGaps.map(
                    (gap) => (
                      <div
                        key={gap}
                        className="flex gap-3 text-sm leading-6 text-white/45"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/60" />
                        {gap}
                      </div>
                    )
                  )}
                </div>
              </section>
            </div>

            <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                KARYO recommendations
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {displayAnalysis.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={`${recommendation}-${index}`}
                      className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-6 text-white/45"
                    >
                      <span className="mr-3 text-cyan-200/40">
                        0{index + 1}
                      </span>

                      {recommendation}
                    </div>
                  )
                )}
              </div>
            </section>

            <ExperienceTimeline experience={displayAnalysis.experience} />

            <ProjectsSection projects={displayAnalysis.projects} />

            <EducationSection education={displayAnalysis.education} />
          </>
        )}

        {!displayAnalysis && (
          <section className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-10 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06]">
              <BrainCircuit className="h-6 w-6 text-cyan-200" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-white">
              No Career Intelligence Mapped Yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
              Upload your PDF resume above to unlock your complete career profile
              including detailed work history, key project architecture, education
              credentials, and personalized AI recommendations.
            </p>
          </section>
        )}
      </section>

      <ProfileEditorModal
        isOpen={isProfileEditorOpen}
        onClose={() => setIsProfileEditorOpen(false)}
        user={user}
        token={token}
        onProfileUpdated={(updatedUser) => updateUser(updatedUser)}
      />
    </main>
  );
}