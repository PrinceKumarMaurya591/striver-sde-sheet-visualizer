import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, AlertTriangle, BookOpen, Layers, CheckCircle, Info, Code, PlayCircle, Settings, HelpCircle } from "lucide-react";
import { Problem, TraceStep } from "../types";
import { getInteractiveTrace } from "../data/striverData";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { MatrixVisualizer } from "./MatrixVisualizer";
import { LinkedListVisualizer } from "./LinkedListVisualizer";
import { GraphVisualizer } from "./GraphVisualizer";

interface VisualizerWorkspaceProps {
  problem: Problem;
  isSolved: boolean;
  onToggleSolved: (id: string, event: React.MouseEvent) => void;
}

export const VisualizerWorkspace: React.FC<VisualizerWorkspaceProps> = ({
  problem,
  isSolved,
  onToggleSolved,
}) => {
  // Input parameters
  const [inputValue, setInputValue] = useState(problem.defaultInput.value);
  const [steps, setSteps] = useState<TraceStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Playback state machines
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1200); // ms per advance cycle
  const [activeCodeTab, setActiveCodeTab] = useState<"optimal" | "brute">("optimal");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isNativeProblem = ["sort-colors", "kadanes-algorithm", "set-matrix-zeroes", "reverse-linked-list", "binary-search", "n-queens", "dijkstras-algorithm"].includes(problem.id);

  const handleSynthesizeTrace = async (customVal: string) => {
    setLoading(true);
    setValidationError(null);
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setSteps([]);

    const messages = [
      "Contacting server backend...",
      "Initializing highly intelligent Gemini model...",
      "Analyzing algorithm structures & code block tokens...",
      "Simulating dry-run with input params...",
      "Structuring visualization array coordinates...",
      "Polishing visual timelines..."
    ];

    let msgIdx = 0;
    setLoadingStepText(messages[0]);
    const msgTimer = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingStepText(messages[msgIdx]);
    }, 1200);

    try {
      const response = await fetch("/api/ai-visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: problem.title,
          codeSnippet: problem.optimal.code,
          customInput: customVal,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate dry run viz trace");
      }

      const resData = await response.json();
      if (!resData.steps || resData.steps.length === 0) {
        throw new Error("No steps trace returned from AI engine");
      }

      setSteps(resData.steps);
      setCurrentStepIdx(0);
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "An unexpected network or compiler error occurred.");
    } finally {
      clearInterval(msgTimer);
      setLoading(false);
    }
  };

  // Re-generate trace steps whenever the problem or customized inputs change
  useEffect(() => {
    setInputValue(problem.defaultInput.value);
    setValidationError(null);
    setIsPlaying(false);
    
    if (isNativeProblem) {
      const trace = getInteractiveTrace(problem.id, problem.defaultInput.value);
      setSteps(trace);
      setCurrentStepIdx(0);
    } else {
      setSteps([]);
      setCurrentStepIdx(0);
      handleSynthesizeTrace(problem.defaultInput.value);
    }
  }, [problem]);

  const handleApplyInput = () => {
    setIsPlaying(false);
    setValidationError(null);

    // Validate parameters inputs loosely
    const cleanVal = inputValue.trim();
    if (cleanVal === "") {
      setValidationError("Input value cannot be empty.");
      return;
    }

    if (problem.id === "sort-colors") {
      const parts = cleanVal.split(",").map(x => x.trim());
      const allZeroOneTwo = parts.every(x => x === "0" || x === "1" || x === "2");
      if (!allZeroOneTwo) {
        setValidationError("Sort Colors arrays must exclusively contain elements of 0, 1, or 2 (separated by commas).");
        return;
      }
    }

    if (isNativeProblem) {
      const newTrace = getInteractiveTrace(problem.id, cleanVal);
      if (newTrace.length === 0) {
        setValidationError("Invalid formatting. Please match the placeholder formats.");
        return;
      }
      setSteps(newTrace);
      setCurrentStepIdx(0);
    } else {
      handleSynthesizeTrace(cleanVal);
    }
  };

  // Playback clock loops
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, playbackSpeed]);

  const activeStep = steps[currentStepIdx];
  const totalSteps = steps.length;

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#020617]">
      
      {/* Left section: Visualization area, player deck, parameters */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 space-y-5 border-r border-slate-900/80 bg-[#020617]/50">
        
        {/* Title and metadata bar */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Striver SDE Companion
              </span>
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                problem.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                problem.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <h2 id="workspace-problem-title" className="text-lg font-bold text-slate-100 mt-1.5 flex items-center gap-2">
              {problem.title}
            </h2>
          </div>

          <button
            onClick={(e) => onToggleSolved(problem.id, e)}
            className={`py-1.5 px-3.5 rounded-lg border text-xs font-bold font-mono flex items-center gap-2 transition duration-200 shadow-md ${
              isSolved
                ? "bg-cyan-500 hover:bg-cyan-400 border-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-cyan-400"
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${isSolved ? "fill-slate-950 text-cyan-400" : ""}`} />
            <span>{isSolved ? "Solved!" : "Mark Completed"}</span>
          </button>
        </div>

        {/* Algorithm intuition details */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850/80">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-2 font-mono">
            <Info className="w-4 h-4 text-slate-500" />
            <span>ALGORITHM INTUITION & APPROACH</span>
          </h3>
          <p className="text-xs text-slate-350 font-medium leading-relaxed">
            {problem.intuition}
          </p>

          {/* Brute force vs optimal comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-950/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Brute Force Approach</span>
              <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-1" title={problem.bruteForce.description}>
                {problem.bruteForce.description}
              </p>
              <div className="flex gap-4 mt-2.5 text-[10px] text-slate-550 font-mono font-bold leading-none">
                <span>Time: {problem.bruteForce.timeComplexity}</span>
                <span>Space: {problem.bruteForce.spaceComplexity}</span>
              </div>
            </div>

            <div className="border border-cyan-500/10 rounded-lg p-3 bg-cyan-500/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest font-mono">Optimal approach</span>
                <span className="text-[8px] bg-cyan-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded">FAST</span>
              </div>
              <p className="text-xs text-cyan-300 font-medium line-clamp-1 mt-1" title={problem.optimal.description}>
                {problem.optimal.description}
              </p>
              <div className="flex gap-4 mt-2.5 text-[10px] text-cyan-400/80 font-mono font-bold leading-none">
                <span>Time: {problem.optimal.timeComplexity}</span>
                <span>Space: {problem.optimal.spaceComplexity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic configurations tester parameter controls */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850/80 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 leading-none font-mono">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>CUSTOMIZE PARAMETERS CONFIGURATION</span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">
                {problem.defaultInput.label}
              </label>
              <input
                id="workspace-param-field"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Custom inputs separated by commas..."
                className="w-full text-xs p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <button
              id="btn-apply-params"
              onClick={handleApplyInput}
              className="bg-cyan-600 hover:bg-cyan-500 border border-cyan-600 text-slate-950 font-bold text-xs px-5 py-2 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] rounded-lg transition duration-200 self-end h-[38px]"
            >
              Re-Build
            </button>
          </div>
          {validationError && (
            <div className="text-xs text-rose-450 bg-rose-500/10 border border-rose-500/25 p-2.5 rounded-lg flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Visualizer output canvas container */}
        <div className="bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] rounded-xl border border-slate-800/80 shadow-2xl p-6 relative flex flex-col items-center justify-center min-h-[300px]">
          {/* Active Canvas Dispatcher */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center max-w-md">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/10 border-t-4 border-t-cyan-400 animate-spin"></div>
                <PlayCircle className="w-8 h-8 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-slate-200 mt-2 font-mono uppercase tracking-widest animate-pulse">COMPILING TRACE STEPS</h4>
              <p className="text-xs text-cyan-300/80 font-semibold leading-relaxed min-h-[32px]">
                {loadingStepText}
              </p>
            </div>
          ) : activeStep ? (
            <div className="w-full">
              {/* Polymorphic structure dispatcher */}
              {activeStep.matrixState && (
                <MatrixVisualizer
                  matrix={activeStep.matrixState}
                  activeIndices={activeStep.activeIndices || []}
                />
              )}

              {activeStep.boardState && (
                <MatrixVisualizer
                  board={activeStep.boardState}
                  activeMarkers={activeStep.customMarkers}
                />
              )}

              {activeStep.linkedListState && (
                <LinkedListVisualizer state={activeStep.linkedListState} />
              )}

              {activeStep.graphState && (
                <GraphVisualizer state={activeStep.graphState} />
              )}

              {!activeStep.matrixState && !activeStep.boardState && !activeStep.linkedListState && !activeStep.graphState && activeStep.arrayState && activeStep.arrayState.length > 0 && (
                <ArrayVisualizer
                  array={activeStep.arrayState}
                  activeIndices={activeStep.activeIndices || []}
                  pointerLabels={activeStep.pointerLabels}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 font-mono text-xs py-12 gap-3 text-center max-w-sm px-4">
              <PlayCircle className="w-10 h-10 text-cyan-400 animate-bounce" />
              <div className="space-y-1">
                <p className="font-bold text-slate-200 uppercase tracking-widest">Compiler Trace Ready</p>
                <p className="text-[11px] text-slate-500 font-medium">Verify your input parameters and compile an interactive, animated visual trace of this algorithm.</p>
              </div>
              <button
                onClick={() => handleSynthesizeTrace(inputValue)}
                className="mt-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/60 hover:border-cyan-700 text-cyan-400 font-bold text-[11px] px-4 py-2 rounded-lg transition duration-200 uppercase tracking-wider"
              >
                Synthesize trace steps
              </button>
            </div>
          )}
        </div>

        {/* Master state playback deck */}
        {steps.length > 0 && activeStep && (
          <div className="bg-slate-900/40 border border-slate-800 shadow-lg p-4.5 rounded-xl space-y-4">
            
            {/* Header play commands */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Control timeline deck</span>
                <span className="text-xs font-bold text-slate-200 block">
                  Action Step {currentStepIdx + 1} of {totalSteps}
                </span>
              </div>

              {/* Deck buttons */}
              <div className="flex items-center gap-2 self-center">
                <button
                  id="btn-workspace-rewind"
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIdx(0);
                  }}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition"
                  title="Rewind Timeline"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIdx((p) => Math.max(0, p - 1));
                  }}
                  disabled={currentStepIdx === 0}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition disabled:opacity-30"
                  title="Previous frame step"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  id="btn-workspace-play-pause"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-full transition shadow-lg shadow-cyan-500/20"
                  title={isPlaying ? "Pause autoplay" : "Start autoplay"}
                >
                  {isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 fill-slate-950" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIdx((p) => Math.min(totalSteps - 1, p + 1));
                  }}
                  disabled={currentStepIdx === totalSteps - 1}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition disabled:opacity-30"
                  title="Next frame step"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider track indicator */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={totalSteps - 1}
                value={currentStepIdx}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIdx(parseInt(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-semibold">
                <span>Start</span>
                <span>Speed delay: {playbackSpeed}ms</span>
                <span>Finished ({totalSteps} frames)</span>
              </div>
            </div>

            {/* Micro details variable speed selection slider */}
            <div className="bg-slate-950/40 px-3.5 py-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Playback multiplier</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={400}
                  max={3000}
                  step={200}
                  value={3000 - playbackSpeed} // inverse speeds mapping
                  onChange={(e) => setPlaybackSpeed(3000 - parseInt(e.target.value))}
                  className="w-24 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[10px] font-mono font-bold text-cyan-400 w-10 text-right">
                  {((3000 - playbackSpeed) / 1000).toFixed(1)}x
                </span>
              </div>
            </div>

            {/* Text explanation card of this specific state frame */}
            <div className="bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 p-3.5 rounded-xl text-xs md:text-sm font-semibold shadow-inner leading-relaxed backdrop-blur-md">
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-cyan-400 block mb-1">
                Step {currentStepIdx + 1} Action
              </span>
              {activeStep.explanation}
            </div>

            {/* Micro local variables tracker */}
            {activeStep.variablesState && Object.keys(activeStep.variablesState).length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">
                  CURRENT VARIABLE STATES (RAM STACK TRACE)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(activeStep.variablesState).map(([key, value]) => (
                    <div key={key} className="p-2 border border-slate-800 bg-slate-950/40 rounded-lg text-xs font-mono">
                      <span className="text-slate-500 font-semibold">{key}:</span>{" "}
                      <span className="text-cyan-400 font-extrabold">
                        {value === null ? "null" : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Right section: Code Editor pane visual highlights */}
      <div className="w-full md:w-96 flex flex-col bg-slate-950 border-l border-slate-900/80">
        
        {/* Tab commands selection header */}
        <div className="flex bg-slate-950 p-2 border-b border-slate-900">
          <button
            onClick={() => setActiveCodeTab("optimal")}
            className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold uppercase font-mono tracking-wider transition-all duration-250 ${
              activeCodeTab === "optimal"
                ? "bg-slate-900 text-cyan-400 border-b border-cyan-500 shadow-lg shadow-cyan-500/5"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Optimal Algorithm (Dry-run)
          </button>
          <button
            onClick={() => setActiveCodeTab("brute")}
            className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold uppercase font-mono tracking-wider transition-all duration-250 ${
              activeCodeTab === "brute"
                ? "bg-slate-900 text-rose-400 border-b border-rose-500"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Brute Force Code
          </button>
        </div>

        {/* Code display window */}
        <div className="flex-1 overflow-y-auto p-4 select-all bg-slate-950">
          <div className="flex items-center justify-between text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-3">
            <span>JavaScript Implementation ({activeCodeTab === "optimal" ? "Timeline Highlight" : "Static template"})</span>
            <Code className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <pre className="text-xs font-mono leading-relaxed select-text text-teal-300">
            {activeCodeTab === "optimal" ? (
              problem.optimal.code.split("\n").map((line, idx) => {
                const lineNum = idx + 1;
                // Highlight line if matching and in optimal tab
                const isHighlight = activeStep && activeStep.codeHighlightLine === lineNum;

                return (
                  <div
                    key={idx}
                    className={`flex px-2 transition-all duration-200 ${
                      isHighlight ? "bg-cyan-500/10 text-cyan-100 font-extrabold border-l-4 border-cyan-400 shadow-inner" : "opacity-75"
                    }`}
                  >
                    <span className="w-6 text-slate-600 font-bold text-right mr-3 shrink-0 select-none">
                      {lineNum}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })
            ) : (
              problem.bruteForce.code.split("\n").map((line, idx) => (
                <div key={idx} className="flex px-2 opacity-75">
                  <span className="w-6 text-slate-600 font-bold text-right mr-3 shrink-0 select-none">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))
            )}
          </pre>
        </div>

        {/* Space Complexity Card footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-900/80">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
            <span>Dynamic space tracing:</span>
            <span className="text-cyan-400">
              {activeCodeTab === "optimal" ? problem.optimal.spaceComplexity : problem.bruteForce.spaceComplexity}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 mt-1.5">
            <span>Static time efficiency:</span>
            <span className="text-cyan-400">
              {activeCodeTab === "optimal" ? problem.optimal.timeComplexity : problem.bruteForce.timeComplexity}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
