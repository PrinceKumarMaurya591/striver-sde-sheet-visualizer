import { HldComponentType } from "../types";

export const HLD_COMPONENT_COLORS: Record<HldComponentType, { bg: string; border: string; text: string; icon: string }> = {
  client:         { bg: "bg-indigo-950/60",  border: "border-indigo-500/50",  text: "text-indigo-300",  icon: "🖥️" },
  dns:            { bg: "bg-violet-950/60",  border: "border-violet-500/50",  text: "text-violet-300",  icon: "🌐" },
  cdn:            { bg: "bg-fuchsia-950/60", border: "border-fuchsia-500/50", text: "text-fuchsia-300", icon: "📡" },
  "load-balancer":{ bg: "bg-amber-950/60",  border: "border-amber-500/50",   text: "text-amber-300",  icon: "⚖️" },
  "api-gateway":  { bg: "bg-emerald-950/60", border: "border-emerald-500/50", text: "text-emerald-300", icon: "🚪" },
  "web-server":   { bg: "bg-blue-950/60",   border: "border-blue-500/50",    text: "text-blue-300",   icon: "🌍" },
  microservice:   { bg: "bg-cyan-950/60",   border: "border-cyan-500/50",    text: "text-cyan-300",   icon: "⚙️" },
  cache:          { bg: "bg-red-950/60",    border: "border-red-500/50",     text: "text-red-300",    icon: "⚡" },
  database:       { bg: "bg-purple-950/60", border: "border-purple-500/50",  text: "text-purple-300", icon: "🗄️" },
  "message-queue":{ bg: "bg-orange-950/60", border: "border-orange-500/50",  text: "text-orange-300", icon: "📨" },
  worker:         { bg: "bg-lime-950/60",   border: "border-lime-500/50",    text: "text-lime-300",   icon: "🔧" },
  "object-storage":{ bg: "bg-teal-950/60",  border: "border-teal-500/50",    text: "text-teal-300",   icon: "💾" },
  "search-service":{ bg: "bg-pink-950/60",  border: "border-pink-500/50",    text: "text-pink-300",   icon: "🔍" },
};

export const RELATION_ARROW_STYLES: Record<string, { stroke: string; dash: string; markerEnd: string }> = {
  inheritance:     { stroke: "#22d3ee", dash: "",              markerEnd: "url(#arrow-inheritance)" },
  implementation:  { stroke: "#22d3ee", dash: "6,3",           markerEnd: "url(#arrow-inheritance)" },
  composition:     { stroke: "#f59e0b", dash: "",              markerEnd: "url(#arrow-composition)" },
  aggregation:     { stroke: "#a78bfa", dash: "",              markerEnd: "url(#arrow-aggregation)" },
  dependency:      { stroke: "#94a3b8", dash: "4,4",           markerEnd: "url(#arrow-dependency)" },
  association:     { stroke: "#64748b", dash: "",              markerEnd: "url(#arrow-association)" },
};
