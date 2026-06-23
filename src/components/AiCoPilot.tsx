import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Pause, SkipBack, SkipForward, RotateCcw, AlertCircle, RefreshCw, Cpu, Code2, PlayCircle, HelpCircle } from "lucide-react";
import { TraceStep } from "../types";
import { ArrayVisualizer } from "./ArrayVisualizer";

export const AiCoPilot: React.FC = () => {
  const [problemTitle, setProblemTitle] = useState("Find Duplicates in Array");
  const [codeSnippet, setCodeSnippet] = useState(
`import java.util.*;

public class Solution {
    public static List<Integer> findDuplicates(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        List<Integer> duplicates = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (seen.contains(nums[i])) {
                duplicates.add(nums[i]);
            } else {
                seen.add(nums[i]);
            }
        }
        return duplicates;
    }
}`);
  const [customInput, setCustomInput] = useState("2,4,4,1,8,2,9");
  const [loading, setLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Tracing Playback engine states
  const [steps, setSteps] = useState<TraceStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // ms per step

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Preset suggestions to populate the form instantly
  const presetProblems = [
    {
      title: "Find Duplicates in Array",
      input: "2,4,4,1,8,2,9",
      code: `import java.util.*;

public class Solution {
    public static List<Integer> findDuplicates(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        List<Integer> duplicates = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (seen.contains(nums[i])) {
                duplicates.add(nums[i]);
            } else {
                seen.add(nums[i]);
            }
        }
        return duplicates;
    }
}`
    },
    {
      title: "Move Zeroes to End",
      input: "0,1,0,3,12",
      code: `public class Solution {
    public static void moveZeroes(int[] nums) {
        int insertPos = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                // Swap elements
                int temp = nums[insertPos];
                nums[insertPos] = nums[i];
                nums[i] = temp;
                insertPos++;
            }
        }
    }
}`
    },
    {
      title: "Find Majority Element (> N/2)",
      input: "2,2,1,1,1,2,2",
      code: `public class Solution {
    // Boyer-Moore Voting Algorithm
    public static int majorityElement(int[] nums) {
        int candidate = 0;
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            if (count == 0) candidate = nums[i];
            count += (nums[i] == candidate) ? 1 : -1;
        }
        return candidate;
    }
}`
    }
  ];

  const handleSelectPreset = (p: typeof presetProblems[0]) => {
    setProblemTitle(p.title);
    setCustomInput(p.input);
    setCodeSnippet(p.code);
    setError(null);
    setSteps([]);
  };

  // Traced auto playing loops
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

  const handleGenerateTrace = async () => {
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setSteps([]);

    // Custom multi-stage comfort loader text generator sequential
    const messages = [
      "Contacting server backend...",
      "Initializing highly intelligent Gemini model...",
      "Analyzing algorithm structures & code block tokens...",
      "Simulating dry-run with input params...",
      "Creating SVG coordinates & array highlights...",
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
          problemTitle,
          codeSnippet,
          customInput,
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
      setError(err.message || "An unexpected network or compiler error occurred.");
    } finally {
      clearInterval(msgTimer);
      setLoading(false);
    }
  };

  const activeStep = steps[currentStepIdx];
  const totalSteps = steps.length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#020617]">
      {/* Banner introduction with AI branding */}
      <div className="bg-slate-950/45 p-5 md:p-6 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-950 text-cyan-400 border border-cyan-800 p-2.5 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse">
              <Sparkles className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-100 tracking-tight uppercase">AI DSA SANDBOX CO-PILOT</h1>
              <p className="text-xs text-slate-400 font-medium">
                Type any custom algorithm questions, paste code, and let Gemini synthesize visual traces instantly!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetProblems.map((p) => (
              <button
                key={p.title}
                onClick={() => handleSelectPreset(p)}
                className="bg-slate-900 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/20 hover:bg-slate-800 text-[10px] font-bold font-mono px-3 py-1.5 rounded-full transition duration-200"
              >
                + {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column config fields */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-cyan-450" />
              <span>Sandbox parameters</span>
            </h3>

            {/* Problem title field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                Algorithm / Problem title
              </label>
              <input
                id="ai-problem-title"
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g. Move Zeroes to End, Matrix Search"
                className="w-full text-xs p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Custom array parameters */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                Mock Input array
              </label>
              <input
                id="ai-custom-input"
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Comma separated: 1,3,0,12"
                className="w-full text-xs p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <span className="text-[10px] text-slate-500 font-medium block mt-1.5">
                Comma-separated structures display beautifully in our animated arrays block!
              </span>
            </div>

            {/* Code editor snippet block */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono flex items-center justify-between">
                <span>Code implementation (Java)</span>
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
              </label>
              <textarea
                id="ai-code-editor"
                rows={10}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full text-[10px] md:text-xs font-mono p-3 bg-slate-950 border border-slate-800 rounded-lg text-teal-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
              />
            </div>

            {/* Main generation trigger */}
            <button
              id="ai-btn-generate"
              disabled={loading}
              onClick={handleGenerateTrace}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 border border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generating ({loadingStepText})</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Synthesize AI Visual Trace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column rendering viewport */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-2 text-rose-450 text-xs leading-relaxed">
              <Cpu className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <span className="font-bold block">Analysis Failed</span>
                <p className="mt-0.5 font-medium text-slate-300">{error}</p>
                <div className="mt-2 text-[10px] text-rose-400 font-semibold font-mono uppercase tracking-wider">
                  Make sure your network has an active connection and GEMINI_API_KEY is configured in Secrets tab if requested.
                </div>
              </div>
            </div>
          )}

          {/* Prompt banner when no states exist */}
          {!loading && steps.length === 0 && !error && (
            <div className="bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] border-2 border-slate-800/80 border-dashed rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-cyan-950 text-cyan-400 border border-cyan-800/40 rounded-full flex items-center justify-center mb-3 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-200 text-sm tracking-tight">VISUALIZE CUSTOM LOGIC</h4>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
                Press the **Synthesize AI Visual Trace** button. Gemini will digest your code, carry out a complete step-by-step Dry Run, and produce an interactive timeline.
              </p>
              <div className="flex items-center gap-2 mt-5 text-[10px] bg-slate-950 border border-slate-850 text-slate-550 px-3 py-1 rounded-full font-mono font-bold leading-none select-none">
                <Sparkles className="w-3.5 h-3.5 text-cyan-450" />
                <span>POWERED BY GEMINI-2.5 MODEL ENGINE</span>
              </div>
            </div>
          )}

          {/* Loaded visual timeline workspace */}
          {steps.length > 0 && activeStep && (
            <div className="bg-slate-900/40 border border-slate-800 shadow-lg p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>AI Dry Run Trace</span>
                    <span className="bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      Step {currentStepIdx + 1} of {totalSteps}
                    </span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    Successfully synthesized logic pathways of your algorithm input
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIdx(0);
                    }}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition"
                    title="Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIdx((p) => Math.max(0, p - 1));
                    }}
                    disabled={currentStepIdx === 0}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition disabled:opacity-30"
                    title="Step backward"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-ai-play-pause"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-full transition shadow-lg shadow-cyan-500/10"
                    title={isPlaying ? "Pause autoplay" : "Start autoplay"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIdx((p) => Math.min(totalSteps - 1, p + 1));
                    }}
                    disabled={currentStepIdx === totalSteps - 1}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition disabled:opacity-30"
                    title="Step forward"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Slider track indicators */}
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
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
                  <span>Start</span>
                  <span>Autoplay interval: {(playbackSpeed / 1000).toFixed(1)}s</span>
                  <span>End ({totalSteps} steps)</span>
                </div>
              </div>

              {/* Slider for playback speed */}
              <div className="bg-slate-955/40 px-3.5 py-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest font-mono">Speed multiplier</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={400}
                    max={3000}
                    step={200}
                    value={3000 - playbackSpeed} // reverse mapping to feel fast
                    onChange={(e) => setPlaybackSpeed(3000 - parseInt(e.target.value))}
                    className="w-24 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-[10px] font-mono font-bold text-cyan-400 w-10 text-right">
                    {((3000 - playbackSpeed) / 1000).toFixed(1)}x
                  </span>
                </div>
              </div>

              {/* Explanation guidance card */}
              <div className="bg-cyan-950/40 border border-cyan-800/40 p-3.5 rounded-xl text-xs md:text-sm text-cyan-200 leading-relaxed font-semibold backdrop-blur-md">
                <span className="font-extrabold text-cyan-400 uppercase tracking-widest block mb-1 text-[10px] font-mono">Step {currentStepIdx + 1} Action</span>
                {activeStep.explanation}
              </div>

              {/* Graphical Canvas Renderings */}
              {activeStep.arrayState && activeStep.arrayState.length > 0 && (
                <div className="border border-slate-800/80 rounded-xl p-3 bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] shadow-inner">
                  <span className="text-[10px] font-extrabold font-mono text-slate-500 uppercase tracking-widest block ml-2">Array Viewport</span>
                  <ArrayVisualizer
                    array={activeStep.arrayState}
                    activeIndices={activeStep.activeIndices || []}
                    pointerLabels={activeStep.pointerLabels}
                  />
                </div>
              )}

              {/* Stack / Memory variable trackers block */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">VARIABLES STATE (MEMORY STACK)</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(activeStep.variablesState).map(([key, value]) => (
                    <div key={key} className="p-2 border border-slate-800 rounded-lg bg-slate-950/40 text-xs font-mono">
                      <span className="text-slate-500 font-semibold">{key}: </span>
                      <span className="text-cyan-400 font-bold">
                        {value === null ? "null" : String(value)}
                      </span>
                    </div>
                  ))}
                  {Object.keys(activeStep.variablesState).length === 0 && (
                    <div className="col-span-3 text-center text-[10px] text-slate-650 font-bold font-mono py-2 uppercase">
                      No active variables tracked at this step.
                    </div>
                  )}
                </div>
              </div>

              {/* Code pane logic highlights */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">HIGHLIGHTED ACTIVE CODE INSTRUCT</span>
                <div className="bg-slate-950 rounded-lg p-2.5 overflow-x-auto max-h-[160px] border border-slate-900">
                  <pre className="text-[10px] md:text-xs font-mono text-teal-300">
                    {codeSnippet.split("\n").map((line, idx) => {
                      const lineNum = idx + 1;
                      const isHighlighted = activeStep.codeHighlightLine === lineNum;

                      return (
                        <div
                          key={idx}
                          className={`flex select-all px-2 transition-all duration-150 ${
                            isHighlighted ? "bg-cyan-500/10 text-cyan-100 font-extrabold border-l-4 border-cyan-400" : "opacity-75"
                          }`}
                        >
                          <span className="w-6 text-slate-600 font-semibold text-right mr-3 select-none">
                            {lineNum}
                          </span>
                          <span>{line}</span>
                        </div>
                      );
                    })}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
