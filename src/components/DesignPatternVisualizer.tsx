import React, { useMemo } from "react";
import { DesignPattern, ClassParticipant } from "../types";
import { RELATION_ARROW_STYLES } from "../data/systemDesignColors";

interface DesignPatternVisualizerProps {
  pattern: DesignPattern;
  activeParticipantId?: string;
}

const PARTICIPANT_WIDTH = 200;
const PARTICIPANT_HEIGHT = 120;
const H_GAP = 80;
const V_GAP = 40;
const PADDING = 40;

export const DesignPatternVisualizer: React.FC<DesignPatternVisualizerProps> = ({
  pattern,
  activeParticipantId,
}) => {
  const { participants, structure } = pattern;

  const layout = useMemo(() => {
    if (participants.length === 0) return { participantPositions: new Map<string, { x: number; y: number }>(), svgWidth: 400, svgHeight: 200 };

    const cols = Math.min(participants.length, 3);
    const rows = Math.ceil(participants.length / cols);
    const svgWidth = cols * (PARTICIPANT_WIDTH + H_GAP) + PADDING;
    const svgHeight = rows * (PARTICIPANT_HEIGHT + V_GAP) + PADDING + 40;

    const positions = new Map<string, { x: number; y: number }>();
    participants.forEach((p, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      positions.set(p.id, {
        x: PADDING / 2 + col * (PARTICIPANT_WIDTH + H_GAP),
        y: PADDING / 2 + row * (PARTICIPANT_HEIGHT + V_GAP) + 40,
      });
    });

    return { participantPositions: positions, svgWidth: Math.max(svgWidth, 500), svgHeight: Math.max(svgHeight, 300) };
  }, [participants]);

  const getStereotype = (p: ClassParticipant): string => {
    if (p.type === "interface") return "<<interface>>";
    if (p.type === "abstract-class") return "<<abstract>>";
    return "";
  };

  const getParticipantStyle = (p: ClassParticipant) => {
    const isActive = activeParticipantId === p.id;
    const base = p.type === "interface"
      ? "fill-emerald-950/30 stroke-emerald-500/40"
      : p.type === "abstract-class"
        ? "fill-amber-950/30 stroke-amber-500/40"
        : "fill-slate-800/60 stroke-slate-600/50";
    const activeStyle = isActive
      ? "stroke-cyan-400 stroke-[2.5] shadow-[0_0_15px_rgba(34,211,238,0.3)]"
      : "";
    return `${base} ${activeStyle}`;
  };

  const renderArrowMarker = (type: string, id: string) => {
    const style = RELATION_ARROW_STYLES[type];
    if (!style) return null;
    return (
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        {type === "inheritance" || type === "implementation" ? (
          <polygon points="0,0 10,5 0,10" fill="none" stroke={style.stroke} strokeWidth="1.5" />
        ) : type === "composition" ? (
          <polygon points="0,0 10,5 0,10" fill={style.stroke} stroke={style.stroke} strokeWidth="1.5" />
        ) : type === "aggregation" ? (
          <polygon points="0,0 10,5 0,10" fill="none" stroke={style.stroke} strokeWidth="1.5" />
        ) : (
          <polygon points="0,0 10,5 0,10" fill={style.stroke} stroke={style.stroke} strokeWidth="1.5" />
        )}
      </marker>
    );
  };

  return (
    <div className="w-full overflow-x-auto bg-[#020617] rounded-xl border border-slate-800/80 p-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2 ml-1">
        Class Diagram — {pattern.name}
      </div>
      <svg
        viewBox={`0 0 ${layout.svgWidth} ${layout.svgHeight}`}
        className="w-full h-auto min-h-[250px]"
        style={{ maxHeight: "500px" }}
      >
        <defs>
          {["inheritance", "implementation", "composition", "aggregation", "dependency", "association"].map(type =>
            renderArrowMarker(type, `arrow-${type}`)
          )}
        </defs>

        {/* Draw relationship lines */}
        {structure.map((rel, idx) => {
          const fromPos = layout.participantPositions.get(rel.from);
          const toPos = layout.participantPositions.get(rel.to);
          if (!fromPos || !toPos) return null;

          const fromX = fromPos.x + PARTICIPANT_WIDTH / 2;
          const fromY = fromPos.y + PARTICIPANT_HEIGHT;
          const toX = toPos.x + PARTICIPANT_WIDTH / 2;
          const toY = toPos.y;

          const style = RELATION_ARROW_STYLES[rel.type] || RELATION_ARROW_STYLES.dependency;
          const isActive = activeParticipantId === rel.from || activeParticipantId === rel.to;

          return (
            <g key={`rel-${idx}`}>
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={isActive ? "#22d3ee" : style.stroke}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={style.dash}
                markerEnd={style.markerEnd}
                className="transition-all duration-300"
              />
              {rel.toLabel && (
                <text
                  x={(fromX + toX) / 2 + 10}
                  y={(fromY + toY) / 2 - 5}
                  className="fill-slate-400 font-mono text-[9px]"
                >
                  {rel.toLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Draw participant boxes */}
        {participants.map((p) => {
          const pos = layout.participantPositions.get(p.id);
          if (!pos) return null;

          const isActive = activeParticipantId === p.id;

          return (
            <g key={p.id} className="transition-all duration-300">
              {/* Box background */}
              <rect
                x={pos.x}
                y={pos.y}
                width={PARTICIPANT_WIDTH}
                height={PARTICIPANT_HEIGHT}
                rx={8}
                className={getParticipantStyle(p)}
                strokeWidth={isActive ? 2.5 : 1.5}
              />

              {/* StereoType label */}
              {getStereotype(p) && (
                <text
                  x={pos.x + PARTICIPANT_WIDTH / 2}
                  y={pos.y + 22}
                  textAnchor="middle"
                  className="fill-slate-400 italic text-[9px] font-mono"
                >
                  {getStereotype(p)}
                </text>
              )}

              {/* Class name */}
              <text
                x={pos.x + PARTICIPANT_WIDTH / 2}
                y={pos.y + (getStereotype(p) ? 38 : 28)}
                textAnchor="middle"
                className={`font-mono text-xs font-bold ${
                  isActive ? "fill-cyan-300" : "fill-slate-100"
                }`}
              >
                {p.name}
              </text>

              {/* Separator line */}
              <line
                x1={pos.x + 4}
                y1={pos.y + (getStereotype(p) ? 45 : 35)}
                x2={pos.x + PARTICIPANT_WIDTH - 4}
                y2={pos.y + (getStereotype(p) ? 45 : 35)}
                stroke="#334155"
                strokeWidth={1}
              />

              {/* Fields */}
              {p.fields.slice(0, 2).map((field, fi) => (
                <text
                  key={`f-${fi}`}
                  x={pos.x + 8}
                  y={pos.y + (getStereotype(p) ? 58 : 48) + fi * 16}
                  className="fill-slate-400 font-mono text-[9px]"
                >
                  {field.length > 22 ? field.substring(0, 20) + ".." : field}
                </text>
              ))}

              {/* Methods separator */}
              {p.methods.length > 0 && (
                <line
                  x1={pos.x + 4}
                  y1={pos.y + (getStereotype(p) ? 58 : 48) + Math.min(p.fields.length, 2) * 16 + 4}
                  x2={pos.x + PARTICIPANT_WIDTH - 4}
                  y2={pos.y + (getStereotype(p) ? 58 : 48) + Math.min(p.fields.length, 2) * 16 + 4}
                  stroke="#334155"
                  strokeWidth={1}
                />
              )}

              {/* Methods */}
              {p.methods.slice(0, 2).map((method, mi) => (
                <text
                  key={`m-${mi}`}
                  x={pos.x + 8}
                  y={pos.y + (getStereotype(p) ? 68 : 58) + Math.min(p.fields.length, 2) * 14 + mi * 16}
                  className={`font-mono text-[9px] ${
                    isActive ? "fill-cyan-400" : "fill-slate-300"
                  }`}
                >
                  + {method.length > 22 ? method.substring(0, 20) + ".." : method}
                </text>
              ))}

              {/* Overflow indicator */}
              {(p.fields.length > 2 || p.methods.length > 2) && (
                <text
                  x={pos.x + PARTICIPANT_WIDTH - 8}
                  y={pos.y + PARTICIPANT_HEIGHT - 6}
                  textAnchor="end"
                  className="fill-slate-500 font-mono text-[8px]"
                >
                  ...
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 px-1 py-2 border-t border-slate-800/60">
        <span className="text-[10px] font-bold text-slate-500 font-mono">Legend:</span>
        {Object.entries({
          inheritance: "Inheritance",
          composition: "Composition",
          aggregation: "Aggregation",
          dependency: "Dependency",
        }).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <svg width="24" height="12" className="overflow-visible">
              <line
                x1="0" y1="6" x2="18" y2="6"
                stroke={RELATION_ARROW_STYLES[type]?.stroke || "#94a3b8"}
                strokeWidth="1.5"
                strokeDasharray={RELATION_ARROW_STYLES[type]?.dash || ""}
              />
            </svg>
            <span className="text-[10px] text-slate-400 font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
