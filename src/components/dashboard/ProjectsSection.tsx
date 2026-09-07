import { ExternalLink, FolderGit2, Layers } from "lucide-react";
import type { ResumeProject } from "../../types/resume";

interface ProjectsSectionProps {
  projects?: ResumeProject[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const items =
    projects?.filter((item) =>
      Boolean(item.name || item.description)
    ) ?? [];

  return (
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-cyan-200/70" />
            <p className="text-[9px] uppercase tracking-[0.25em] text-cyan-200/50">
              Applied Capabilities
            </p>
          </div>
          <h2 className="mt-2 text-xl font-medium text-white">
            Key Projects & Systems
          </h2>
        </div>

        {items.length > 0 && (
          <span className="self-start sm:self-auto rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-1 text-xs font-medium text-cyan-200/80">
            {items.length} {items.length === 1 ? "Project" : "Projects"}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-6 text-center text-sm text-white/35">
          No standalone projects detected in the uploaded resume.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((project, index) => {
            const hasName = Boolean(project.name?.trim());
            const hasDesc = Boolean(project.description?.trim());
            const techList =
              project.technologies?.filter((t) => Boolean(t?.trim())) ?? [];
            const projectUrl = project.url || project.link;

            return (
              <div
                key={`${project.name}-${index}`}
                className="group flex flex-col justify-between rounded-xl border border-white/[0.06] bg-black/20 p-5 transition hover:border-cyan-300/20 hover:bg-white/[0.03]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.05]">
                        <Layers className="h-3.5 w-3.5 text-cyan-200/70" />
                      </div>
                      <h3 className="text-base font-semibold text-white/90 group-hover:text-white">
                        {hasName ? project.name : "Unnamed Project"}
                      </h3>
                    </div>

                    {projectUrl && (
                      <a
                        href={projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-white/50 transition hover:border-cyan-300/30 hover:text-cyan-200"
                        title="View Project"
                      >
                        <span>Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {hasDesc && (
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {project.description}
                    </p>
                  )}
                </div>

                {techList.length > 0 && (
                  <div className="mt-4 border-t border-white/[0.05] pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-cyan-300/10 bg-cyan-300/[0.03] px-2 py-0.5 text-[11px] font-medium text-cyan-100/65"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
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
