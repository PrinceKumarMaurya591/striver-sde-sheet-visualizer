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
    <div id="app-root-container" className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-[#020617] font-sans antialiased text-slate-100">
      
      {/* Mobile Header navigation top-dock */}
      <div className="lg:hidden flex items-center justify-between bg-slate-950 border-b border-slate-800 px-4 py-3 select-none">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 p-1.5 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-slate-100 uppercase">
              Striver SDE Visualizer
            </h1>
            <span className="text-[8px] font-bold font-mono text-cyan-400 uppercase">
              Companion Sandbox
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 px-3 bg-slate-900 border border-slate-800 text-[11px] font-bold text-cyan-400 rounded-lg flex items-center gap-1 hover:bg-slate-800 shadow-sm transition"
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
        <div className="relative z-50 h-full w-80 max-w-[85vw] flex flex-col lg:max-w-none shadow-2xl lg:shadow-none bg-slate-950">
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
          />
        ) : (
          /* Fallback view, if none select */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] select-none">
            <Trophy className="w-16 h-16 text-amber-400 fill-amber-400/10 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse mb-4" />
            <h3 className="text-lg font-black text-slate-100 tracking-tight">CHOOSE A CURRICULAR SDE QUESTION</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
              Browse Striver SDE categories on the sidebar sheet index, or configure an AI custom sandbox playground!
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
