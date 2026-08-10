"use client";

import React, { useState } from "react";
import { AiAgentBadge, TechBadge, StatusBadge } from "./Badges";
import {
  FolderOpen,
  Terminal,
  ExternalLink,
  GitBranch,
  Cloud,
  Database,
  Server,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  Play,
  Copy,
  Check,
  History,
} from "lucide-react";

export interface ProjectData {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  whereILeftOff?: string | null;
  lastSessionDate: string | Date;
  localPath?: string | null;
  localPort?: number | null;
  githubUrl?: string | null;
  vercelUrl?: string | null;
  supabaseUrl?: string | null;
  vpsIpOrHost?: string | null;
  prodUrl?: string | null;
  aiAgents: string[];
  techStack: string[];
  tasks?: Array<{ id: string; title: string; completed: boolean; priority: string }>;
  logs?: Array<{ id: string; summary: string; aiAgentUsed?: string | null; createdAt: string }>;
}

interface ProjectCardProps {
  project: ProjectData;
  onEdit: (project: ProjectData) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (project: ProjectData) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onOpenDetails }: ProjectCardProps) {
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const completedTasks = project.tasks?.filter((t) => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const sessionCount = project.logs?.length || 0;
  const lastLogDate = project.logs && project.logs.length > 0 ? project.logs[0].createdAt : null;

  const formatDate = (dateString: string | Date) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Reciente";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Hace un momento";
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 30) return `Hace ${diffDays} días`;
    return d.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  };

  const handleOpenIDE = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project.localPath) return;
    setActionLoading("ide");
    try {
      await fetch("/api/system/open-ide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: project.localPath, editor: "vscode" }),
      });
    } catch (err) {
      console.error("Failed to open IDE:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenFinder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project.localPath) return;
    setActionLoading("finder");
    try {
      await fetch("/api/system/open-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: project.localPath }),
      });
    } catch (err) {
      console.error("Failed to open Finder:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.localPath) {
      navigator.clipboard.writeText(project.localPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(project)}
      className="glass-card rounded-xl p-5 flex flex-col justify-between cursor-pointer group hover:shadow-2xl transition-all relative overflow-hidden"
    >
      {/* Top row: Status & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <StatusBadge status={project.status} />
              {sessionCount > 0 && (
                <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20" title={`${sessionCount} sesiones registradas`}>
                  <History className="w-3 h-3" />
                  {sessionCount} sesión{sessionCount > 1 ? "es" : ""}
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {lastLogDate ? formatDate(lastLogDate) : formatDate(project.lastSessionDate)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
              {project.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              title="Editar Proyecto"
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`¿Eliminar el proyecto "${project.name}"?`)) onDelete(project.id);
              }}
              title="Eliminar Proyecto"
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Description */}
        {project.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* "WHERE I LEFT OFF" / DÓNDE ME QUEDÉ (HERO SECTION) */}
        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-lg p-3.5 mb-4 relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              ¿Dónde me quedé?
            </span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-normal line-clamp-3 italic">
            "{project.whereILeftOff || "Sin resumen de sesión registrado aún."}"
          </p>
        </div>

        {/* AI AGENTS BADGES */}
        {project.aiAgents && project.aiAgents.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1.5">
              Agente(s) IA
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.aiAgents.map((agent, idx) => (
                <AiAgentBadge key={idx} name={agent} />
              ))}
            </div>
          </div>
        )}

        {/* TECH STACK BADGES */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1.5">
              Stack & Infraestructura
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <TechBadge key={idx} name={tech} />
              ))}
            </div>
          </div>
        )}

        {/* TASKS PROGRESS */}
        {totalTasks > 0 && (
          <div className="mb-4 bg-slate-950/40 border border-slate-800/80 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Siguientes Pasos
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {completedTasks}/{totalTasks} ({taskProgress}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: Mac Actions & Quick Links */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        {/* Mac Local Actions Bar */}
        {project.localPath && (
          <div className="flex items-center justify-between gap-1.5">
            <button
              onClick={handleOpenIDE}
              disabled={actionLoading === "ide"}
              title={`Abrir ${project.localPath} en VS Code`}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              {actionLoading === "ide" ? "Abriendo..." : "Abrir en Editor"}
            </button>

            <button
              onClick={handleOpenFinder}
              disabled={actionLoading === "finder"}
              title="Abrir en macOS Finder"
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-all"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
              Finder
            </button>

            <button
              onClick={handleCopyPath}
              title="Copiar Ruta en Mac"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Quick Links (GitHub, Supabase, Vercel, Localport, Prod) */}
        <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
          {project.localPort && (
            <a
              href={`http://localhost:${project.localPort}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono text-[11px] bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40"
            >
              <Play className="w-3 h-3 text-sky-400 fill-sky-400" />
              :{project.localPort}
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Ver en GitHub"
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
            >
              <GitBranch className="w-3.5 h-3.5" />
            </a>
          )}

          {project.vercelUrl && (
            <a
              href={project.vercelUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Ver Dashboard Vercel"
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
            >
              <Cloud className="w-3.5 h-3.5" />
            </a>
          )}

          {project.supabaseUrl && (
            <a
              href={project.supabaseUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Ver Dashboard Supabase"
              className="text-emerald-400 hover:text-emerald-300 p-1 rounded hover:bg-emerald-950/40"
            >
              <Database className="w-3.5 h-3.5" />
            </a>
          )}

          {project.vpsIpOrHost && (
            <span
              title={`VPS: ${project.vpsIpOrHost}`}
              className="text-orange-400 font-mono text-[11px] flex items-center gap-1 bg-orange-950/30 px-1.5 py-0.5 rounded border border-orange-900/40"
            >
              <Server className="w-3 h-3" />
              VPS
            </span>
          )}

          {project.prodUrl && (
            <a
              href={project.prodUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Abrir URL de Producción"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-auto font-medium text-[11px]"
            >
              <ExternalLink className="w-3 h-3" />
              Prod Web
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
