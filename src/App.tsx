import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CircleUserRound,
  Command,
  FileText,
  GitBranch,
  Layers,
  LogOut,
  Menu,
  Network,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { NeuralScene } from "./three/NeuralScene";

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHeroAction = () => {
    navigate(isAuthenticated ? "/dashboard" : "/register");
  };

  const handleScrollToPillars = () => {
    document
      .getElementById("pillars")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020307] text-white selection:bg-cyan-400/20 selection:text-cyan-200">
      {/* 3D Visual Centerpiece */}
      <div className="fixed inset-0 pointer-events-none">
        <NeuralScene />
      </div>

      {/* Cinematic Radial Gradients */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_0%,rgba(2,3,7,0.35)_45%,rgba(2,3,7,0.92)_100%)]" />

      {/* Subtle Architectural Grid Pattern */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:64px_64px]" />

      <main className="relative z-10">
        {/* ============================================================ */}
        {/* NAVBAR */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#020307]/75 backdrop-blur-2xl transition-all duration-300">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 lg:px-12">
            {/* Brand Logo */}
            <Link
              to="/"
              className="group flex items-center gap-3 transition"
              title="KARYO - Career Intelligence"
            >
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] shadow-[0_0_16px_rgba(34,211,238,0.12)] transition group-hover:border-cyan-400/40 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.22)]">
                <div className="absolute h-6 w-6 rounded-full bg-cyan-400/20 blur-md" />
                <Command className="relative h-[18px] w-[18px] text-cyan-200" />
              </div>

              <div>
                <div className="text-[17px] font-semibold tracking-[0.14em] text-white">
                  KARYO
                </div>
                <div className="text-[8px] font-medium uppercase tracking-[0.32em] text-white/35">
                  Career Intelligence
                </div>
              </div>
            </Link>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1.5 backdrop-blur-xl md:flex">
              <a
                href="#hero"
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white"
              >
                Platform
              </a>
              <a
                href="#intelligence"
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white"
              >
                Intelligence
              </a>
              <a
                href="#pillars"
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white"
              >
                Architecture
              </a>
            </nav>

            {/* Desktop Auth / Action Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex h-9.5 items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/[0.08] px-4 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/[0.16] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  >
                    <Network className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex h-9.5 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.025] px-3 text-xs text-white/50 transition hover:border-white/20 hover:text-white"
                    title="Sign out of KARYO"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden h-9.5 items-center rounded-xl px-4 text-xs font-medium text-white/70 transition hover:text-white sm:flex"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    className="flex h-9.5 items-center gap-1.5 rounded-xl bg-white px-4 text-xs font-semibold text-black transition hover:bg-cyan-100 hover:shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                  >
                    Get started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle mobile navigation menu"
                className="flex h-9.5 w-9.5 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/[0.06] bg-[#020307]/95 px-6 py-5 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-3">
                <a
                  href="#hero"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5 text-sm text-white/60 transition hover:text-white"
                >
                  Platform
                </a>
                <a
                  href="#intelligence"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5 text-sm text-white/60 transition hover:text-white"
                >
                  Intelligence
                </a>
                <a
                  href="#pillars"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5 text-sm text-white/60 transition hover:text-white"
                >
                  Architecture
                </a>

                <div className="my-1.5 h-px w-full bg-white/[0.08]" />

                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 py-3 text-xs font-medium text-cyan-200"
                    >
                      <Network className="h-4 w-4" />
                      Open Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs text-white/60"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs text-white/80"
                    >
                      <CircleUserRound className="h-4 w-4" />
                      Sign in
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-semibold text-black"
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </header>

        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section
          id="hero"
          className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1440px] items-center px-6 py-12 lg:px-12 lg:py-16"
        >
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
            {/* Left Hero Composition */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 max-w-[640px]"
            >
              {/* Product Badge */}
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-cyan-400/25 bg-cyan-400/[0.06] px-3.5 py-1.5 backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-65" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  Career Intelligence Platform
                </span>
              </div>

              {/* Cinematic Headline */}
              <h1 className="text-[clamp(2.75rem,6.8vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-white">
                Your career.
                <span className="mt-1 block bg-gradient-to-r from-white via-cyan-100 to-violet-300 bg-clip-text text-transparent">
                  Connected.
                </span>
              </h1>

              {/* Narrow, High-Legibility Narrative Paragraph */}
              <p className="mt-7 max-w-[480px] text-base leading-relaxed text-white/55 sm:text-[17px]">
                KARYO transforms your verified skills, experience, and ambitions
                into a live interconnected neural network — understanding where
                your capabilities stand and computing where you can go next.
              </p>

              {/* Cohesive CTA Button System */}
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleHeroAction}
                  className="group flex items-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(255,255,255,0.14)] transition-all hover:bg-cyan-100 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
                >
                  {isAuthenticated ? "Enter Dashboard" : "Launch KARYO OS"}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>

                <button
                  type="button"
                  onClick={handleScrollToPillars}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/70 backdrop-blur-xl transition hover:border-cyan-300/30 hover:bg-white/[0.06] hover:text-white"
                >
                  Explore architecture
                  <ScanLine className="h-4 w-4 text-cyan-200/80" />
                </button>
              </div>

              {/* Refined Telemetry Indicators */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-6 text-[10px] uppercase tracking-[0.2em] text-white/35">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  3 Pillars Active
                </span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  Deterministic Alignment
                </span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-300/70" />
                  Zero Synthetic Data
                </span>
              </div>
            </motion.div>

            {/* Right HUD Overlays Visually Integrated into 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden h-[580px] lg:flex lg:flex-col lg:justify-between py-6 pointer-events-none"
            >
              {/* Top Floating HUD: Neural Core Telemetry */}
              <div className="self-end w-[280px] rounded-2xl border border-cyan-400/20 bg-[#06080e]/60 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-[0.28em] text-cyan-200/90">
                      Neural Core // Telemetry
                    </span>
                  </div>

                  <span className="text-[9px] font-semibold text-emerald-300">
                    LIVE
                  </span>
                </div>

                <div className="mt-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-white/50">
                    <span className="text-[10px] uppercase tracking-wider text-white/30">
                      Capability Mesh
                    </span>
                    <span className="font-mono text-white/80">Active</span>
                  </div>

                  <div className="flex items-center justify-between text-white/50">
                    <span className="text-[10px] uppercase tracking-wider text-white/30">
                      Taxonomy Engine
                    </span>
                    <span className="font-mono text-cyan-200">Gemini 2.5</span>
                  </div>

                  <div className="flex items-center justify-between text-white/50">
                    <span className="text-[10px] uppercase tracking-wider text-white/30">
                      Alignment Mode
                    </span>
                    <span className="font-mono text-violet-300">Deterministic</span>
                  </div>
                </div>
              </div>

              {/* Bottom Floating HUD: Three Pillars Status Matrix */}
              <div className="self-start w-[270px] rounded-2xl border border-violet-400/20 bg-[#06080e]/60 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                <div className="flex items-center gap-2 text-violet-300/90 border-b border-white/[0.06] pb-3">
                  <GitBranch className="h-3.5 w-3.5 text-violet-300" />
                  <span className="text-[8px] font-mono uppercase tracking-[0.26em] text-white/60">
                    Architecture Matrix
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">01 Resume Engine</span>
                    <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[9px] text-cyan-300">
                      SYNTHESIZED
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">02 Skill Graph</span>
                    <span className="rounded bg-violet-400/10 px-1.5 py-0.5 font-mono text-[9px] text-violet-300">
                      CLUSTERED
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">03 Opportunity Engine</span>
                    <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
                      CALIBRATED
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STORY TRANSITION CONNECTOR */}
        {/* ============================================================ */}
        <div id="intelligence" className="relative border-y border-white/[0.06] bg-black/40 py-10 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center lg:px-12">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-200/60">
                Architected For Career Truth
              </p>
              <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                A continuous intelligence cycle.
              </h2>
            </div>

            <p className="max-w-md text-xs leading-5 text-white/45 sm:text-sm">
              Static resumes are lossy flat documents. KARYO converts your real
              work history, technical implementations, and credentials into a
              structured multi-dimensional career model.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* THREE PILLARS SHOWCASE */}
        {/* ============================================================ */}
        <section
          id="pillars"
          className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28"
        >
          {/* Section Header */}
          <div className="mb-14">
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-cyan-200/50">
              <span className="h-px w-8 bg-cyan-300/40" />
              Core Architecture
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl text-white">
              The Three Pillars of KARYO.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
              Three deeply connected systems working in harmony to synthesize
              career data, map competency topologies, and evaluate role readiness.
            </p>
          </div>

          {/* Three Pillar Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* PILLAR 01: Resume Intelligence */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              onClick={handleHeroAction}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-2xl transition duration-300 hover:border-cyan-400/30 hover:bg-white/[0.04] cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] shadow-[0_0_16px_rgba(34,211,238,0.1)]">
                    <BrainCircuit className="h-6 w-6 text-cyan-200" />
                  </div>

                  <span className="font-mono text-xs font-semibold tracking-wider text-cyan-300/80">
                    PILLAR 01
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold text-white tracking-tight">
                  Resume Intelligence
                </h3>

                <p className="mt-1 text-xs font-medium text-cyan-200/70">
                  Semantic document synthesis
                </p>

                <p className="mt-3.5 text-xs leading-6 text-white/50">
                  Upload your PDF resume once. KARYO extracts employment
                  history, key projects, education credentials, and technical
                  competencies directly into MongoDB without lossy manual entry.
                </p>

                {/* Mini Artifact Preview */}
                <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/30 p-3.5 text-[11px] font-mono text-white/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-200/80">
                    <FileText className="h-3 w-3" />
                    <span>PDF Parser & AI Extraction</span>
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Structured Employment History
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Project Stack Architecture
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Dynamic 0-100 Career Score
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-medium text-white/40 group-hover:text-cyan-200 transition">
                <span>{isAuthenticated ? "View in Dashboard" : "Explore Module"}</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.article>

            {/* PILLAR 02: Interactive Skill Graph */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={handleHeroAction}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-2xl transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.04] cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] shadow-[0_0_16px_rgba(167,139,250,0.1)]">
                    <Network className="h-6 w-6 text-violet-300" />
                  </div>

                  <span className="font-mono text-xs font-semibold tracking-wider text-violet-300/80">
                    PILLAR 02
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold text-white tracking-tight">
                  Interactive Skill Graph
                </h3>

                <p className="mt-1 text-xs font-medium text-violet-300/70">
                  Topological capability mapping
                </p>

                <p className="mt-3.5 text-xs leading-6 text-white/50">
                  Visualizes your capabilities organized into Core Tech,
                  Architecture, Frontend, Backend, and Tools. Trace each
                  competency back to practical project implementations and
                  employment positions.
                </p>

                {/* Mini Artifact Preview */}
                <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/30 p-3.5 text-[11px] font-mono text-white/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-violet-300/80">
                    <Layers className="h-3 w-3" />
                    <span>Graph Node Clustering</span>
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Categorized Capability Spheres
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Interactive Node Inspector
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Work & Project Evidence Linking
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-medium text-white/40 group-hover:text-violet-300 transition">
                <span>{isAuthenticated ? "View in Dashboard" : "Explore Module"}</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.article>

            {/* PILLAR 03: Opportunity Engine */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={handleHeroAction}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-2xl transition duration-300 hover:border-emerald-400/30 hover:bg-white/[0.04] cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] shadow-[0_0_16px_rgba(52,211,153,0.1)]">
                    <Target className="h-6 w-6 text-emerald-300" />
                  </div>

                  <span className="font-mono text-xs font-semibold tracking-wider text-emerald-300/80">
                    PILLAR 03
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold text-white tracking-tight">
                  Opportunity Engine
                </h3>

                <p className="mt-1 text-xs font-medium text-emerald-300/70">
                  Role alignment & trajectory roadmap
                </p>

                <p className="mt-3.5 text-xs leading-6 text-white/50">
                  Evaluates skill coverage, validates practical evidence
                  backing, highlights targeted gaps, and generates a prioritized
                  actionable roadmap to reach peak readiness for your target role.
                </p>

                {/* Mini Artifact Preview */}
                <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/30 p-3.5 text-[11px] font-mono text-white/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300/80">
                    <TrendingUp className="h-3 w-3" />
                    <span>Deterministic Readiness Gauge</span>
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Skill Coverage & Evidence Ratio
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Missing Competency Pinpointing
                  </div>
                  <div className="text-[10px] text-white/35">
                    &bull; Prioritized Step-by-Step Milestones
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-medium text-white/40 group-hover:text-emerald-300 transition">
                <span>{isAuthenticated ? "View in Dashboard" : "Explore Module"}</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.article>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CLOSING CINEMATIC CALL-TO-ACTION */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-[1440px] px-6 pb-24 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-10 text-center backdrop-blur-2xl sm:p-16">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/[0.06] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet-400/[0.06] blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-200">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                Intelligent Career Trajectory
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your career is an evolving network.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Stop managing your professional capabilities as a flat PDF.
                Connect your resume, visualize your capability graph, and
                navigate opportunities with architectural clarity.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleHeroAction}
                  className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-semibold text-black transition hover:bg-cyan-100 shadow-[0_0_24px_rgba(255,255,255,0.12)]"
                >
                  {isAuthenticated ? "Enter Dashboard" : "Get Started Free"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-5 py-3 text-xs font-medium text-white/70 backdrop-blur-xl transition hover:border-white/20 hover:text-white"
                  >
                    Sign in to profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        <footer className="border-t border-white/[0.06] bg-[#020307]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center lg:px-12">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06]">
                <Command className="h-4 w-4 text-cyan-200" />
              </div>
              <div>
                <span className="text-sm font-semibold tracking-wider text-white">
                  KARYO
                </span>
                <p className="text-[9px] uppercase tracking-[0.24em] text-white/30">
                  Career Intelligence Operating System
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-white/40">
              <a href="#hero" className="transition hover:text-white">
                Platform
              </a>
              <a href="#intelligence" className="transition hover:text-white">
                Intelligence
              </a>
              <a href="#pillars" className="transition hover:text-white">
                Architecture
              </a>
              {isAuthenticated ? (
                <Link to="/dashboard" className="transition hover:text-cyan-200">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="transition hover:text-white">
                    Sign in
                  </Link>
                  <Link to="/register" className="transition hover:text-cyan-200">
                    Create profile
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>System Operational</span>
              <span className="mx-2 text-white/10">&bull;</span>
              <span>&copy; {new Date().getFullYear()} KARYO</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}