"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Users, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("50-200");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !companyName || !password) {
      setError("Silakan lengkapi seluruh formulir pendaftaran.");
      return;
    }

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* Left Panel: Branding & Value Props */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white">
        {/* Background Ambient Glow */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-lime-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.webp"
              alt="Betah Logo"
              className="h-10 w-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="font-sans text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Betah
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-bold">
                  AI Advisor
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Employee Attrition Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 border border-lime-400/30 px-3.5 py-1 text-xs font-bold text-lime-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pendaftaran Akun Perusahaan</span>
          </div>

          <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Mulai Transformasi <br />
            <span className="text-lime-400">Retensi Talenta</span> <br />
            Perusahaan Anda.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Dapatkan analitik preskriptif XGBoost &amp; SHAP untuk melindungi talenta terbaik dan menekan biaya turnover hingga 35%.
          </p>

          {/* Benefits List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-200 font-semibold">
              <div className="h-5 w-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>Uji coba gratis simulator intervensi retensi karyawan</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200 font-semibold">
              <div className="h-5 w-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>Early Warning Tracker 3 bulan sebelum resign</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200 font-semibold">
              <div className="h-5 w-5 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>Keamanan data terlindungi dengan enkripsi enterprise</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 border-t border-slate-800 pt-6 text-xs text-slate-400 flex items-center justify-between">
          <span>&copy; 2026 Betah AI Advisor</span>
          <span className="font-mono text-[11px] text-lime-400">Enterprise Ready</span>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="flex flex-1 flex-col justify-center items-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-2 mb-4">
            <img src="/logo.webp" alt="Betah Logo" className="h-12 w-12 object-contain rounded-xl" />
            <h2 className="font-sans text-2xl font-bold text-slate-900">Betah AI</h2>
            <p className="text-xs text-slate-500">Formulir Pendaftaran Perusahaan</p>
          </div>

          <div className="space-y-1">
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Daftar Perusahaan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Isi data perusahaan Anda untuk memulai akun HR Manager di Betah.
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
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nama Lengkap (HR Leader)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Sri Rahayu"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Perusahaan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@perusahaan.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nama Perusahaan / Organisasi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="PT Teknologi Gemilang"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
            </div>

            {/* Employee Count Select */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Estimasi Jumlah Karyawan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Users className="h-4 w-4" />
                </div>
                <select
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
                >
                  <option value="10-50">10 - 50 Karyawan</option>
                  <option value="50-200">50 - 200 Karyawan</option>
                  <option value="200-500">200 - 500 Karyawan</option>
                  <option value="500+">500+ Karyawan Enterprise</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Buat Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 hover:bg-lime-300 px-4 py-3 text-xs font-bold text-slate-950 shadow-md shadow-lime-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Membuat Akun Perusahaan...</span>
                </div>
              ) : (
                <>
                  <span>Daftarkan Perusahaan &amp; Buka Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center pt-3 border-t border-slate-200 space-y-2 text-xs">
            <p className="text-slate-500">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Masuk di Sini
              </Link>
            </p>
            <div>
              <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
                &larr; Kembali ke Landing Page Betah
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
