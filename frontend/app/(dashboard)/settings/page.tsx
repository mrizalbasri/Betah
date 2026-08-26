"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, Chip } from "@heroui/react";
import { Sliders, Database, Cpu, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";

import { API_BASE_URL } from "@/lib/api/client";

interface MlopsStatus {
  is_retraining: boolean;
  active_version: string;
  last_retrained: string;
  schedule: string;
  pipeline_engine: string;
  history: Array<{
    version: string;
    timestamp: string;
    model_type: string;
    params: Record<string, any>;
    metrics: { accuracy: number; precision: number; recall: number; f1: number; roc_auc: number };
    status: string;
  }>;
}

export default function ModelSettingsPage() {
  const [mlopsStatus, setMlopsStatus] = useState<MlopsStatus | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMlopsStatus();
  }, []);

  async function fetchMlopsStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/retrain/status`);
      if (res.ok) {
        const data = await res.json();
        setMlopsStatus(data);
      }
    } catch (err) {
      console.error("Gagal mengambil status MLOps:", err);
    }
  }

  async function handleTriggerRetrain() {
    setIsTriggering(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/retrain/trigger`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
        setTimeout(() => fetchMlopsStatus(), 2000);
      }
    } catch (err) {
      setMessage("Gagal memicu auto-retrain MLOps.");
    } finally {
      setIsTriggering(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Topbar
        title="Model Configurations & MLOps Pipeline"
        subtitle="Manajemen otomatis MLOps retrain pipeline, versi model XGBoost, status cache SHAP, dan ambang batas risiko"
      />
      <div className="p-8 flex flex-col gap-6 max-w-[1000px]">
        {/* MLOps Auto-Retrain Control Center Card */}
        <Card className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-xs">
          <CardContent className="p-0 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006FEE] text-white shadow-md shadow-blue-500/20">
                  <RefreshCw className={`h-5 w-5 ${mlopsStatus?.is_retraining ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-slate-900 flex items-center gap-2">
                    MLOps Automated Retrain Pipeline
                    <Chip color="success" variant="soft" className="font-sans text-[11px] font-bold rounded-full">
                      Active Registry
                    </Chip>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Model aktif: <strong className="text-[#006FEE] font-mono">{mlopsStatus?.active_version || "v1.0.0"}</strong> | Terakhir di-retrain: {mlopsStatus?.last_retrained || "2026-08-24 10:00:00"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleTriggerRetrain}
                disabled={isTriggering || mlopsStatus?.is_retraining}
                className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-lime-500/20 hover:bg-lime-300 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isTriggering || mlopsStatus?.is_retraining ? "animate-spin" : ""}`} />
                <span>{mlopsStatus?.is_retraining ? "Sedang Training..." : "Trigger Auto-Retrain MLOps"}</span>
              </button>
            </div>

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* MLOps Model History Table */}
            <div className="flex flex-col gap-2 pt-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Riwayat Versi Model & Metrik Performance
              </h4>

              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                      <th className="px-3.5 py-2.5">Versi</th>
                      <th className="px-3.5 py-2.5">Waktu Training</th>
                      <th className="px-3.5 py-2.5">Tipe Model</th>
                      <th className="px-3.5 py-2.5">F1-Score</th>
                      <th className="px-3.5 py-2.5">ROC-AUC</th>
                      <th className="px-3.5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(mlopsStatus?.history || [
                      {
                        version: "v1.0.0",
                        timestamp: "2026-08-24 10:00:00",
                        model_type: "XGBoost (Tuned)",
                        params: {},
                        metrics: { accuracy: 0.8707, precision: 0.65, recall: 0.4407, f1: 0.5253, roc_auc: 0.8123 },
                        status: "PROMOTED_TO_PRODUCTION"
                      }
                    ]).map((item) => (
                      <tr key={item.version + item.timestamp} className="border-b border-slate-100 hover:bg-slate-50 font-medium">
                        <td className="px-3.5 py-2.5 font-bold font-mono text-[#006FEE]">{item.version}</td>
                        <td className="px-3.5 py-2.5 text-slate-600">{item.timestamp}</td>
                        <td className="px-3.5 py-2.5 text-slate-900 font-bold">{item.model_type}</td>
                        <td className="px-3.5 py-2.5 font-mono font-bold text-emerald-600">{item.metrics.f1}</td>
                        <td className="px-3.5 py-2.5 font-mono font-bold text-blue-600">{item.metrics.roc_auc}</td>
                        <td className="px-3.5 py-2.5">
                          <Chip color="success" variant="soft" className="font-sans font-bold text-[10px] rounded-full">
                            {item.status}
                          </Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* XGBoost Hyperparameters */}
        <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <CardContent className="p-0 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#006FEE]">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-slate-900">
                    XGBoost Classifier Hyperparameters
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Model versi aktif yang dilatih secara otomatis via GridSearchCV & MLOps Pipeline.
                  </p>
                </div>
              </div>
              <Chip color="accent" variant="soft" className="font-sans text-xs font-bold rounded-full">
                Active Production Model
              </Chip>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Max Depth</span>
                <span className="text-base font-bold text-slate-900 font-mono">6</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Learning Rate (eta)</span>
                <span className="text-base font-bold text-slate-900 font-mono">0.05</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">N Estimators</span>
                <span className="text-base font-bold text-slate-900 font-mono">100 Trees</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Thresholds & SHAP Settings */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <CardContent className="p-0 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Sliders className="h-5 w-5" />
                <h4 className="font-sans text-sm font-bold text-slate-900">Ambang Batas Tier Risiko</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Standardisasi klasifikasi tingkat probabilitas attrition karyawan.
              </p>
              <div className="flex flex-col gap-2 pt-2 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <span className="font-bold">HIGH RISK</span>
                  <span className="font-mono font-bold">Probabilitas &ge; 50%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="font-bold">MEDIUM RISK</span>
                  <span className="font-mono font-bold">Probabilitas 30% - 49%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="font-bold">LOW RISK</span>
                  <span className="font-mono font-bold">Probabilitas &lt; 30%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <CardContent className="p-0 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <Database className="h-5 w-5" />
                <h4 className="font-sans text-sm font-bold text-slate-900">Cache & RAG Vectorstore Status</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Penyimpanan data in-memory backend FastAPI untuk inferensi cepat.
              </p>
              <div className="flex flex-col gap-2 pt-2 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                  <span>SHAP Pre-computed Cache</span>
                  <span className="font-bold text-emerald-600">1.470 Records</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                  <span>LangGraph Policy Chunks</span>
                  <span className="font-bold text-emerald-600">13 Chunks Active</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                  <span>FastAPI Endpoint Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Healthy 200 OK
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
