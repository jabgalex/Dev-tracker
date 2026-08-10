import React from "react";
import { FolderGit2, PlayCircle, PauseCircle, Rocket, Bot } from "lucide-react";
import { ProjectData } from "./ProjectCard";

export function StatsOverview({ projects }: { projects: ProjectData[] }) {
  const total = projects.length;
  const active = projects.filter((p) => p.status === "ACTIVE").length;
  const paused = projects.filter((p) => p.status === "PAUSED").length;
  const prod = projects.filter((p) => p.status === "IN_PRODUCTION").length;

  // Find most used AI Agent
  const agentCounts: Record<string, number> = {};
  projects.forEach((p) => {
    p.aiAgents?.forEach((agent) => {
      agentCounts[agent] = (agentCounts[agent] || 0) + 1;
    });
  });
  const topAgent = Object.entries(agentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Hermes / Antigravity";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Projects */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-100 font-mono">{total}</div>
          <div className="text-xs text-slate-400 font-medium">Proyectos Totales</div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <PlayCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{active}</div>
          <div className="text-xs text-slate-400 font-medium">En Desarrollo Activo</div>
        </div>
      </div>

      {/* In Production */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Rocket className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-cyan-300 font-mono">{prod}</div>
          <div className="text-xs text-slate-400 font-medium">En Producción</div>
        </div>
      </div>

      {/* Paused Projects */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <PauseCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-amber-400 font-mono">{paused}</div>
          <div className="text-xs text-slate-400 font-medium">En Pausa (Reanudables)</div>
        </div>
      </div>
    </div>
  );
}
