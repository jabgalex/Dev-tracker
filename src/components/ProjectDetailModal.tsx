"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Circle,
  Plus,
  Terminal,
  FolderOpen,
  Play,
  GitBranch,
  Cloud,
  Database,
  Server,
  ExternalLink,
  History,
  Bot,
  Edit3,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { ProjectData } from "./ProjectCard";
import { AiAgentBadge, TechBadge, StatusBadge } from "./Badges";

interface ProjectDetailModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onEdit: (project: ProjectData) => void;
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onRefresh,
  onEdit,
}: ProjectDetailModalProps) {
  const [newWhereILeftOff, setNewWhereILeftOff] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Antigravity");
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen || !project) return null;

  const handleSaveWhereILeftOff = async () => {
    if (!newWhereILeftOff.trim()) return;
    setIsUpdatingSession(true);
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whereILeftOff: newWhereILeftOff,
          aiAgents: Array.from(new Set([...project.aiAgents, selectedAgent])),
        }),
      });
      setNewWhereILeftOff("");
      onRefresh();
    } catch (err) {
      console.error("Error updating session log:", err);
    } finally {
      setIsUpdatingSession(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await fetch(`/api/projects/${project.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      setNewTaskTitle("");
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/projects/${project.id}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: !currentStatus }),
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/projects/${project.id}/tasks?taskId=${taskId}`, {
        method: "DELETE",
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCdCommand = () => {
    if (project.localPath) {
      navigator.clipboard.writeText(`cd "${project.localPath}"`);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <h2 className="text-xl font-bold text-slate-100">{project.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(project);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Top Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-300 mb-3">{project.description || "Sin descripción."}</p>

              <div className="space-y-2">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-slate-500 text-[10px]">
                    Agentes IA:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.aiAgents?.map((a, i) => (
                      <AiAgentBadge key={i} name={a} />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-slate-500 text-[10px]">
                    Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack?.map((t, i) => (
                      <TechBadge key={i} name={t} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Acciones Rápidas de macOS
              </span>

              {project.localPath && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      fetch("/api/system/open-ide", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: project.localPath, editor: "vscode" }),
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Terminal className="w-4 h-4 text-indigo-400" /> Abrir en VS Code
                  </button>

                  <button
                    onClick={() =>
                      fetch("/api/system/open-finder", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: project.localPath }),
                      })
                    }
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5"
                  >
                    <FolderOpen className="w-4 h-4 text-slate-400" /> Finder
                  </button>

                  <button
                    onClick={handleCopyCdCommand}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1"
                  >
                    {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    cd
                  </button>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-2 text-xs pt-1">
                {project.localPort && (
                  <a
                    href={`http://localhost:${project.localPort}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-sky-950/60 text-sky-400 border border-sky-800/50 font-mono flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-sky-400" /> localhost:{project.localPort}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                  >
                    <GitBranch className="w-3 h-3" /> GitHub
                  </a>
                )}
                {project.vercelUrl && (
                  <a
                    href={project.vercelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                  >
                    <Cloud className="w-3 h-3" /> Vercel
                  </a>
                )}
                {project.supabaseUrl && (
                  <a
                    href={project.supabaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1"
                  >
                    <Database className="w-3 h-3 text-emerald-400" /> Supabase
                  </a>
                )}
                {project.vpsIpOrHost && (
                  <span className="px-2.5 py-1 rounded bg-orange-950/60 text-orange-300 border border-orange-800/50 font-mono flex items-center gap-1">
                    <Server className="w-3 h-3" /> VPS: {project.vpsIpOrHost}
                  </span>
                )}
                {project.prodUrl && (
                  <a
                    href={project.prodUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Web Producción
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* MAIN BLOCK: ¿Dónde me quedé? */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                ¿Dónde me quedé exactamente? (Estado de la Sesión)
              </h3>
            </div>

            <p className="text-sm text-slate-100 leading-relaxed font-medium bg-slate-950/70 p-4 rounded-lg border border-slate-800/80 mb-4 whitespace-pre-wrap">
              {project.whereILeftOff || "Sin resumen de sesión guardado aún."}
            </p>

            {/* Quick Session Update Form */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400">
                Registrar nuevo avance / "¿Dónde quedé?"
              </label>
              <textarea
                rows={2}
                placeholder="Escribe un breve resumen de lo que hiciste hoy y qué falta por hacer..."
                value={newWhereILeftOff}
                onChange={(e) => setNewWhereILeftOff(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs resize-none"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Agente Usado:</span>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="px-2.5 py-1 rounded-md glass-input text-xs bg-slate-900 text-slate-200"
                  >
                    <option value="Antigravity">Antigravity</option>
                    <option value="Hermes">Hermes</option>
                    <option value="Codex">Codex</option>
                    <option value="Open Code">Open Code</option>
                    <option value="Claude">Claude</option>
                    <option value="Humano">Desarrollo Manual</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveWhereILeftOff}
                  disabled={isUpdatingSession || !newWhereILeftOff.trim()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <History className="w-3.5 h-3.5" /> Actualizar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Siguientes Pasos (Tasks Checklist) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Checklist / Siguientes Pasos Pendientes
            </h3>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Añadir nueva tarea o siguiente paso..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-lg glass-input text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Añadir
              </button>
            </form>

            {/* Task List */}
            <div className="space-y-2">
              {project.tasks && project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <button
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className="flex items-center gap-2.5 text-xs text-left font-medium text-slate-200 flex-1 min-w-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={task.completed ? "line-through text-slate-500" : ""}>
                        {task.title}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-2 text-center">
                  No hay tareas agregadas a este proyecto aún.
                </p>
              )}
            </div>
          </div>

          {/* Historial de Sesiones (Cronología / Timeline) */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Cronología de Actualizaciones
              {project.logs && project.logs.length > 0 && (
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 ml-1">
                  {project.logs.length} sesión{project.logs.length > 1 ? "es" : ""}
                </span>
              )}
            </h3>

            {project.logs && project.logs.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-5 ml-2">
                {project.logs.map((log, idx) => {
                  const logDate = new Date(log.createdAt);
                  const isToday = new Date().toDateString() === logDate.toDateString();
                  const dateStr = isToday
                    ? `Hoy ${logDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
                    : logDate.toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                  return (
                    <div key={log.id} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        idx === 0
                          ? "bg-indigo-500 shadow-lg shadow-indigo-500/40"
                          : "bg-slate-700"
                      }`} />
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                            {dateStr}
                          </span>
                          {log.aiAgentUsed && (
                            <AiAgentBadge name={log.aiAgentUsed} />
                          )}
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed">{log.summary}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-500">
                  Sin registros de sesiones aún. Actualiza "¿Dónde me quedé?" para generar la primera entrada.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
