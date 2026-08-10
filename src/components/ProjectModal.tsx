"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Bot, Terminal, Globe, Database, Server, Cloud, Folder, GitBranch } from "lucide-react";
import { ProjectData } from "./ProjectCard";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<ProjectData>) => Promise<void>;
  initialData?: ProjectData | null;
}

const COMMON_AI_AGENTS = ["Antigravity", "Hermes", "Codex", "Open Code", "Claude", "ChatGPT"];
const COMMON_TECH_STACK = ["Next.js", "React", "Supabase", "Vercel", "VPS", "TailwindCSS", "Node.js", "Python", "Docker", "TypeScript", "SQLite", "Prisma"];

export function ProjectModal({ isOpen, onClose, onSave, initialData }: ProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [whereILeftOff, setWhereILeftOff] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [localPort, setLocalPort] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [vercelUrl, setVercelUrl] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [vpsIpOrHost, setVpsIpOrHost] = useState("");
  const [prodUrl, setProdUrl] = useState("");
  const [aiAgents, setAiAgents] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  const [customAgentInput, setCustomAgentInput] = useState("");
  const [customTechInput, setCustomTechInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "ACTIVE");
      setWhereILeftOff(initialData.whereILeftOff || "");
      setLocalPath(initialData.localPath || "");
      setLocalPort(initialData.localPort ? String(initialData.localPort) : "");
      setGithubUrl(initialData.githubUrl || "");
      setVercelUrl(initialData.vercelUrl || "");
      setSupabaseUrl(initialData.supabaseUrl || "");
      setVpsIpOrHost(initialData.vpsIpOrHost || "");
      setProdUrl(initialData.prodUrl || "");
      setAiAgents(initialData.aiAgents || []);
      setTechStack(initialData.techStack || []);
    } else {
      setName("");
      setDescription("");
      setStatus("ACTIVE");
      setWhereILeftOff("");
      setLocalPath("");
      setLocalPort("");
      setGithubUrl("");
      setVercelUrl("");
      setSupabaseUrl("");
      setVpsIpOrHost("");
      setProdUrl("");
      setAiAgents(["Antigravity"]);
      setTechStack(["Next.js", "TailwindCSS"]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleAgent = (agent: string) => {
    if (aiAgents.includes(agent)) {
      setAiAgents(aiAgents.filter((a) => a !== agent));
    } else {
      setAiAgents([...aiAgents, agent]);
    }
  };

  const addCustomAgent = () => {
    if (customAgentInput.trim() && !aiAgents.includes(customAgentInput.trim())) {
      setAiAgents([...aiAgents, customAgentInput.trim()]);
      setCustomAgentInput("");
    }
  };

  const toggleTech = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const addCustomTech = () => {
    if (customTechInput.trim() && !techStack.includes(customTechInput.trim())) {
      setTechStack([...techStack, customTechInput.trim()]);
      setCustomTechInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSave({
        id: initialData?.id,
        name,
        description,
        status,
        whereILeftOff,
        localPath,
        localPort: localPort ? parseInt(localPort) : null,
        githubUrl,
        vercelUrl,
        supabaseUrl,
        vpsIpOrHost,
        prodUrl,
        aiAgents,
        techStack,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-400" />
            {initialData ? "Editar Proyecto" : "Nuevo Proyecto Personal"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Project Name & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                required
                placeholder="ej. Project Dev Tracker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Estado Actual
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-sm bg-slate-900 text-slate-200"
              >
                <option value="ACTIVE">🟢 Activo (En Desarrollo)</option>
                <option value="PAUSED">🟡 En Pausa</option>
                <option value="IN_PRODUCTION">🚀 En Producción</option>
                <option value="IDEA">💡 Idea / Planificación</option>
                <option value="ARCHIVED">📦 Archivado</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Descripción Breve
            </label>
            <input
              type="text"
              placeholder="¿Qué hace este proyecto o cuál es su objetivo?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg glass-input text-sm"
            />
          </div>

          {/* HERO FIELD: ¿Dónde me quedé? */}
          <div className="p-4 bg-slate-900/90 border border-indigo-500/30 rounded-xl">
            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              ¿Dónde te quedaste? (Resumen de la última sesión)
            </label>
            <textarea
              rows={3}
              placeholder="ej. Dejé configurados los endpoints de Supabase. Falta probar el webhook de Stripe y corregir la vista del dashboard..."
              value={whereILeftOff}
              onChange={(e) => setWhereILeftOff(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg glass-input text-sm resize-none focus:border-indigo-400"
            />
          </div>

          {/* AI AGENTS SELECTOR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              Agente(s) de IA Utilizado(s)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_AI_AGENTS.map((agent) => {
                const selected = aiAgents.includes(agent);
                return (
                  <button
                    key={agent}
                    type="button"
                    onClick={() => toggleAgent(agent)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selected
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {agent}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Otro agente de IA..."
                value={customAgentInput}
                onChange={(e) => setCustomAgentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomAgent();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs"
              />
              <button
                type="button"
                onClick={addCustomAgent}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* TECH STACK SELECTOR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Stack & Infraestructura
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_TECH_STACK.map((tech) => {
                const selected = techStack.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                      selected
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {tech}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Otra tecnología o servicio..."
                value={customTechInput}
                onChange={(e) => setCustomTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTech();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs font-mono"
              />
              <button
                type="button"
                onClick={addCustomTech}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* LOCAL MAC PATH & PORT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Ruta Local en Mac
              </label>
              <input
                type="text"
                placeholder="/Users/pc/Documents/Proyecto..."
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Puerto Local (ej. 3000)
              </label>
              <input
                type="number"
                placeholder="3000"
                value={localPort}
                onChange={(e) => setLocalPort(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs font-mono"
              />
            </div>
          </div>

          {/* INFRASTRUCTURE LINKS */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Enlaces de Infraestructura & Cloud
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <GitBranch className="w-3 h-3" /> GitHub Repo URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <Cloud className="w-3 h-3" /> Vercel Dashboard URL
                </label>
                <input
                  type="url"
                  placeholder="https://vercel.com/..."
                  value={vercelUrl}
                  onChange={(e) => setVercelUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <Database className="w-3 h-3 text-emerald-400" /> Supabase Dashboard URL
                </label>
                <input
                  type="url"
                  placeholder="https://supabase.com/dashboard/..."
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <Server className="w-3 h-3 text-orange-400" /> VPS Host / IP / Info
                </label>
                <input
                  type="text"
                  placeholder="vps-ubuntu (195.201.X.X)"
                  value={vpsIpOrHost}
                  onChange={(e) => setVpsIpOrHost(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Globe className="w-3 h-3 text-cyan-400" /> URL de Producción Web
              </label>
              <input
                type="url"
                placeholder="https://miapp.com"
                value={prodUrl}
                onChange={(e) => setProdUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              {loading ? "Guardando..." : initialData ? "Actualizar Proyecto" : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
