"use client";

import React, { useState, useEffect } from "react";
import { Plus, Sparkles, FolderGit2, RefreshCw } from "lucide-react";
import { ProjectCard, ProjectData } from "@/components/ProjectCard";
import { StatsOverview } from "@/components/StatsOverview";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { ProjectModal } from "@/components/ProjectModal";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { AutoScanModal } from "@/components/AutoScanModal";

export default function CommandCenterDashboard() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedAgent, setSelectedAgent] = useState("ALL");
  const [selectedTech, setSelectedTech] = useState("ALL");

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  const [selectedDetailProject, setSelectedDetailProject] = useState<ProjectData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isAutoScanModalOpen, setIsAutoScanModalOpen] = useState(false);

  const fetchProjects = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
        // Refresh selected detail project if open
        if (selectedDetailProject) {
          const updated = data.projects.find((p: ProjectData) => p.id === selectedDetailProject.id);
          if (updated) setSelectedDetailProject(updated);
        }
      }
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(true);
  }, []);

  const handleSaveProject = async (projectData: Partial<ProjectData>) => {
    try {
      if (projectData.id) {
        // Update existing
        const res = await fetch(`/api/projects/${projectData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        const data = await res.json();
        if (data.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === data.project.id ? data.project : p))
          );
        }
      } else {
        // Create new
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        const data = await res.json();
        if (data.project) {
          setProjects((prev) => [data.project, ...prev]);
        }
      }
      await fetchProjects(false);
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      await fetchProjects(false);
    } catch (err) {
      console.error("Failed to delete project:", err);
      fetchProjects(true);
    }
  };

  const handleImportScannedProject = async (projectData: any) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const data = await res.json();
      if (data.project) {
        setProjects((prev) => [data.project, ...prev]);
      }
      await fetchProjects(false);
    } catch (err) {
      console.error("Failed to import project:", err);
    }
  };

  // Filtering logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.whereILeftOff && p.whereILeftOff.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.localPath && p.localPath.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;

    const matchesAgent =
      selectedAgent === "ALL" ||
      (p.aiAgents && p.aiAgents.some((a) => a.toLowerCase().includes(selectedAgent.toLowerCase())));

    const matchesTech =
      selectedTech === "ALL" ||
      (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(selectedTech.toLowerCase())));

    return matchesSearch && matchesStatus && matchesAgent && matchesTech;
  });

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Project Dev Tracker
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  macOS Local
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Control central de infraestructura, stack (Supabase, Vercel, VPS) y agentes IA (Hermes, Antigravity, Codex, Open Code).
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => fetchProjects(true)}
              title="Recargar Proyectos"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => setIsAutoScanModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Escáner de Mac
            </button>

            <button
              onClick={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Nuevo Proyecto
            </button>
          </div>
        </header>

        {/* Overview Stats */}
        <StatsOverview projects={projects} />

        {/* Search & Filter Bar */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedAgent={selectedAgent}
          onAgentChange={setSelectedAgent}
          selectedTech={selectedTech}
          onTechChange={setSelectedTech}
        />

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-sm font-medium">Cargando base de datos de proyectos...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(p) => {
                  setEditingProject(p);
                  setIsProjectModalOpen(true);
                }}
                onDelete={handleDeleteProject}
                onOpenDetails={(p) => {
                  setSelectedDetailProject(p);
                  setIsDetailModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-4">
            <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-slate-200">No se encontraron proyectos</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                No hay proyectos que coincidan con los filtros seleccionados o tu base de datos está vacía.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Crear Primer Proyecto
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        initialData={editingProject}
      />

      <ProjectDetailModal
        project={selectedDetailProject}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={() => fetchProjects(false)}
        onEdit={(p) => {
          setIsDetailModalOpen(false);
          setEditingProject(p);
          setIsProjectModalOpen(true);
        }}
      />

      <AutoScanModal
        isOpen={isAutoScanModalOpen}
        onClose={() => setIsAutoScanModalOpen(false)}
        onImportProject={handleImportScannedProject}
      />
    </main>
  );
}
