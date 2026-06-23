import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface LinkedListNode {
  id: string;
  val: number | string;
}

interface LinkedListState {
  nodes: LinkedListNode[];
  pointers: Record<string, string>; // pointerName: nodeId
  reverseArrows?: string[]; // nodeIds whose pointers now go backward
}

interface LinkedListVisualizerProps {
  state?: LinkedListState;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ state }) => {
  if (!state || !state.nodes || state.nodes.length === 0) {
    return (
      <div className="flex justify-center p-8 text-slate-400 font-mono">
        No linked list details loaded.
      </div>
    );
  }

  const { nodes, pointers, reverseArrows = [] } = state;

  return (
    <div className="flex flex-col items-center w-full py-8 overflow-x-auto min-h-[160px]">
      <div className="flex items-center justify-start md:justify-center gap-2 px-6 min-w-max select-none">
        {nodes.map((node, index) => {
          // Identify pointers pointing to this specific node ID
          const activePointers = Object.entries(pointers)
            .filter(([_, nodeId]) => nodeId === node.id)
            .map(([pointerName]) => pointerName);

          const isReversed = reverseArrows.includes(node.id);
          const isLastNode = index === nodes.length - 1;

          return (
            <div key={node.id} className="flex items-center gap-1.5 md:gap-3 transition-all duration-300">
              {/* Node Column wrapper */}
              <div className="flex flex-col items-center relative">
                {/* Pointer indicators at the top */}
                <div className="h-12 flex flex-col justify-end gap-1 mb-2">
                  {activePointers.map((pName) => {
                    let color = "bg-slate-800 border-slate-700 text-slate-300";
                    if (pName === "curr") color = "bg-cyan-500 border-cyan-400 text-slate-950 font-black shadow-[0_0_8px_rgba(6,182,212,0.3)]";
                    if (pName === "prev") color = "bg-rose-600 border-rose-500 text-white font-bold";
                    if (pName === "nextTemp") color = "bg-amber-500 border-amber-400 text-slate-950 font-semibold animate-pulse";

                    return (
                      <span
                        key={pName}
                        className={`text-[9px] md:text-xs font-semibold font-mono px-2 py-0.5 rounded shadow border ${color}`}
                      >
                        {pName}
                      </span>
                    );
                  })}
                </div>

                {/* Split pill Capsule Node */}
                <div className="flex items-center border-2 border-slate-800 bg-slate-900 rounded-full shadow-lg overflow-hidden hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
                  {/* Left: Value Segment */}
                  <div className="bg-[#0e172a] text-cyan-300 font-mono font-black px-4 py-2 text-md border-r border-slate-800 select-none">
                    {node.val}
                  </div>
                  {/* Right: Dot Link Segment */}
                  <div className="bg-slate-950 px-3 py-2 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-glow animate-pulse" />
                  </div>
                </div>

                {/* Node subscript metadata */}
                <span className="text-[10px] text-slate-500 font-mono mt-2 font-bold">
                  Node[{index}]
                </span>
              </div>

              {/* Connecting links / arrows */}
              {!isLastNode && (
                <div className="flex flex-col items-center justify-center min-w-[36px] md:min-w-[48px] h-10 select-none">
                  {isReversed ? (
                    <div className="flex flex-col items-center text-rose-450 animate-pulse">
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                      <span className="text-[7px] font-bold font-mono">rev</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-cyan-400">
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                      <span className="text-[7px] font-bold font-mono text-slate-500">next</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* terminal null Node representation */}
        <div className="flex flex-col items-center">
          <div className="h-12" />
          <div className="flex items-center justify-center w-10 h-10 border-2 border-slate-800 border-dashed bg-slate-950 text-slate-650 rounded-full font-mono text-xs font-black shadow-inner select-none">
            NULL
          </div>
          <span className="text-[9px] text-slate-600 font-mono mt-2 opacity-60">
            ground
          </span>
        </div>
      </div>
    </div>
  );
};
