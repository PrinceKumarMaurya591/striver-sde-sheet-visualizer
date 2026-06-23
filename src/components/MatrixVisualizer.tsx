import React from "react";
import { Crown } from "lucide-react";

interface MatrixVisualizerProps {
  matrix?: (number | string)[][];
  board?: string[][]; // Chessboard representation for N-Queens
  activeIndices?: number[]; // Flattened indices (row * numCols + col)
  activeMarkers?: { activeRow?: number; activeCol?: number };
}

export const MatrixVisualizer: React.FC<MatrixVisualizerProps> = ({
  matrix,
  board,
  activeIndices = [],
  activeMarkers,
}) => {
  // If we are showing the chess board configuration
  if (board) {
    const N = board.length;
    return (
      <div className="flex flex-col items-center justify-center w-full py-6 select-none">
        <div 
          className="grid gap-[2px] bg-slate-950 p-2.5 rounded-xl shadow-2xl border border-slate-800/80 hover:shadow-cyan-500/5 transition-all duration-300"
          style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
        >
          {board.map((rowArr, rIdx) =>
            rowArr.map((cell, cIdx) => {
              const isDark = (rIdx + cIdx) % 2 === 1;
              const hasQueen = cell === "Q";
              const isCheckingCell = activeMarkers?.activeRow === rIdx && activeMarkers?.activeCol === cIdx;
              const isCheckingRowOrCol = activeMarkers?.activeRow === rIdx || activeMarkers?.activeCol === cIdx;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center relative font-mono text-xs z-10 transition-all duration-300 rounded-[4px] ${
                    isDark ? "bg-[#090d16] text-slate-400" : "bg-slate-800 text-slate-200"
                  } ${
                    isCheckingCell 
                      ? "ring-4 ring-rose-500 scale-105 z-20 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                      : (isCheckingRowOrCol && !hasQueen && activeMarkers) 
                        ? "bg-rose-500/10 border border-dashed border-rose-500/30" 
                        : ""
                  }`}
                >
                  {/* Grid labels occasionally in margin corners */}
                  <span className="absolute top-0.5 left-1 opacity-25 text-[8px] text-slate-500">
                    {rIdx},{cIdx}
                  </span>

                  {hasQueen ? (
                    <div className="absolute inset-0 flex items-center justify-center animate-bounce-slow">
                      <Crown className="w-7 h-7 md:w-9 md:h-9 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-4 mt-5 font-mono text-[10px] text-slate-400 font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-slate-800 border border-slate-700 rounded" />
            <span>Light square</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#090d16] border border-slate-900 rounded" />
            <span>Dark square</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
            <span>Placed Queen</span>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render general Set Matrix Zeroes Matrix representation
  if (matrix && matrix.length > 0) {
    const numCols = matrix[0].length;

    return (
      <div className="flex flex-col items-center justify-center w-full py-6 select-none">
        <div 
          className="grid gap-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-2xl"
          style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
        >
          {matrix.map((rowArr, rIdx) =>
            rowArr.map((cell, cIdx) => {
              const flatIndex = rIdx * numCols + cIdx;
              const isActive = activeIndices.includes(flatIndex);

              // Elements and headings highlighting (e.g. Row 0 or Col 0 flags)
              const isRowFlag = rIdx === 0;
              const isColFlag = cIdx === 0;
              const isZero = cell === 0 || cell === "0";

              let cellStyles = "bg-slate-900/40 border-slate-800/80 text-slate-200";
              if (isZero) {
                cellStyles = "bg-rose-950/40 border-rose-800/80 text-rose-400 font-bold shadow-inner";
              } else if (isRowFlag || isColFlag) {
                cellStyles = "bg-cyan-950/30 border-cyan-800/50 text-cyan-300 font-semibold";
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center relative rounded-xl border-2 text-lg font-mono font-bold transition-all duration-300 shadow-sm ${cellStyles} ${
                    isActive
                      ? "ring-4 ring-cyan-400 scale-105 border-cyan-500 z-10 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : ""
                  }`}
                >
                  <span className="text-[9px] text-slate-500 font-medium absolute top-0.5 left-1 opacity-70">
                    ({rIdx},{cIdx})
                  </span>
                  <span className="translate-y-1">{cell}</span>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-4 mt-5 font-mono text-[10px] text-slate-400 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-cyan-950/30 border border-cyan-800 rounded" />
            <span>First Row/Col Flag markers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-rose-950/40 border border-rose-800 rounded" />
            <span>Zero Cells</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
