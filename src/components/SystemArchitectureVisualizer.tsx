import React, { useMemo, useState } from "react";
import { SystemDesignProblem } from "../types";
import { HLD_COMPONENT_COLORS } from "../data/systemDesignColors";

interface SystemArchitectureVisualizerProps {
  problem: SystemDesignProblem;
  activeComponentId?: string;
  onComponentClick?: (componentId: string) => void;
}

const COMP_WIDTH = 160;
const COMP_HEIGHT = 80;
const H_GAP = 60;
const V_GAP = 50;
const PADDING = 40;

export const SystemArchitectureVisualizer: React.FC<SystemArchitectureVisualizerProps> = ({
  problem,
  activeComponentId,
  onComponentClick,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Layered layout: assign y-position based on component type layer
  const layout = useMemo(() => {
    const layers: Record<string, number> = {
      client: 0,
      dns: 0,
      cdn: 1,
      "load-balancer": 2,
      "api-gateway": 2,
      "web-server": 3,
      microservice: 3,
      cache: 3,
      "message-queue": 3,
      database: 4,
      "object-storage": 4,
      worker: 4,
      "search-service": 4,
    };

    // Group by layer
    const layerGroups: Record<number, typeof problem.components> = {};
    problem.components.forEach(comp => {
      const layer = layers[comp.type] ?? 3;
      if (!layerGroups[layer]) layerGroups[layer] = [];
      layerGroups[layer].push(comp);
    });

    const maxCols = Math.max(...Object.values(layerGroups).map(g => g.length));
    const svgWidth = maxCols * (COMP_WIDTH + H_GAP) + PADDING;
    const layerCount = Object.keys(layerGroups).length;
    const svgHeight = layerCount * (COMP_HEIGHT + V_GAP) + PADDING;

    const positions = new Map<string, { x: number; y: number }>();
    Object.entries(layerGroups).forEach(([layerStr, comps]) => {
      const layer = parseInt(layerStr);
      const totalWidth = comps.length * COMP_WIDTH + (comps.length - 1) * H_GAP;
      const startX = (svgWidth - totalWidth) / 2;
      const y = PADDING / 2 + layer * (COMP_HEIGHT + V_GAP) + 30;

      comps.forEach((comp, idx) => {
        const x = startX + idx * (COMP_WIDTH + H_GAP);
        positions.set(comp.id, { x, y });
      });
    });

    return {
      positions,
      svgWidth: Math.max(svgWidth, 500),
      svgHeight: Math.max(svgHeight, 350),
      layerGroups,
    };
  }, [problem.components]);

  const getCompColor = (type: string) => {
    return HLD_COMPONENT_COLORS[type as keyof typeof HLD_COMPONENT_COLORS] || HLD_COMPONENT_COLORS["web-server"];
  };

  return (
    <div className="w-full overflow-x-auto bg-[#020617] rounded-xl border border-slate-800/80 p-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2 ml-1">
        System Architecture — {problem.title}
      </div>
      <svg
        viewBox={`0 0 ${layout.svgWidth} ${layout.svgHeight}`}
        className="w-full h-auto min-h-[300px]"
        style={{ maxHeight: "550px" }}
      >
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
          <marker id="arch-arrow-active" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
          </marker>
        </defs>

        {/* Draw connections */}
        {problem.connections.map((conn, idx) => {
          const fromPos = layout.positions.get(conn.from);
          const toPos = layout.positions.get(conn.to);
          if (!fromPos || !toPos) return null;

          const fromX = fromPos.x + COMP_WIDTH / 2;
          const fromY = fromPos.y + COMP_HEIGHT;
          const toX = toPos.x + COMP_WIDTH / 2;
          const toY = toPos.y;

          const isActive = activeComponentId === conn.from || activeComponentId === conn.to ||
                           hoveredId === conn.from || hoveredId === conn.to;

          return (
            <g key={`conn-${idx}`}>
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={isActive ? "#22d3ee" : "#334155"}
                strokeWidth={isActive ? 2 : 1.5}
                strokeDasharray={isActive ? "" : "4,3"}
                markerEnd={isActive ? "url(#arch-arrow-active)" : "url(#arch-arrow)"}
                className="transition-all duration-300"
              />
              {conn.label && (
                <g transform={`translate(${(fromX + toX) / 2}, ${(fromY + toY) / 2 - 8})`}>
                  <rect
                    x={-conn.label.length * 4 - 4}
                    y={-9}
                    width={conn.label.length * 8 + 8}
                    height={16}
                    rx={3}
                    className={isActive ? "fill-cyan-950/80 stroke-cyan-500/40" : "fill-slate-950/80 stroke-slate-700/40"}
                  />
                  <text
                    textAnchor="middle"
                    dy="3.5"
                    className={`font-mono text-[8px] ${isActive ? "fill-cyan-300" : "fill-slate-400"}`}
                  >
                    {conn.label}
                  </text>
                </g>
              )}
              {conn.protocol && (
                <text
                  x={(fromX + toX) / 2}
                  y={(fromY + toY) / 2 + 10}
                  textAnchor="middle"
                  className="fill-slate-600 font-mono text-[7px]"
                >
                  {conn.protocol}
                </text>
              )}
            </g>
          );
        })}

        {/* Draw component boxes */}
        {problem.components.map((comp) => {
          const pos = layout.positions.get(comp.id);
          if (!pos) return null;

          const color = getCompColor(comp.type);
          const isActive = activeComponentId === comp.id || hoveredId === comp.id;

          return (
            <g
              key={comp.id}
              onClick={() => onComponentClick?.(comp.id)}
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect
                x={pos.x}
                y={pos.y}
                width={COMP_WIDTH}
                height={COMP_HEIGHT}
                rx={8}
                className={color.bg}
                stroke={isActive ? "#22d3ee" : color.border}
                strokeWidth={isActive ? 2.5 : 1.5}
              />

              {/* Glow on active */}
              {isActive && (
                <rect
                  x={pos.x - 2}
                  y={pos.y - 2}
                  width={COMP_WIDTH + 4}
                  height={COMP_HEIGHT + 4}
                  rx={10}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  className="animate-pulse"
                />
              )}

              {/* Icon + Name */}
              <text x={pos.x + 10} y={pos.y + 24} className="text-[16px]">
                {color.icon}
              </text>
              <text
                x={pos.x + 36}
                y={pos.y + 26}
                className={`font-mono text-xs font-bold ${color.text}`}
              >
                {comp.name.length > 18 ? comp.name.substring(0, 16) + ".." : comp.name}
              </text>

              {/* Description */}
              <text
                x={pos.x + 10}
                y={pos.y + 50}
                className="fill-slate-400 font-mono text-[8px]"
              >
                {comp.description.length > 35
                  ? comp.description.substring(0, 33) + ".."
                  : comp.description}
              </text>

              {/* Type badge */}
              <rect
                x={pos.x + COMP_WIDTH - 60}
                y={pos.y + 60}
                width={52}
                height={14}
                rx={4}
                className={isActive ? "fill-cyan-500/20 stroke-cyan-500/30" : "fill-slate-800/50 stroke-slate-700/50"}
                strokeWidth={0.5}
              />
              <text
                x={pos.x + COMP_WIDTH - 34}
                y={pos.y + 70}
                textAnchor="middle"
                className={`font-mono text-[7px] font-bold ${color.text}`}
              >
                {comp.type}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-3 px-1 py-2 border-t border-slate-800/60">
        <span className="text-[10px] font-bold text-slate-500 font-mono">Legend:</span>
        {Object.entries({
          client: "Client",
          "load-balancer": "LB",
          "web-server": "Server",
          cache: "Cache",
          database: "DB",
          "message-queue": "Queue",
          worker: "Worker",
          "object-storage": "Storage",
        }).map(([type, label]) => {
          const color = HLD_COMPONENT_COLORS[type as keyof typeof HLD_COMPONENT_COLORS];
          if (!color) return null;
          return (
            <div key={type} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded ${color.bg} border ${color.border}`} />
              <span className="text-[9px] text-slate-400 font-mono">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
