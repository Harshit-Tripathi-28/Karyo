import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  LogOut,
  Network,
  Sparkles,
  Target,
  Upload,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { useAuth } from "../../context/AuthContext";
import {
  analyzeResume,
  type ResumeAnalysis,
} from "../../services/resume.service";

export default function Dashboard() {
  const {
    user,
    token,
    logout,
  } = useAuth();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [analysis, setAnalysis] =
    useState<ResumeAnalysis | null>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!user) return;

    const savedAnalysis = localStorage.getItem(
      "karyo_resume_analysis"
    );

    if (savedAnalysis) {
      try {
        setAnalysis(
          JSON.parse(savedAnalysis) as ResumeAnalysis
        );
      } catch {
        localStorage.removeItem(
          "karyo_resume_analysis"
        );
      }
    }
  }, [user]);

  if (!user || !token) {
    return null;
  }

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

      setAnalysis(response.resumeAnalysis);

      localStorage.setItem(
        "karyo_resume_analysis",
        JSON.stringify(response.resumeAnalysis)
      );
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

  const displayAnalysis = analysis;

  return (
    <main className="min-h-screen bg-[#020307] text-white">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-3">
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
          </div>

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

          <div className="flex items-center gap-2 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] px-4 py-3">
            <BrainCircuit className="h-4 w-4 text-cyan-200/70" />

            <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/50">
              AI intelligence ready
            </span>
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

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={isUploading}
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

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
              Target role
            </p>

            <p className="mt-4 text-lg text-white/80">
              {analysis?.targetRole ??
                user.targetRole ??
                "Not defined"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
              Skills mapped
            </p>

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
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-violet-300/70" />

                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                    Target role
                  </p>
                </div>

                <p className="mt-5 text-xl text-white/85">
                  {displayAnalysis.targetRole}
                </p>
              </section>
            </div>

            <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                    Capability map
                  </p>

                  <h2 className="mt-2 text-xl font-medium">
                    Skills detected
                  </h2>
                </div>

                <Network className="h-5 w-5 text-cyan-200/30" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {displayAnalysis.skills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04] px-3 py-2 text-xs text-cyan-100/70"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </section>

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
          </>
        )}
      </section>
    </main>
  );
}