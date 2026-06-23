import React, { useMemo } from "react";

interface GraphState {
  nodes: Array<{ id: string; text: string; active?: boolean; finished?: boolean; distance?: string }>;
  edges: Array<{ from: string; to: string; weight?: number; active?: boolean }>;
}

interface GraphVisualizerProps {
  state?: GraphState;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ state }) => {
  if (!state || !state.nodes || state.nodes.length === 0) {
    return (
      <div className="flex justify-center p-8 text-slate-400 font-mono">
        No graph metrics loaded.
      </div>
    );
  }

  const { nodes, edges } = state;
  const N = nodes.length;

  // Compute radial coordinate positions for each node in a fixed bounding viewBox
  const coords = useMemo(() => {
    const radiusX = 140; // horizontal stretch
    const radiusY = 90;  // vertical scale
    const centerX = 200;
    const centerY = 120;

    const coordsRecord: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node, idx) => {
      const angle = (2 * Math.PI / N) * idx - Math.PI / 2; // offset starting position to top
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      coordsRecord[node.id] = { x, y };
    });
    return coordsRecord;
  }, [nodes, N]);

  return (
    <div className="flex flex-col items-center w-full py-2 overflow-x-auto select-none">
      <div className="w-full max-w-[500px] border border-slate-200 bg-white rounded-xl shadow-inner p-2 relative">
        <svg 
          viewBox="0 0 400 240" 
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Defs for markers if we want directional arrows */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Draw edges/linkages */}
          {edges.map((edge, idx) => {
            const fromCoord = coords[edge.from];
            const toCoord = coords[edge.to];
            if (!fromCoord || !toCoord) return null;

            // Prevent drawing duplicate bidirectional lines offset slightly
            const edgeKey = `${edge.from}-${edge.to}`;
            
            return (
              <g key={edgeKey}>
                <line
                  x1={fromCoord.x}
                  y1={fromCoord.y}
                  x2={toCoord.x}
                  y2={toCoord.y}
                  className={`transition-all duration-500 stroke-[3.5] ${
                    edge.active 
                      ? "stroke-amber-400 shadow animate-pulse" 
                      : "stroke-slate-200"
                  }`}
                />
                
                {/* Midpoints weight indicators */}
                {edge.weight !== undefined && (
                  <g transform={`translate(${(fromCoord.x + toCoord.x) / 2}, ${(fromCoord.y + toCoord.y) / 2})`}>
                    <rect
                      x="-11"
                      y="-10"
                      width="22"
                      height="20"
                      rx="4"
                      className="fill-slate-900 stroke stroke-slate-700"
                    />
                    <text
                      dy="4"
                      textAnchor="middle"
                      className="fill-white font-mono font-bold text-[10px]"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Draw nodes circles */}
          {nodes.map((node) => {
            const coord = coords[node.id];
            if (!coord) return null;

            return (
              <g 
                key={node.id} 
                transform={`translate(${coord.x}, ${coord.y})`}
                className="transition-transform duration-300"
              >
                {/* External glowing outer halo */}
                <circle
                  r="21"
                  className={`fill-none transition-all duration-300 ${
                    node.active 
                      ? "stroke-sky-400 stroke-[5] animate-ping opacity-45" 
                      : "stroke-transparent"
                  }`}
                />

                {/* Primary Circle caps */}
                <circle
                  r="18"
                  className={`transition-all duration-300 stroke-[2] ${
                    node.active
                      ? "fill-sky-50 stroke-sky-400 font-bold scale-110 drop-shadow"
                      : node.finished
                        ? "fill-indigo-600 stroke-indigo-800 text-white"
                        : "fill-white stroke-slate-400"
                  }`}
                />

                {/* Label text */}
                <text
                  dy="4"
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-bold ${
                    node.finished ? "fill-white" : "fill-slate-800"
                  }`}
                >
                  {node.text}
                </text>

                {/* Shortest distance label badges below circle */}
                <g transform="translate(0, 31)">
                  <rect
                    x="-20"
                    y="-9"
                    width="40"
                    height="16"
                    rx="4"
                    className={`stroke-[1] ${
                      node.active 
                        ? "fill-sky-100 stroke-sky-300"
                        : "fill-slate-100 stroke-slate-200"
                    }`}
                  />
                  <text
                    dy="3"
                    textAnchor="middle"
                    className="font-mono text-[9px] font-bold fill-slate-700"
                  >
                    dist: {node.distance === "Infinity" ? "∞" : node.distance}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Visual legends */}
      <div className="flex items-center gap-4 mt-6 font-mono text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-sky-50 border-2 border-sky-400 rounded-full" />
          <span>Active / Querying node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-indigo-600 border-2 border-indigo-800 rounded-full" />
          <span>Visited / Solved vertices</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-3 h-0.5 bg-amber-400" />
          <span>Active Edge route</span>
        </div>
      </div>
    </div>
  );
};
