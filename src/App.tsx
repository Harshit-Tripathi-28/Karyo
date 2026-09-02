import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  CircleUserRound,
  Command,
  GitBranch,
  Menu,
  Network,
  ScanLine,
  Sparkles,
  Target,
} from "lucide-react";
import { NeuralScene } from "./three/NeuralScene";

const capabilities = [
  {
    icon: BrainCircuit,
    label: "01",
    title: "Career Intelligence",
    description:
      "Turn your experience, skills and ambitions into an intelligent career profile.",
  },
  {
    icon: Network,
    label: "02",
    title: "Skill Graph",
    description:
      "Discover how your capabilities connect to the roles and skills you are targeting.",
  },
  {
    icon: Target,
    label: "03",
    title: "Opportunity Engine",
    description:
      "Find meaningful opportunities through deeper role and skill alignment.",
  },
];

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#020307] text-white">
      <div className="fixed inset-0">
        <NeuralScene />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(2,3,7,0.08)_35%,rgba(2,3,7,0.88)_100%)]" />

      <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:80px_80px]" />

      <main className="relative z-10">
        {/* NAVBAR */}

        <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06]">
              <div className="absolute h-6 w-6 rounded-full bg-cyan-400/20 blur-md" />

              <Command className="relative h-[18px] w-[18px] text-cyan-200" />
            </div>

            <div>
              <div className="text-[17px] font-semibold tracking-[0.12em]">
                KARYO
              </div>

              <div className="text-[8px] font-medium uppercase tracking-[0.32em] text-white/30">
                Career Intelligence
              </div>
            </div>
          </motion.div>

          <nav className="hidden items-center gap-9 md:flex">
            {["Platform", "Intelligence", "Network"].map((item) => (
              <a
                key={item}
                href="#intelligence"
                className="text-[13px] text-white/45 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 text-xs text-white/60 transition hover:border-cyan-300/25 hover:text-white sm:flex"
            >
              <CircleUserRound className="h-4 w-4" />
              Sign in
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* HERO */}

        <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-[1440px] items-center px-6 pb-24 pt-10 lg:px-12">
          <div className="grid w-full grid-cols-1 items-center lg:grid-cols-[0.82fr_1.18fr]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-20 max-w-[650px]"
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.045] px-3.5 py-2 backdrop-blur-xl">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
                </span>

                <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-cyan-200/80">
                  Neural career intelligence
                </span>
              </div>

              <h1 className="max-w-[720px] text-[clamp(3.5rem,6.5vw,6.7rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
                Your career.
                <span className="block bg-gradient-to-r from-white via-cyan-100 to-violet-300 bg-clip-text text-transparent">
                  Connected.
                </span>
              </h1>

              <p className="mt-8 max-w-[540px] text-[15px] leading-7 text-white/45 sm:text-[17px]">
                KARYO transforms your skills, experience and ambitions into
                one intelligent career network — built to understand where
                you are and where you can go next.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="group flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                >
                  Enter KARYO

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm text-white/65 backdrop-blur-xl transition hover:border-cyan-300/20 hover:text-white"
                >
                  Explore system
                  <ScanLine className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Intelligence layer
                </span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>Private by design</span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>AI powered</span>
              </div>
            </motion.div>

            {/* RIGHT HUD */}

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden h-[650px] lg:block"
            >
              <div className="absolute right-[8%] top-[12%] w-[250px] rounded-2xl border border-white/[0.08] bg-black/20 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] uppercase tracking-[0.28em] text-white/30">
                    Neural Core
                  </span>

                  <span className="flex items-center gap-1.5 text-[8px] text-cyan-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    ACTIVE
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg border border-cyan-300/10 bg-cyan-300/[0.05] p-2">
                    <BrainCircuit className="h-full w-full text-cyan-200/80" />
                  </div>

                  <div>
                    <div className="text-xs text-white/80">
                      Intelligence graph
                    </div>

                    <div className="mt-1 text-[9px] text-white/25">
                      Continuously evolving
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[13%] left-[7%] w-[220px] rounded-2xl border border-white/[0.08] bg-black/20 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-violet-300/70" />

                  <span className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                    Skill network
                  </span>
                </div>

                <div className="mt-4 h-px w-full bg-white/[0.07]" />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] text-white/25">
                    Mapping capabilities
                  </span>

                  <Sparkles className="h-3.5 w-3.5 text-violet-300/60" />
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 h-[1px] w-[80px] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* CAPABILITIES */}

        <section
          id="intelligence"
          className="mx-auto max-w-[1440px] px-6 pb-32 lg:px-12"
        >
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-cyan-200/50">
                <span className="h-px w-7 bg-cyan-300/40" />
                Intelligence layer
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Built around you.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/30">
              A connected system for understanding your capabilities,
              identifying opportunities and making your next career move
              with clarity.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {capabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-xl transition duration-500 hover:border-cyan-300/20 hover:bg-white/[0.04]"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400/[0.035] blur-3xl transition group-hover:bg-cyan-400/[0.07]" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.05]">
                        <Icon className="h-[18px] w-[18px] text-cyan-200/80" />
                      </div>

                      <span className="text-[9px] tracking-[0.2em] text-white/20">
                        {item.label}
                      </span>
                    </div>

                    <h3 className="mt-12 text-lg font-medium">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/35">
                      {item.description}
                    </p>

                    <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                        Explore module
                      </span>

                      <ArrowUpRight className="h-4 w-4 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;