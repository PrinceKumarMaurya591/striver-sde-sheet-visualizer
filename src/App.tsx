import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { VisualizerWorkspace } from "./components/VisualizerWorkspace";
import { AiCoPilot } from "./components/AiCoPilot";
import { SystemDesignWorkspace } from "./components/SystemDesignWorkspace";
import { STRIVER_PROBLEMS } from "./data/striverData";
import { SYSTEM_DESIGN_PROBLEMS } from "./data/systemDesignData";
import { Problem } from "./types";
import { Sparkles, Trophy, BrainCircuit, ListCollapse, Layers } from "lucide-react";

export default function App() {
  const [activeProblemId, setActiveProblemId] = useState<string | "ai-copilot">("sort-colors");
  const [solvedProblems, setSolvedProblems] = useState<Record<string, boolean>>({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load ticked checkbox states from localStorage on startup
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem("striver_solved_status");
        if (stored) {
          setSolvedProblems(JSON.parse(stored));
        }
      }
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  }, []);

  // Update tick box statuses in localStorage
  const handleToggleSolved = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent launching of visualizer workspace on click

    setSolvedProblems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("striver_solved_status", JSON.stringify(next));
        }
      } catch (e) {
        console.error("Failed to save to safe localStorage:", e);
      }
      return next;
    });
  };

  const activeProblem = STRIVER_PROBLEMS.find((p) => p.id === activeProblemId);
  const solvedCount = STRIVER_PROBLEMS.filter((p) => !!solvedProblems[p.id]).length;

  return (
    <div id="app-root-container" className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-[#020617] font-sans antialiased text-slate-100"
      style={{
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
                          radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
                          radial-gradient(ellipse at 50% 80%, rgba(245, 158, 11, 0.02) 0%, transparent 50%)`,
      }}
    >
      
      {/* Mobile Header navigation top-dock */}
      <div className="lg:hidden flex items-center justify-between bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 select-none">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 p-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-glow-pulse">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-slate-100 uppercase">
              <span className="text-gradient-cyan">Striver</span> SDE Visualizer
            </h1>
            <span className="text-[8px] font-bold font-mono text-cyan-400/80 uppercase tracking-widest">
              Java Algorithm Sandbox
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 px-3 bg-slate-900/80 border border-slate-700/80 text-[11px] font-bold text-cyan-400 rounded-lg flex items-center gap-1 hover:bg-slate-800 hover:border-cyan-500/30 shadow-sm transition-all duration-200"
        >
          <ListCollapse className="w-4 h-4 shrink-0 text-cyan-500" />
          <span>SDE Sheet</span>
        </button>
      </div>

      {/* Sidebar - browsable problems index checklist */}
      <div
        className={`${
          isMobileSidebarOpen ? "fixed inset-0 z-50 flex" : "hidden"
        } lg:flex lg:relative h-full transition-all duration-300`}
      >
        {/* Backdrop for mobile drawer */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Actual Sidebar panel */}
        <div className="relative z-50 h-full w-80 max-w-[85vw] flex flex-col lg:max-w-none shadow-2xl lg:shadow-2xl lg:shadow-cyan-500/5 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/60">
          <Sidebar
            problems={STRIVER_PROBLEMS}
            activeProblemId={activeProblemId}
            onSelectProblem={(id) => {
              setActiveProblemId(id);
              setIsMobileSidebarOpen(false); // dismiss drawer on mobile
            }}
            solvedCount={solvedCount}
            onToggleSolved={handleToggleSolved}
            solvedProblems={solvedProblems}
          />
        </div>
      </div>

      {/* Main interactive visualization workspace viewport */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {activeProblemId === "ai-copilot" ? (
          <AiCoPilot />
        ) : activeProblemId.startsWith("lld-") || activeProblemId.startsWith("hld-") ? (
          <SystemDesignWorkspace problemId={activeProblemId} />
        ) : activeProblem ? (
          <VisualizerWorkspace
            problem={activeProblem}
            isSolved={!!solvedProblems[activeProblem.id]}
            onToggleSolved={handleToggleSolved}
            onBack={() => setActiveProblemId("sort-colors")}
          />
        ) : (
          /* Fallback view, if none select */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] select-none">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full w-32 h-32 -top-8 -left-8"></div>
              <Trophy className="w-20 h-20 text-amber-400 fill-amber-400/10 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-float relative z-10" />
            </div>
            <h3 className="text-xl font-black text-slate-100 tracking-tight">
              <span className="text-gradient-amber">STRIVER SDE</span> SHEET
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-3"></div>
            <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed font-medium">
              Browse the Java-implemented DSA algorithm visualizations from the sidebar.
              Trace step-by-step execution with animated array, linked list, matrix, and graph displays.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-full font-bold font-mono tracking-wider">
                JAVA ALGORITHMS
              </span>
              <span className="text-[10px] bg-slate-800/50 text-slate-400 border border-slate-700/50 px-3 py-1.5 rounded-full font-bold font-mono">
                191 PROBLEMS
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
