import { useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Filter,
  FolderGit2,
  Info,
  Network,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import type { ResumeExperience, ResumeProject } from "../../types/resume";
import {
  buildSkillGraphData,
  CATEGORY_CONFIG,
} from "./skillUtils";

interface SkillGraphProps {
  skills?: string[];
  skillGaps?: string[];
  projects?: ResumeProject[];
  experience?: ResumeExperience[];
  targetRole?: string;
}

export function SkillGraph({
  skills = [],
  skillGaps = [],
  projects = [],
  experience = [],
  targetRole,
}: SkillGraphProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const graphData = useMemo(() => {
    return buildSkillGraphData(skills, skillGaps, projects, experience);
  }, [skills, skillGaps, projects, experience]);

  // Filtered nodes based on category and search
  const filteredNodeIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return new Set(
      graphData.nodes
        .filter((node) => {
          const matchesCategory =
            selectedCategory === "ALL" || node.category === selectedCategory;
          const matchesQuery =
            !query ||
            node.name.toLowerCase().includes(query) ||
            node.category.toLowerCase().includes(query);
          return matchesCategory && matchesQuery;
        })
        .map((n) => n.id)
    );
  }, [graphData.nodes, selectedCategory, searchQuery]);

  const activeNode = useMemo(() => {
    return graphData.nodes.find((n) => n.id === activeSkillId) || null;
  }, [graphData.nodes, activeSkillId]);

  const highlightedNodeId = hoveredSkillId || activeSkillId;

  // Find all nodes connected to the highlighted node
  const connectedNodeIds = useMemo(() => {
    if (!highlightedNodeId) return new Set<string>();
    const node = graphData.nodes.find((n) => n.id === highlightedNodeId);
    if (!node) return new Set<string>();
    return new Set([node.id, ...node.connections]);
  }, [graphData.nodes, highlightedNodeId]);

  if (graphData.nodes.length === 0) {
    return (
      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06]">
          <Network className="h-6 w-6 text-cyan-200" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-white">No Skills to Map Yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
          Upload your resume to generate your connected capability network and discover role alignment.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 lg:p-7 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-200/70" />
            <span className="text-[9px] uppercase tracking-[0.28em] text-cyan-200/50">
              Pillar 02 / Skill Graph
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Connected Capability Network
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Interactive visualization of your verified skills, project co-occurrences, and target gaps.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search capability..."
            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-8 text-xs text-white placeholder-white/30 outline-none transition focus:border-cyan-400/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-4">
        <span className="mr-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/30">
          <Filter className="h-3 w-3" /> Filters:
        </span>

        <button
          type="button"
          onClick={() => setSelectedCategory("ALL")}
          className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
            selectedCategory === "ALL"
              ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white"
          }`}
        >
          All ({graphData.nodes.length})
        </button>

        {graphData.categories.map((category) => {
          const count = graphData.nodes.filter((n) => n.category === category).length;
          const isSelected = selectedCategory === category;
          const conf = CATEGORY_CONFIG[category];

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? "ALL" : category)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition ${
                isSelected
                  ? conf.badgeClass + " shadow-md"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${conf.dotClass}`} />
              <span>{category}</span>
              <span className="text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}

        {(selectedCategory !== "ALL" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="ml-auto flex items-center gap-1 text-[11px] text-white/40 transition hover:text-white"
          >
            <RotateCcw className="h-3 w-3" /> Reset filters
          </button>
        )}
      </div>

      {/* Main Graph Grid: SVG Visualizer + Detail Inspector */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        {/* SVG Graph Canvas */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 p-2 shadow-inner">
          {/* Subtle Grid Backdrop */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]" />

          {/* Central Target Role Beacon */}
          {targetRole && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-40">
              <div className="h-16 w-16 rounded-full border border-cyan-400/20 bg-cyan-400/[0.03] blur-sm" />
              <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-cyan-200">
                {targetRole}
              </p>
            </div>
          )}

          <svg
            viewBox="0 0 800 600"
            className="h-auto w-full max-h-[580px] select-none"
          >
            <defs>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Edges */}
            <g className="edges">
              {graphData.edges.map((edge) => {
                const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
                const targetNode = graphData.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnected =
                  highlightedNodeId &&
                  (edge.source === highlightedNodeId || edge.target === highlightedNodeId);

                const isVisible =
                  filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target);

                const opacity = isConnected
                  ? 0.75
                  : highlightedNodeId
                  ? 0.05
                  : isVisible
                  ? 0.18
                  : 0.04;

                const strokeColor = isConnected ? "#22d3ee" : "#ffffff";
                const strokeWidth = isConnected ? 2 : 1;

                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    strokeDasharray={isConnected ? "none" : edge.weight < 1 ? "3 3" : "none"}
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {graphData.nodes.map((node) => {
                const isSelected = activeSkillId === node.id;
                const isHovered = hoveredSkillId === node.id;
                const isHighlighted = isSelected || isHovered;
                const isConnected = connectedNodeIds.has(node.id);
                const isMatch = filteredNodeIds.has(node.id);
                const conf = CATEGORY_CONFIG[node.category];

                const opacity = !isMatch
                  ? 0.18
                  : highlightedNodeId
                  ? isHighlighted || isConnected
                    ? 1
                    : 0.25
                  : 0.95;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setActiveSkillId(isSelected ? null : node.id)}
                    onMouseEnter={() => setHoveredSkillId(node.id)}
                    onMouseLeave={() => setHoveredSkillId(null)}
                    className="cursor-pointer transition-transform duration-200"
                    opacity={opacity}
                  >
                    {/* Outer glow ring for active / hovered node */}
                    {(isHighlighted || isSelected) && (
                      <circle
                        r={node.radius + 8}
                        fill="none"
                        stroke={conf.color}
                        strokeWidth={1.5}
                        strokeDasharray={node.isGap ? "4 4" : "none"}
                        className="animate-pulse"
                        opacity={0.7}
                      />
                    )}

                    {/* Base Node Circle */}
                    <circle
                      r={node.radius}
                      fill="#070913"
                      stroke={conf.color}
                      strokeWidth={isHighlighted ? 2.5 : 1.5}
                      strokeDasharray={node.isGap ? "3 2" : "none"}
                    />

                    {/* Category color dot inside */}
                    <circle
                      r={Math.max(3, node.radius * 0.35)}
                      fill={conf.color}
                      opacity={0.85}
                    />

                    {/* Node Text Label */}
                    <text
                      y={node.radius + 12}
                      textAnchor="middle"
                      fill={isHighlighted ? "#ffffff" : "#cbd5e1"}
                      fontSize={isHighlighted ? "11px" : "9.5px"}
                      fontWeight={isHighlighted ? "600" : "400"}
                      className="pointer-events-none select-none font-sans"
                    >
                      {node.name.length > 15
                        ? `${node.name.slice(0, 13)}…`
                        : node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Canvas Helper / Controls Overlay */}
          <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-3 text-[10px] text-white/35">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Click node to inspect
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full border border-rose-400 bg-rose-400/30" /> Dashed = Target Gap
            </span>
          </div>
        </div>

        {/* Skill Detail Inspector Panel */}
        <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-black/30 p-6 backdrop-blur-xl">
          {activeNode ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                        CATEGORY_CONFIG[activeNode.category].badgeClass
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          CATEGORY_CONFIG[activeNode.category].dotClass
                        }`}
                      />
                      {activeNode.category}
                    </span>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      {activeNode.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSkillId(null)}
                    className="rounded-lg border border-white/10 p-1.5 text-white/40 transition hover:border-white/20 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Capability Status Banner */}
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                  <div className="flex items-center gap-2">
                    {activeNode.isGap ? (
                      <Target className="h-4 w-4 text-rose-300" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    )}
                    <span className="text-xs font-medium text-white/80">
                      {activeNode.isGap
                        ? "Target Role Skill Gap"
                        : "Verified Capability"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-white/40">
                    {activeNode.isGap
                      ? "Recommended by KARYO intelligence to bridge your readiness for the target role."
                      : "Directly detected and extracted from your verified career records."}
                  </p>
                </div>

                {/* Associated Projects */}
                <div className="mt-5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/30">
                    <FolderGit2 className="h-3 w-3 text-cyan-200/60" />
                    Associated Projects ({activeNode.associatedProjects.length})
                  </div>

                  {activeNode.associatedProjects.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {activeNode.associatedProjects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-white/[0.05] bg-black/40 p-3 text-xs"
                        >
                          <p className="font-semibold text-white/90">{proj.name}</p>
                          <p className="mt-1 text-white/45 line-clamp-2">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-xs text-white/25 italic">
                      No standalone projects directly tagged with this capability.
                    </p>
                  )}
                </div>

                {/* Associated Experience */}
                <div className="mt-5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/30">
                    <Briefcase className="h-3 w-3 text-violet-200/60" />
                    Experience Highlights ({activeNode.associatedExperience.length})
                  </div>

                  {activeNode.associatedExperience.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {activeNode.associatedExperience.map((exp, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-white/[0.05] bg-black/40 p-3 text-xs"
                        >
                          <p className="font-medium text-cyan-200/80">
                            {exp.role} • {exp.company}
                          </p>
                          <p className="mt-1 text-white/50 leading-5">
                            "{exp.highlight}"
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-xs text-white/25 italic">
                      No individual job highlights explicitly mentioning this capability.
                    </p>
                  )}
                </div>

                {/* Connected Co-Skills */}
                {activeNode.connections.length > 0 && (
                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <span className="text-[10px] uppercase tracking-wider text-white/30">
                      Co-applied Technologies ({activeNode.connections.length})
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {activeNode.connections.slice(0, 8).map((connId) => {
                        const connNode = graphData.nodes.find((n) => n.id === connId);
                        if (!connNode) return null;
                        return (
                          <button
                            key={connId}
                            type="button"
                            onClick={() => setActiveSkillId(connId)}
                            className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-[11px] text-white/60 transition hover:border-cyan-300/30 hover:text-white"
                          >
                            {connNode.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-3 text-[11px] text-white/30 flex items-center justify-between">
                <span>Domain: {activeNode.category}</span>
                <span className="text-cyan-200/50">KARYO Network</span>
              </div>
            </div>
          ) : (
            /* Default prompt when no node is selected */
            <div className="flex flex-col items-center justify-center text-center h-full py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05]">
                <Sparkles className="h-5 w-5 text-cyan-200" />
              </div>

              <h4 className="mt-4 text-base font-medium text-white">
                Skill Capability Inspector
              </h4>
              <p className="mt-2 max-w-xs text-xs leading-5 text-white/40">
                Click any skill node on the capability network to inspect its verified context, project usage, and role relevance.
              </p>

              <div className="mt-8 w-full space-y-2.5 rounded-xl border border-white/[0.06] bg-black/20 p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                  <Info className="h-3.5 w-3.5 text-cyan-200/60" />
                  Network Distribution
                </div>
                <div className="space-y-1.5 text-xs text-white/40">
                  <div className="flex justify-between">
                    <span>Verified Skills:</span>
                    <span className="text-white/80 font-mono">
                      {graphData.nodes.filter((n) => !n.isGap).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Role Gaps:</span>
                    <span className="text-rose-300 font-mono">
                      {graphData.nodes.filter((n) => n.isGap).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cross-skill Edges:</span>
                    <span className="text-cyan-200 font-mono">{graphData.edges.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
