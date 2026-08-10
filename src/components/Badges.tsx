import React from "react";
import { Bot, Cpu, Server, Globe, Database, Terminal, Code2, Cloud } from "lucide-react";

export function AiAgentBadge({ name }: { name: string }) {
  const normalized = name.toLowerCase();

  let colorClasses = "bg-slate-800/80 text-slate-300 border-slate-700";
  let icon = <Bot className="w-3.5 h-3.5 mr-1" />;

  if (normalized.includes("hermes")) {
    colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    icon = <Cpu className="w-3.5 h-3.5 mr-1 text-amber-400" />;
  } else if (normalized.includes("antigravity")) {
    colorClasses = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-sm shadow-cyan-500/10";
    icon = <Bot className="w-3.5 h-3.5 mr-1 text-cyan-400" />;
  } else if (normalized.includes("codex")) {
    colorClasses = "bg-purple-500/10 text-purple-300 border-purple-500/30";
    icon = <Code2 className="w-3.5 h-3.5 mr-1 text-purple-300" />;
  } else if (normalized.includes("open code") || normalized.includes("opencode")) {
    colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    icon = <Terminal className="w-3.5 h-3.5 mr-1 text-emerald-400" />;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorClasses}`}>
      {icon}
      {name}
    </span>
  );
}

export function TechBadge({ name }: { name: string }) {
  const normalized = name.toLowerCase();

  let colorClasses = "bg-slate-800 text-slate-300 border-slate-700/80";
  let icon = null;

  if (normalized.includes("supabase")) {
    colorClasses = "bg-emerald-950/60 text-emerald-300 border-emerald-800/50";
    icon = <Database className="w-3 h-3 mr-1 text-emerald-400" />;
  } else if (normalized.includes("vercel")) {
    colorClasses = "bg-slate-900 text-slate-100 border-slate-700";
    icon = <Cloud className="w-3 h-3 mr-1 text-slate-200" />;
  } else if (normalized.includes("vps")) {
    colorClasses = "bg-orange-950/60 text-orange-300 border-orange-800/50";
    icon = <Server className="w-3 h-3 mr-1 text-orange-400" />;
  } else if (normalized.includes("next")) {
    colorClasses = "bg-slate-900 text-indigo-300 border-indigo-900/60";
    icon = <Globe className="w-3 h-3 mr-1 text-indigo-400" />;
  } else if (normalized.includes("docker")) {
    colorClasses = "bg-sky-950/60 text-sky-300 border-sky-800/50";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${colorClasses}`}>
      {icon}
      {name}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  let badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
  let label = status;

  switch (status) {
    case "ACTIVE":
      badgeStyle = "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10";
      label = "🟢 En Desarrollo Activo";
      break;
    case "PAUSED":
      badgeStyle = "bg-amber-500/15 text-amber-400 border-amber-500/40";
      label = "🟡 En Pausa";
      break;
    case "IN_PRODUCTION":
      badgeStyle = "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10";
      label = "🚀 En Producción";
      break;
    case "IDEA":
      badgeStyle = "bg-purple-500/15 text-purple-300 border-purple-500/40";
      label = "💡 Idea / Planificación";
      break;
    case "ARCHIVED":
      badgeStyle = "bg-slate-800 text-slate-400 border-slate-700";
      label = "📦 Archivado";
      break;
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      {label}
    </span>
  );
}
