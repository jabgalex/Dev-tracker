"use client";

import React, { useState } from "react";
import { X, Search, Folder, Terminal, CheckCircle2, Sparkles } from "lucide-react";
import { TechBadge } from "./Badges";

interface AutoScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProject: (projectData: any) => Promise<void>;
}

export function AutoScanModal({ isOpen, onClose, onImportProject }: AutoScanModalProps) {
  const [folderPath, setFolderPath] = useState("/Users/pc/Documents");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<Array<{
    name: string;
    path: string;
    hasGit: boolean;
    hasPackageJson: boolean;
    detectedStack: string[];
  }> | null>(null);

  const [importingPath, setImportingPath] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/system/scan-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderPath }),
      });
      const data = await res.json();
      if (data.projects) {
        setScanResult(data.projects);
      }
    } catch (err) {
      console.error("Error scanning folder:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (item: any) => {
    setImportingPath(item.path);
    try {
      await onImportProject({
        name: item.name,
        description: `Proyecto importado automáticamente desde ${item.path}`,
        status: "ACTIVE",
        whereILeftOff: "Proyecto recién importado con el escáner de macOS.",
        localPath: item.path,
        aiAgents: ["Antigravity"],
        techStack: item.detectedStack || ["Next.js"],
      });
      // Remove from scan results list
      setScanResult((prev) => prev?.filter((p) => p.path !== item.path) || null);
    } catch (err) {
      console.error(err);
    } finally {
      setImportingPath(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            Escáner de Proyectos Locales en Mac
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Escribe una carpeta en tu Mac para buscar automáticamente subcarpetas con repositorios Git o archivos <code className="text-indigo-400 font-mono">package.json</code> e importarlos al tracker con 1-clic.
          </p>

          <form onSubmit={handleScan} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="/Users/pc/Documents o /Users/pc/Projects"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg glass-input text-xs font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Search className="w-4 h-4" /> {loading ? "Escaneando..." : "Escanear Carpetas"}
            </button>
          </form>

          {/* Results List */}
          {scanResult && (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Proyectos detectados: <strong>{scanResult.length}</strong></span>
              </div>

              {scanResult.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {scanResult.map((item) => (
                    <div
                      key={item.path}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span className="text-sm font-bold text-slate-200 truncate">{item.name}</span>
                          {item.hasGit && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                              git
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 truncate mb-1.5">{item.path}</p>
                        
                        {item.detectedStack.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.detectedStack.map((tech, idx) => (
                              <TechBadge key={idx} name={tech} />
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleImport(item)}
                        disabled={importingPath === item.path}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {importingPath === item.path ? "Importando..." : "Importar"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  No se encontraron carpetas con código en esta ruta.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
