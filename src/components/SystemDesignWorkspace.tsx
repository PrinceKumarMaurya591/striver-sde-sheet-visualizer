import React, { useState } from "react";
import { DesignPattern, SystemDesignProblem } from "../types";
import { DESIGN_PATTERNS, HLD_PROBLEMS, isDesignPattern } from "../data/systemDesignData";
import { DesignPatternVisualizer } from "./DesignPatternVisualizer";
import { SystemArchitectureVisualizer } from "./SystemArchitectureVisualizer";

interface SystemDesignWorkspaceProps {
  problemId: string;
}

export const SystemDesignWorkspace: React.FC<SystemDesignWorkspaceProps> = ({ problemId }) => {
  const [activeTab, setActiveTab] = useState<"info" | "code" | "diagram">("info");
  const [activeParticipantId, setActiveParticipantId] = useState<string | undefined>(undefined);

  // Find the matching design pattern or HLD problem
  const designPattern = DESIGN_PATTERNS.find(p => p.id === problemId);
  const hldProblem = HLD_PROBLEMS.find(p => p.id === problemId);

  if (designPattern) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#020617]">
        {/* Header */}
        <div className="bg-slate-950/45 p-5 md:p-6 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                designPattern.category === 'creational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                designPattern.category === 'structural' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {designPattern.category}
              </span>
              <span className="text-[10px] font-bold font-mono text-slate-500">
                Design Pattern
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-100 tracking-tight">
              {designPattern.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1 font-medium italic">
              "{designPattern.intent}"
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full p-4 md:p-6 space-y-5">
          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-900/40 border border-slate-800/80 rounded-lg p-1">
            {[
              { id: "info" as const, label: "Info & Structure" },
              { id: "diagram" as const, label: "Class Diagram" },
              { id: "code" as const, label: "Code Example" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-bold font-mono tracking-wider transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-cyan-600 text-slate-950 shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content: Info */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Problem & Solution */}
              <div className="space-y-4">
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono mb-2">
                    Problem
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {designPattern.problem}
                  </p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono mb-2">
                    Solution
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {designPattern.solution}
                  </p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono mb-2">
                    Real World Example
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {designPattern.realWorldExample}
                  </p>
                </div>
              </div>

              {/* When to use, Pros, Cons */}
              <div className="space-y-4">
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono mb-2">
                    When to Use
                  </h3>
                  <ul className="space-y-1.5">
                    {designPattern.whenToUse.map((item, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono mb-2">
                      Pros ✓
                    </h3>
                    <ul className="space-y-1">
                      {designPattern.pros.map((item, i) => (
                        <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-400">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono mb-2">
                      Cons ✗
                    </h3>
                    <ul className="space-y-1">
                      {designPattern.cons.map((item, i) => (
                        <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <span className="text-rose-400">−</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab content: Class Diagram */}
          {activeTab === "diagram" && (
            <div className="space-y-4">
              <DesignPatternVisualizer
                pattern={designPattern}
                activeParticipantId={activeParticipantId}
              />
              {/* Participants list */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono mb-3">
                  Participants ({designPattern.participants.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {designPattern.participants.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setActiveParticipantId(
                        activeParticipantId === p.id ? undefined : p.id
                      )}
                      className={`text-left p-3 rounded-lg border text-xs font-mono transition-all duration-200 ${
                        activeParticipantId === p.id
                          ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-300"
                          : "bg-slate-950/60 border-slate-800/60 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <span className={`font-bold block ${
                        p.type === 'interface' ? 'text-emerald-400' :
                        p.type === 'abstract-class' ? 'text-amber-400' : 'text-slate-200'
                      }`}>
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-500 italic">{p.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab content: Code */}
          {activeTab === "code" && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono mb-3">
                TypeScript/JavaScript Implementation
              </h3>
              <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto max-h-[500px] border border-slate-900">
                <pre className="text-xs font-mono text-teal-300 leading-relaxed select-all whitespace-pre-wrap">
                  {designPattern.codeExample}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (hldProblem) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#020617]">
        {/* Header */}
        <div className="bg-slate-950/45 p-5 md:p-6 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                HLD
              </span>
              <span className="text-[10px] font-bold font-mono text-slate-500">
                System Architecture
              </span>
              {hldProblem.estimatedScale && (
                <span className="text-[10px] font-bold font-mono text-amber-400">
                  📊 {hldProblem.estimatedScale}
                </span>
              )}
            </div>
            <h1 className="text-xl font-black text-slate-100 tracking-tight">
              Design {hldProblem.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
              {hldProblem.description}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full p-4 md:p-6 space-y-5">
          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-900/40 border border-slate-800/80 rounded-lg p-1">
            {[
              { id: "info" as const, label: "Requirements & Deep Dive" },
              { id: "diagram" as const, label: "Architecture Diagram" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-bold font-mono tracking-wider transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-cyan-600 text-slate-950 shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Info */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 space-y-4">
                {/* Requirements */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono mb-3">
                    Requirements
                  </h3>
                  <ul className="space-y-1.5">
                    {hldProblem.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Components list */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono mb-3">
                    Components ({hldProblem.components.length})
                  </h3>
                  <div className="space-y-1.5">
                    {hldProblem.components.map(comp => (
                      <div key={comp.id} className="flex items-center gap-2 text-xs text-slate-300 p-1.5 rounded hover:bg-slate-800/30 transition">
                        <span className="text-sm">{comp.name.split(' ')[0] === comp.name ? comp.name : comp.name.split(' ')[0]}</span>
                        <span className="font-mono text-[10px] text-slate-500">{comp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-up questions */}
                {hldProblem.followUp && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono mb-3">
                      Follow-up Questions
                    </h3>
                    <ul className="space-y-1.5">
                      {hldProblem.followUp.map((q, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-rose-400 mt-0.5 shrink-0">?</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Deep Dive */}
              <div className="lg:col-span-3">
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono mb-4">
                    Deep Dive Analysis
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    {hldProblem.deepDive?.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return (
                          <h4 key={i} className="text-sm font-bold text-slate-200 mt-4 mb-2 font-mono">
                            {line.replace('## ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('### ')) {
                        return (
                          <h5 key={i} className="text-xs font-bold text-cyan-400 mt-3 mb-1.5 font-mono uppercase tracking-wider">
                            {line.replace('### ', '')}
                          </h5>
                        );
                      }
                      if (line.startsWith('- **')) {
                        return (
                          <div key={i} className="text-xs text-slate-300 ml-3 my-1 flex items-start gap-2">
                            <span className="text-cyan-400 mt-0.5">•</span>
                            <span className="font-bold text-slate-200">
                              {line.match(/\*\*(.*?)\*\*/)?.[1]}
                            </span>
                            <span>{line.replace(/\*\*.*?\*\*:\s*/, ': ')}</span>
                          </div>
                        );
                      }
                      if (line.match(/^\d+\./)) {
                        return (
                          <div key={i} className="text-xs text-slate-300 ml-3 my-1 flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5 shrink-0">{line.match(/^\d+\./)?.[0]}</span>
                            <span>{line.replace(/^\d+\.\s*/, '')}</span>
                          </div>
                        );
                      }
                      if (line.trim() === '') return <div key={i} className="h-2" />;
                      return (
                        <p key={i} className="text-xs text-slate-300 leading-relaxed mb-2">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Architecture Diagram */}
          {activeTab === "diagram" && (
            <SystemArchitectureVisualizer problem={hldProblem} />
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex-1 flex items-center justify-center bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
      <div className="text-center">
        <h2 className="text-lg font-black text-slate-300">System Design</h2>
        <p className="text-xs text-slate-500 mt-1">Select a design pattern or architecture from the sidebar.</p>
      </div>
    </div>
  );
};
