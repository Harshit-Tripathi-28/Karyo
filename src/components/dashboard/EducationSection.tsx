import { Calendar, GraduationCap, School } from "lucide-react";
import type { ResumeEducation } from "../../types/resume";

interface EducationSectionProps {
  education?: ResumeEducation[];
}

export function EducationSection({ education }: EducationSectionProps) {
  const items =
    education?.filter((item) =>
      Boolean(item.institution || item.degree || item.field)
    ) ?? [];

  return (
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-violet-300/70" />
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              Academic Background
            </p>
          </div>
          <h2 className="mt-2 text-xl font-medium text-white">
            Education & Credentials
          </h2>
        </div>

        {items.length > 0 && (
          <span className="self-start sm:self-auto rounded-full border border-violet-300/15 bg-violet-300/[0.05] px-3 py-1 text-xs font-medium text-violet-200/80">
            {items.length} {items.length === 1 ? "Credential" : "Credentials"}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-6 text-center text-sm text-white/35">
          No formal education or academic records detected in the uploaded resume.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((edu, index) => {
            const hasDegree = Boolean(edu.degree?.trim());
            const hasField = Boolean(edu.field?.trim());
            const hasInstitution = Boolean(edu.institution?.trim());
            const hasDuration = Boolean(edu.duration?.trim());

            return (
              <div
                key={`${edu.institution}-${edu.degree}-${index}`}
                className="flex flex-col justify-between rounded-xl border border-white/[0.06] bg-black/20 p-5 transition hover:border-violet-300/20 hover:bg-white/[0.03]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white/90">
                      {hasDegree ? edu.degree : "Degree / Certificate"}
                    </h3>

                    {hasDuration && (
                      <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/45">
                        <Calendar className="h-3 w-3 opacity-60" />
                        <span>{edu.duration}</span>
                      </div>
                    )}
                  </div>

                  {hasField && (
                    <p className="mt-1 text-sm font-medium text-violet-200/70">
                      {edu.field}
                    </p>
                  )}
                </div>

                {hasInstitution && (
                  <div className="mt-4 flex items-center gap-2 border-t border-white/[0.05] pt-3 text-xs text-white/50">
                    <School className="h-3.5 w-3.5 text-cyan-200/70" />
                    <span>{edu.institution}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
