"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication token in localStorage
    const token = localStorage.getItem("betah_token");
    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Loading state while checking token
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-900 font-sans space-y-4">
        <Loader2 className="h-9 w-9 text-blue-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Memverifikasi Sesi Autentikasi HR...</p>
      </div>
    );
  }

  // If not authenticated, render null (router.replace redirect is happening)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-900 font-sans space-y-4 p-6 text-center">
        <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="font-sans text-base font-extrabold text-slate-900">Akses Ditolak (401 Unauthorized)</h3>
          <p className="text-xs text-slate-500">
            Sesi Anda belum terautentikasi. Anda sedang dialihkan ke halaman login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
