"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Silakan masukkan alamat email dan kata sandi Anda.");
      return;
    }

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  const handleDemoLogin = () => {
    setEmail("sri.rahayu@company.com");
    setPassword("demo2026");
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* Left Panel: Light Clean Branding Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-200 bg-gradient-to-br from-slate-50 via-blue-50/40 to-lime-50/30">
        {/* Background Orbital Rings Decorative Graphics */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full border border-blue-200/60 pointer-events-none" />
        <div className="absolute bottom-10 -right-20 h-96 w-96 rounded-full border border-lime-300/60 pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.webp"
              alt="Betah Logo"
              className="h-10 w-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="font-sans text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Betah
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-bold border border-lime-500/30">
                  AI Advisor
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Employee Attrition Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Center Banner Messaging */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 border border-lime-300 px-3.5 py-1 text-xs font-bold text-slate-950 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-lime-600 animate-pulse" />
            <span>Prescriptive HR Analytics Platform</span>
          </div>

          <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Prediksi &amp; Cegah <br />
            <span className="text-slate-900 bg-lime-300/90 px-4 py-1 rounded-3xl border border-lime-400 inline-block shadow-xs my-1">
              Turnover Karyawan
            </span> <br />
            Presisi Tinggi.
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Betah mengombinasikan kecerdasan buatan dan analitik prediktif untuk mendeteksi risiko turnover 3 bulan lebih awal.
          </p>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="font-mono text-xl font-bold text-slate-900">94.2%</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Akurasi Model</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="font-mono text-xl font-bold text-blue-600">285</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">High Risk Tracked</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="font-mono text-xl font-bold text-emerald-600">3 Bulan</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Deteksi Lebih Dini</div>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10 border-t border-slate-200 pt-6">
          <blockquote className="text-xs text-slate-600 italic">
            &ldquo;Betah membantu tim HR kami mendeteksi risiko turnover 3 bulan lebih awal sebelum karyawan mengajukan resign.&rdquo;
          </blockquote>
          <div className="mt-2 text-xs font-bold text-slate-900">
            Sri Rahayu | <span className="text-slate-500 font-normal">HR Director &amp; People Ops</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-2 mb-6">
            <img src="/logo.webp" alt="Betah Logo" className="h-12 w-12 object-contain rounded-xl" />
            <h2 className="font-sans text-2xl font-bold text-slate-900">Betah</h2>
            <p className="text-xs text-slate-500">Employee Attrition AI Advisor</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Masuk ke Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Masukkan kredensial akun HR Manager Anda untuk mengakes analitik.
            </p>
          </div>



          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                Alamat Email HR
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                  Kata Sandi
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Silakan gunakan tombol Mode Akses Cepat (Demo HR) untuk masuk."); }} className="text-xs font-semibold text-blue-600 hover:underline">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2.5 text-xs font-medium text-slate-600">
                Ingat sesi login saya di perangkat ini
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memvalidasi Sesi...</span>
                </div>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Register & Back Link */}
          <div className="text-center pt-4 border-t border-slate-200 space-y-2 text-xs">
            <p className="text-slate-500">
              Akun HR disiapkan &amp; dikonfigurasi langsung oleh tim Betah.
            </p>
            <div>
              <Link href="/" className="font-semibold text-slate-400 hover:text-slate-700 transition-colors">
                &larr; Kembali ke Landing Page Betah
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
