import React from "react";

interface ArrayVisualizerProps {
  array: (number | string)[];
  activeIndices: number[];
  pointerLabels?: Record<string, string>;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array,
  activeIndices,
  pointerLabels = {},
}) => {
  return (
    <div className="flex flex-col items-center w-full py-6">
      <div className="flex flex-wrap items-end justify-center gap-3 md:gap-4 px-2 select-none min-h-[140px]">
        {array.map((value, idx) => {
          const isActive = activeIndices.includes(idx);
          const pointerText = pointerLabels[String(idx)] || pointerLabels[idx];

          // Determine aesthetic accent for special values (0s, 1s, 2s) for Dutch flag sorting
          let valueTheme = "bg-slate-950 border-slate-800 text-slate-100";
          if (value === 0 || value === "0") {
            valueTheme = "bg-red-950/50 border-red-800/60 text-red-400";
          } else if (value === 1 || value === "1") {
            valueTheme = "bg-cyan-950/50 border-cyan-800/60 text-cyan-400";
          } else if (value === 2 || value === "2") {
            valueTheme = "bg-blue-950/50 border-blue-800/60 text-blue-400";
          } else {
            const num = Number(value);
            if (!isNaN(num) && num < 0) {
              valueTheme = "bg-amber-950/50 border-amber-800/60 text-amber-400 font-semibold";
            } else if (!isNaN(num) && num > 0) {
              valueTheme = "bg-emerald-950/50 border-emerald-800/60 text-emerald-400 font-semibold";
            }
          }

          return (
            <div
              key={idx}
              id={`array-cell-${idx}`}
              className="flex flex-col items-center animate-fade-in duration-300"
            >
              {/* Pointer indicators above the blocks */}
              <div className="h-10 flex flex-col justify-end items-center mb-2">
                {pointerText && (
                  <div className="bg-cyan-500 text-slate-950 text-[10px] font-black font-mono px-2 py-1.5 rounded shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-400 animate-bounce">
                    {pointerText}
                  </div>
                )}
              </div>

              {/* Central Array Cell */}
              <div
                className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-2 text-xl font-bold font-mono transition-all duration-300 shadow-sm ${valueTheme} ${
                  isActive
                    ? "ring-4 ring-cyan-400 scale-110 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] translate-y-[-4px]"
                    : ""
                }`}
              >
                {value}
              </div>

              {/* Index counter labels below */}
              <div className="text-slate-500 text-xs font-mono mt-1 w-full text-center font-bold">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
