import { Briefcase, Building2, Calendar } from "lucide-react";
import type { ResumeExperience } from "../../types/resume";

interface ExperienceTimelineProps {
  experience?: ResumeExperience[];
}

export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  const items = experience?.filter((item) => Boolean(item.company || item.role)) ?? [];

  return (
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-cyan-200/70" />
            <p className="text-[9px] uppercase tracking-[0.25em] text-cyan-200/50">
              Career History
            </p>
          </div>
          <h2 className="mt-2 text-xl font-medium text-white">Work Experience</h2>
        </div>

        {items.length > 0 && (
          <span className="self-start sm:self-auto rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-1 text-xs font-medium text-cyan-200/80">
            {items.length} {items.length === 1 ? "Position" : "Positions"}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-6 text-center text-sm text-white/35">
          No formal work experience records detected in the uploaded resume.
        </div>
      ) : (
        <div className="relative mt-8 pl-6 sm:pl-8">
          {/* Vertical timeline line */}
          <div className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-gradient-to-b from-cyan-400/40 via-violet-400/20 to-transparent sm:left-[15px]" />

          <div className="space-y-8">
            {items.map((exp, index) => {
              const hasRole = Boolean(exp.role?.trim());
              const hasCompany = Boolean(exp.company?.trim());
              const hasDuration = Boolean(exp.duration?.trim());
              const highlights = exp.highlights?.filter((h) => Boolean(h?.trim())) ?? [];

              return (
                <div key={`${exp.company}-${exp.role}-${index}`} className="relative group">
                  {/* Timeline node marker */}
                  <div className="absolute -left-[29px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan-300 bg-[#020307] ring-4 ring-cyan-400/10 transition-all group-hover:scale-110 group-hover:border-cyan-200 group-hover:ring-cyan-400/25 sm:-left-[37px]" />

                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5 transition hover:border-cyan-300/20 hover:bg-white/[0.03]">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <h3 className="text-base font-semibold text-white/90">
                          {hasRole ? exp.role : "Role not specified"}
                        </h3>

                        {hasCompany && (
                          <div className="mt-1 flex items-center gap-1.5 text-sm text-cyan-200/80">
                            <Building2 className="h-3.5 w-3.5 opacity-70" />
                            <span>{exp.company}</span>
                          </div>
                        )}
                      </div>

                      {hasDuration && (
                        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-white/50">
                          <Calendar className="h-3 w-3 opacity-60" />
                          <span>{exp.duration}</span>
                        </div>
                      )}
                    </div>

                    {highlights.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-white/[0.05] pt-3">
                        {highlights.map((highlight, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2.5 text-sm leading-6 text-white/50"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/60" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
