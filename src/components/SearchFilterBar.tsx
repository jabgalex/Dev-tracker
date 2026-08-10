"use client";

import React from "react";
import { Search, Filter, Bot, Cpu, Layers } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedAgent: string;
  onAgentChange: (agent: string) => void;
  selectedTech: string;
  onTechChange: (tech: string) => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedAgent,
  onAgentChange,
  selectedTech,
  onTechChange,
}: SearchFilterBarProps) {
  return (
    <div className="glass-panel rounded-xl p-4 mb-6 space-y-3 md:space-y-0 md:flex md:items-center md:gap-4 justify-between border border-slate-800">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar proyectos, notas de 'dónde quedé', stack..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg glass-input text-xs bg-slate-900 text-slate-200"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="ACTIVE">🟢 Activo</option>
            <option value="PAUSED">🟡 En Pausa</option>
            <option value="IN_PRODUCTION">🚀 En Producción</option>
            <option value="IDEA">💡 Ideas</option>
            <option value="ARCHIVED">📦 Archivados</option>
          </select>
        </div>

        {/* AI Agent Filter */}
        <div className="flex items-center gap-1">
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedAgent}
            onChange={(e) => onAgentChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg glass-input text-xs bg-slate-900 text-slate-200"
          >
            <option value="ALL">Todos los Agentes IA</option>
            <option value="Hermes">Hermes</option>
            <option value="Antigravity">Antigravity</option>
            <option value="Codex">Codex</option>
            <option value="Open Code">Open Code</option>
          </select>
        </div>

        {/* Tech Stack Filter */}
        <div className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedTech}
            onChange={(e) => onTechChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg glass-input text-xs bg-slate-900 text-slate-200"
          >
            <option value="ALL">Todo el Stack</option>
            <option value="Supabase">Supabase</option>
            <option value="Vercel">Vercel</option>
            <option value="VPS">VPS</option>
            <option value="Next.js">Next.js</option>
            <option value="Docker">Docker</option>
            <option value="Python">Python</option>
          </select>
        </div>
      </div>
    </div>
  );
}
