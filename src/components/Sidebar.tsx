import React, { useState } from "react";
import { Search, CheckCircle, Circle, Brain, Sparkles, Trophy, BookOpen, Layers, ChevronDown, ChevronRight, Layout, Box, Server, Code2, Cpu, GitBranch } from "lucide-react";
import { Problem } from "../types";

import { DESIGN_PATTERNS, HLD_PROBLEMS } from "../data/systemDesignData";

interface SidebarProps {
  problems: Problem[];
  activeProblemId: string | "ai-copilot";
  onSelectProblem: (id: string | "ai-copilot") => void;
  solvedCount: number;
  onToggleSolved: (id: string, event: React.MouseEvent) => void;
  solvedProblems: Record<string, boolean>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  problems,
  activeProblemId,
  onSelectProblem,
  solvedCount,
  onToggleSolved,
  solvedProblems,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lldOpen, setLldOpen] = useState(false);
  const [hldOpen, setHldOpen] = useState(false);

  const categories = ["All", "Arrays", "Linked List", "Greedy", "Recursion", "Backtracking", "Binary Search", "Heaps", "Stack & Queue", "String", "Binary Tree", "BST", "Graphs", "DP", "Miscellaneous"];

  // Filter problems by search queries and category tags
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          problem.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completionPercentage = Math.round((solvedCount / problems.length) * 100) || 0;

  return (
    <div className="w-full lg:w-80 flex flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-md h-full max-h-screen text-slate-100">
      {/* Header Profile Title and Logo */}
      <div className="p-5 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Brain className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">
              <span className="text-gradient-cyan">STRIVER</span> <span className="text-slate-100">SDE</span>
            </h1>
            <span className="text-[10px] font-bold text-cyan-400/70 uppercase tracking-[0.15em] font-mono">
              Java Algorithm Visualizer
            </span>
          </div>
        </div>

        {/* Master sheet progress gauge banner */}
        <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl flex flex-col shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">SDE Sheet Progress</span>
            </div>
            <span className="text-xs font-semibold font-mono text-cyan-400">
              {solvedCount} / {problems.length}
            </span>
          </div>
          {/* Progress bar custom */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-500 h-full rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* AI custom playground launcher */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/80">
        <button
          id="btn-ai-copilot-launch"
          onClick={() => onSelectProblem("ai-copilot")}
          className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all duration-300 ${
            activeProblemId === "ai-copilot" 
              ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-[1.01]" 
              : "bg-slate-900 hover:bg-slate-800/80 text-cyan-400 border-slate-800 hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)]"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeProblemId === "ai-copilot" ? "text-slate-950" : "text-amber-400 fill-amber-400/20 animate-pulse"}`} />
          <span>AI DSA Sandbox Co-Pilot</span>
        </button>
      </div>

      {/* ─── System Design Section ─── */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/80">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Layout className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            System Design
          </span>
        </div>

        {/* LLD Patterns */}
        <div className="space-y-0.5 mb-1.5">
          <button
            onClick={() => setLldOpen(!lldOpen)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition"
          >
            <Code2 className="w-3 h-3 text-emerald-400" />
            <span>LLD — Design Patterns</span>
            <ChevronRight className={`w-3 h-3 ml-auto text-slate-600 transition-transform duration-200 ${lldOpen ? 'rotate-90' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            lldOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pl-5 space-y-0.5 pt-1">
            {([
              { label: "Creational (5)", category: "creational", color: "text-emerald-400" },
              { label: "Structural (7)", category: "structural", color: "text-amber-400" },
              { label: "Behavioral (8)", category: "behavioral", color: "text-rose-400" },
            ] as const).map(group => (
              <div key={group.category}>
                <div className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-wider px-1 py-1">
                  {group.label}
                </div>
                {DESIGN_PATTERNS
                  .filter(p => p.category === group.category)
                  .map(p => (
                    <button
                      key={p.id}
                      onClick={() => onSelectProblem(p.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                        activeProblemId === p.id
                          ? "bg-violet-500/15 text-violet-300 border-l-2 border-violet-400"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                      }`}
                    >
                      <Box className="w-2.5 h-2.5 shrink-0 text-slate-600" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* HLD Systems */}
        <div className="space-y-0.5">
          <button
            onClick={() => setHldOpen(!hldOpen)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition"
          >
            <Server className="w-3 h-3 text-violet-400" />
            <span>HLD — System Architecture</span>
            <ChevronRight className={`w-3 h-3 ml-auto text-slate-600 transition-transform duration-200 ${hldOpen ? 'rotate-90' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            hldOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pl-5 space-y-0.5 pt-1">
            {HLD_PROBLEMS.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectProblem(p.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                  activeProblemId === p.id
                    ? "bg-violet-500/15 text-violet-300 border-l-2 border-violet-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                }`}
              >
                <Cpu className="w-2.5 h-2.5 shrink-0 text-slate-600" />
                <span className="truncate">{p.title}</span>
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Navigation filters */}
      <div className="p-3.5 gap-2.5 flex flex-col border-b border-slate-800 bg-slate-950/20">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            id="sidebar-search-input"
            type="text"
            placeholder="Search SDE questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/85 transition"
          />
        </div>

        {/* Category Carousel Row */}
        <div className="flex gap-1 overflow-x-auto pb-1 select-none scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-lg border transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-cyan-500/15 border-cyan-500/60 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Problems checklist catalog list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-slate-950/40">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>CURATED SDE SHEET PROBLEMS</span>
        </h2>

        {filteredProblems.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-medium font-mono">
            No matching questions found.
          </div>
        ) : (
          filteredProblems.map((p) => {
            const isSolved = !!solvedProblems[p.id];
            const isActive = activeProblemId === p.id;

            return (
              <div
                key={p.id}
                id={`sidebar-problem-${p.id}`}
                onClick={() => onSelectProblem(p.id)}
                className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800/60 border-slate-700 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.05)]"
                    : "bg-slate-900/35 border-slate-800/50 hover:bg-slate-800/30 hover:border-slate-700/80 text-slate-400 hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  {/* Solve Status Icon */}
                  <button
                    onClick={(e) => onToggleSolved(p.id, e)}
                    className="text-slate-500 hover:text-cyan-400 transition p-0.5 focus:outline-none shrink-0"
                    title={isSolved ? "Mark as Unsolved" : "Mark as Solved"}
                  >
                    {isSolved ? (
                      <CheckCircle className="w-4 h-4 text-cyan-400 fill-cyan-400/10 animate-fade-in" />
                    ) : (
                      <Circle className="w-4 h-4 group-hover:text-slate-300" />
                    )}
                  </button>

                  <div className="truncate">
                    <span className={`text-xs block font-semibold leading-tight ${
                      isSolved 
                        ? "text-slate-500 line-through decoration-slate-650" 
                        : isActive ? "text-cyan-300 font-bold" : "text-slate-200"
                    }`}>
                      {p.title}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[9px] font-bold text-slate-500">
                      <span>Ref #{p.striverSheetIndex}</span>
                      <span>•</span>
                      <span className={`font-bold ${
                        p.difficulty === "Easy" ? "text-emerald-500" :
                        p.difficulty === "Medium" ? "text-amber-500" : "text-rose-500"
                      }`}>
                        {p.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded transition-all duration-200 ${
                  isActive 
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                    : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200"
                }`}>
                  {p.category}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Branding Credit */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/80 text-center text-[10px] font-mono text-slate-500 font-bold flex items-center justify-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-cyan-500" />
        <span>STRIVER <span className="text-cyan-400/60">JAVA</span> COMPANION</span>
      </div>
    </div>
  );
};
