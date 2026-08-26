"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Brain,
  Sliders,
  MessageSquareText,
  ArrowRight,
  TrendingDown,
  Users,
  Award,
  Star,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Calculator,
  ExternalLink,
  Linkedin,
  Send,
  HelpCircle,
  Activity,
} from "lucide-react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

// ponytail: simple counter hook — upgrade to intersection-observer library if perf matters at scale
function useAnimatedCounter(target: number, duration = 1500, decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, decimals]);

  return { count, ref };
}

// Word-by-word text reveal component for general section titles & quotes (clean fade & slide)
function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } }
      }}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
            visible: {
              opacity: 1, y: 0, filter: "blur(0px)",
              transition: { type: "spring" as const, stiffness: 320, damping: 24 }
            }
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Shared motion variants — single source of truth with diverse directions
const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 60, damping: 22, mass: 0.8 },
  },
};

const stagger = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 65, damping: 20, mass: 0.7 },
    },
  },
};

const wordReveal = {
  hidden: { opacity: 0, scale: 0.35, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 400, damping: 16, delay: 0.05 + i * 0.07 },
  }),
};

const cardFromLeft = {
  hidden: { opacity: 0, x: -50, scale: 0.94, filter: "blur(6px)" },
  visible: {
    opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 70, damping: 18 },
  },
};

const cardZoomIn = {
  hidden: { opacity: 0, scale: 0.82, filter: "blur(10px)" },
  visible: {
    opacity: 1, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 75, damping: 18 },
  },
};

const cardFromRight = {
  hidden: { opacity: 0, x: 50, scale: 0.94, filter: "blur(6px)" },
  visible: {
    opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 70, damping: 18 },
  },
};

const cardRotateIn = {
  hidden: { opacity: 0, rotate: -4, scale: 0.88, filter: "blur(6px)" },
  visible: {
    opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 70, damping: 18 },
  },
};

export default function LandingPage() {
  // State for ROI Calculator
  const [employeeCount, setEmployeeCount] = useState(350);
  const [avgSalary, setAvgSalary] = useState(12); // In millions IDR
  const [turnoverRate, setTurnoverRate] = useState(15); // Percentage

  // Calculations
  const costPerEmployee = avgSalary * 6; // In millions IDR
  const totalEmployeesResigning = Math.round((employeeCount * turnoverRate) / 100);
  const currentTurnoverCost = totalEmployeesResigning * costPerEmployee; // In millions IDR
  const savedEmployees = Math.round(totalEmployeesResigning * 0.35); // 35% retention boost
  const estimatedSavings = savedEmployees * costPerEmployee; // In millions IDR

  // Active showcase tab
  const [activeTab, setActiveTab] = useState<"engineer" | "sales" | "support">("engineer");

  // Scroll parallax for orbital bg & footer watermark
  const { scrollYProgress } = useScroll();
  const orbitalY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbitalY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbitalY3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const watermarkY = useTransform(scrollYProgress, [0.7, 1], [60, -40]);

  // Animated counters for hero metrics
  const accuracy = useAnimatedCounter(94.2, 1800, 1);
  const monitored = useAnimatedCounter(350, 1400, 0);
  const retention = useAnimatedCounter(35, 1200, 0);

  const showcaseProfiles = {
    engineer: {
      name: "Budi Pratama",
      role: "Senior Frontend Engineer",
      dept: "Technology",
      riskScore: 87.4,
      riskLevel: "High Risk",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      topFactors: [
        { name: "OverTime = Yes", weight: "+34.2%", status: "negative" },
        { name: "MonthlyIncome = Rp 8.5M", weight: "+22.1%", status: "negative" },
        { name: "YearsAtCompany = 4.2 thn", weight: "-8.5%", status: "positive" },
      ],
      recommendation: "Kenaikan gaji +15% & penyesuaian jam lembur memotong risiko attrition hingga 41.2%."
    },
    sales: {
      name: "Siti Aminah",
      role: "Senior Account Executive",
      dept: "Sales & Marketing",
      riskScore: 68.2,
      riskLevel: "Medium Risk",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      topFactors: [
        { name: "DistanceFromHome = 28 km", weight: "+28.4%", status: "negative" },
        { name: "WorkLifeBalance = 1 (Poor)", weight: "+19.0%", status: "negative" },
        { name: "JobSatisfaction = 4 (High)", weight: "-12.3%", status: "positive" },
      ],
      recommendation: "Fasilitas Work-From-Home 2 hari/minggu menurunkan risiko attrition sebesar 24.5%."
    },
    support: {
      name: "Dedi Setiadi",
      role: "Customer Operations Specialist",
      dept: "Operations",
      riskScore: 32.1,
      riskLevel: "Low Risk",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      topFactors: [
        { name: "JobInvolvement = High", weight: "-24.1%", status: "positive" },
        { name: "EnvironmentSatisfaction = High", weight: "-18.5%", status: "positive" },
        { name: "OverTime = No", weight: "-15.2%", status: "positive" },
      ],
      recommendation: "Kondisi stabil. Pertahankan evaluasi performa berkala dan program mentoring."
    }
  };

  const profile = showcaseProfiles[activeTab];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-lime-400 selection:text-slate-900">
      {/* Background Orbital Grid Lines — Scroll Parallax + CSS drift */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Drifting gradient orbs */}
        <div className="animate-orb-drift-1 absolute top-[-80px] right-[-60px] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-lime-100/20 via-blue-50/10 to-transparent blur-[80px]" />
        <div className="animate-orb-drift-2 absolute top-[40%] left-[-100px] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/15 to-transparent blur-[70px]" />
        {/* Orbital rings with parallax */}
        <motion.div style={{ y: orbitalY1 }} className="absolute top-[-200px] right-[-100px] w-[900px] h-[900px] rounded-full border border-slate-200/60" />
        <motion.div style={{ y: orbitalY2 }} className="absolute top-[-100px] right-[0px] w-[700px] h-[700px] rounded-full border border-blue-100/50" />
        <motion.div style={{ y: orbitalY3 }} className="absolute top-[300px] left-[-200px] w-[600px] h-[600px] rounded-full border border-slate-200/40" />
      </div>

      {/* Header Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 px-6 overflow-hidden text-center">
        {/* Multi-layer ambient glow */}
        <div className="absolute top-[5%] left-[50%] -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-b from-lime-200/30 via-blue-100/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[300px] bg-gradient-to-br from-lime-300/15 to-transparent blur-[80px] pointer-events-none rounded-full animate-float-medium" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-8" style={{ perspective: "1000px" }}>

          {/* Floating ambient particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            >
              <div className="animate-float-slow absolute top-8 left-[8%] h-2.5 w-2.5 rounded-full bg-lime-400/60 blur-[1px]" style={{ animationDelay: "0s" }} />
              <div className="animate-float-slow absolute top-24 right-[12%] h-2 w-2 rounded-full bg-blue-400/40" style={{ animationDelay: "-2s" }} />
              <div className="animate-float-medium absolute bottom-32 left-[15%] h-3 w-3 rounded-full bg-lime-300/50 blur-[1px]" style={{ animationDelay: "-1s" }} />
              <div className="animate-float-slow absolute bottom-16 right-[18%] h-1.5 w-1.5 rounded-full bg-slate-400/30" style={{ animationDelay: "-3s" }} />
              <div className="animate-float-medium absolute top-40 left-[25%] h-1.5 w-1.5 rounded-full bg-lime-500/40" style={{ animationDelay: "-0.5s" }} />
              <div className="animate-float-slow absolute top-16 right-[30%] h-2 w-2 rounded-full bg-blue-300/30" style={{ animationDelay: "-1.5s" }} />
            </motion.div>
          </div>


          {/* Headline — word by word reveal */}
          <motion.h1
            className="font-sans text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            initial="hidden"
            animate="visible"
          >
            {["Prediksi", "&", "Cegah"].map((word, i) => (
              <motion.span key={i} custom={i} variants={wordReveal} className="inline-block mr-[0.25em]">
                {word === "&" ? <>&amp;</> : word}
              </motion.span>
            ))}
            <br className="hidden sm:inline" />
            <motion.span
              custom={3}
              variants={wordReveal}
              className="inline-block my-1 sm:my-2"
            >
              <span className="relative text-slate-950 bg-lime-300 px-4 py-1 rounded-2xl border border-lime-400 shadow-xs">
                Turnover Karyawan
              </span>
            </motion.span>
            {" "}
            <br className="hidden sm:inline" />
            {["Sebelum", "Resign."].map((word, i) => (
              <motion.span key={i} custom={4 + i} variants={wordReveal} className="inline-block mr-[0.2em]">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 60, damping: 22, delay: 0.55 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Betah membantu HR Manager mengidentifikasi faktor risiko karyawan yang akan resign 3 bulan lebih awal dan memberikan rekomendasi aksi retensi preskriptif yang tepat.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 22, delay: 0.68 }}
            className="flex items-center justify-center gap-4 pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
            >
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center gap-3 px-9 py-4.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl shadow-slate-900/30 transition-colors duration-200 cursor-pointer overflow-hidden"
              >
                {/* Button shimmer on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out" />
                <span className="relative">Mulai Uji Coba Demo</span>
                <ArrowRight className="relative h-4 w-4 text-lime-400 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust metrics bar */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-6 pt-2"
          >
            {[
              { ref: accuracy.ref, val: accuracy.count, suffix: "%", label: "Akurasi Model", pre: "", post: "%" },
              { ref: monitored.ref, val: monitored.count, suffix: "+", label: "Karyawan Monitored", pre: "", post: "+" },
              { ref: retention.ref, val: retention.count, suffix: "%", label: "Retensi Terbukti", pre: "+", post: "%" },
            ].map((m, i) => (
              <motion.div key={i} variants={stagger.item} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  {m.label === "Karyawan Monitored" ? (
                    <><strong className="text-slate-900 font-bold"><span ref={m.ref}>{m.val}</span>+</strong> {m.label}</>
                  ) : (
                    <>{m.label} <strong className="text-slate-900 font-bold">{m.pre}<span ref={m.ref}>{m.val}</span>{m.post}</strong></>
                  )}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* Full Width Showcase Container */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.93, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 42, damping: 18, delay: 0.85 }}
          className="mt-14 max-w-5xl mx-auto text-left rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden"
        >
          {/* Showcase Window Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans font-bold text-slate-800">Betah Attrition Risk Radar — Prescriptive Analytics</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ● Live Active Model
            </span>
          </div>

          {/* Showcase Grid Content — Directionally Varied Card Entrances */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50 space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              
              {/* Card 1 — Employee High Risk (From Left) */}
              <motion.div
                variants={cardFromLeft}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 380, damping: 25 }}
                className="p-6 rounded-[24px] bg-white border border-rose-200/90 shadow-lg shadow-rose-500/5 hover:border-rose-300 space-y-4 cursor-default"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50/90 px-3 py-1 rounded-full border border-rose-200">
                    HIGH ATTRITION RISK
                  </span>
                  <span className="font-mono text-xl font-black text-rose-600">87.4%</span>
                </div>
                <div className="flex items-center gap-3.5 pt-1">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="Budi Pratama"
                    className="h-11 w-11 rounded-full object-cover border-2 border-rose-500/80 shadow-xs"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">Budi Pratama</div>
                    <div className="text-[11px] text-slate-500 font-medium">Senior Frontend Eng</div>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50/80 text-[10px] text-slate-600 font-mono space-y-1 border border-slate-200/60">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">FAKTOR UTAMA RESIKO:</div>
                  <div className="font-bold text-rose-600">Overtime (+34.2%) · Low Income</div>
                </div>
              </motion.div>

              {/* Card 2 — AI Prescriptive Action (Zoom In Center) */}
              <motion.div
                variants={cardZoomIn}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 380, damping: 25 }}
                className="p-6 rounded-[24px] bg-gradient-to-br from-lime-400 via-lime-400 to-lime-300 text-slate-950 shadow-xl shadow-lime-500/20 space-y-4 border border-lime-300/80 flex flex-col justify-between hover:shadow-2xl hover:shadow-lime-500/30 cursor-default"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-white/90 px-3 py-1 rounded-full shadow-2xs">
                    AI PRESCRIPTIVE ACTION
                  </span>
                  <Sparkles className="h-4 w-4 text-slate-950 animate-bounce" />
                </div>
                <div className="text-sm font-black text-slate-950 leading-snug tracking-tight">
                  Kenaikan Gaji +15% &amp; Bebas Lembur
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 text-lime-400 text-[11px] font-mono font-bold flex items-center justify-between shadow-md">
                  <span className="text-slate-300">Estimasi Penurunan:</span>
                  <span className="text-lime-300 font-extrabold">87.4% &rarr; 46.2%</span>
                </div>
              </motion.div>

              {/* Card 3 — Model Accuracy (From Right) */}
              <motion.div
                variants={cardFromRight}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 380, damping: 25 }}
                className="p-6 rounded-[24px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white shadow-xl space-y-4 flex flex-col justify-between border border-slate-800 hover:border-slate-700 cursor-default"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                    MODEL ACCURACY
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-3xl sm:text-4xl font-black text-lime-400 tracking-tight">94.2%</div>
                  <div className="text-xs text-slate-300 font-semibold">XGBoost Precision Rate</div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-3">
                  Deteksi dini 3 bulan sebelum resign
                </div>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>



      </section>


      {/* Achievements / Key Metrics Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">Achievements &amp; Metrics</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
              <WordReveal text="Metrik Unggulan Platform Betah" />
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Card 1 — Left */}
            <motion.div
              variants={cardFromLeft}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 24px 48px -8px rgba(148,163,184,0.35)" }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="p-8 rounded-[28px] bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 hover:border-slate-300/90 space-y-5 cursor-default"
            >
              <div className="flex items-center gap-2.5 text-amber-500 font-bold text-xl">
                <Star className="h-6 w-6 fill-amber-400" />
                <span className="font-mono text-2xl text-slate-900 font-black">4.9 / 5.0</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="user" />
                  <img className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" alt="user" />
                  <img className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="user" />
                </div>
                <span className="text-xs font-bold text-slate-700">+350 HR Leaders</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Model XGBoost presisi tinggi dengan akurasi teruji 94.2% pada analisis data karyawan perusahaan.
              </p>
            </motion.div>

            {/* Card 2 — Zoom Center */}
            <motion.div
              variants={cardZoomIn}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 24px 48px -8px rgba(148,163,184,0.35)" }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="p-8 rounded-[28px] bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 hover:border-slate-300/90 space-y-5 cursor-default"
            >
              <div className="flex items-center gap-2.5 text-blue-600 font-bold text-xl">
                <Award className="h-6 w-6 text-blue-600" />
                <span className="font-sans text-xl text-slate-900 font-extrabold">Top HR AI 2026</span>
              </div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-lime-100/80 text-slate-950 border border-lime-300">
                Best Prescriptive Analytics
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Platform terbukti membantu perusahaan mengurangi angka turnover hingga 35% per tahun secara konsisten.
              </p>
            </motion.div>

            {/* Card 3 — Right */}
            <motion.div
              variants={cardFromRight}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 24px 48px -8px rgba(148,163,184,0.35)" }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="p-8 rounded-[28px] bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 hover:border-slate-300/90 space-y-5 cursor-default"
            >
              <div className="flex items-center gap-2.5 text-emerald-600 font-bold text-xl">
                <Activity className="h-6 w-6 text-emerald-600" />
                <span className="font-mono text-2xl text-slate-900 font-black">3 Bulan</span>
              </div>
              <div className="text-xs font-bold text-slate-800">Early Warning Detection</div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Mendeteksi akumulasi risiko resign jauh sebelum surat pengunduran diri diajukan oleh karyawan.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="py-20 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-7xl mx-auto space-y-16"
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600">Core Features</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900">
              <WordReveal text="Solusi Cerdas Pengelolaan Retensi" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Fitur lengkap yang dirancang khusus untuk mempermudah tugas HR Manager.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <ShieldAlert className="h-6 w-6" />, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600", title: "Early Risk Tracker", desc: "Memantau seluruh karyawan aktif dan mengelompokkan risiko attrition secara real-time dari 0% hingga 100%.", variant: cardFromLeft },
              { icon: <Brain className="h-6 w-6" />, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", title: "SHAP Explainable AI", desc: "Menjabarkan faktor pemicu spesifik (gaji, jam lembur, kepuasan kerja) di balik setiap prediksi risiko.", variant: cardZoomIn },
              { icon: <Sliders className="h-6 w-6" />, bg: "bg-lime-100", border: "border-lime-200", text: "text-slate-950", title: "What-If Simulator", desc: "Simulasi penyesuaian gaji atau jam lembur secara instant untuk melihat penurunan estimasi risiko.", variant: cardRotateIn },
              { icon: <MessageSquareText className="h-6 w-6" />, bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", title: "Betah AI Assistant", desc: "Asisten AI interaktif yang siap menjawab pertanyaan seputar strategi retensi dan komunikasi dengan karyawan.", variant: cardFromRight },
            ].map((feat, i) => (
              <motion.div
                key={i}
                variants={feat.variant}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="p-7 rounded-[28px] bg-white border border-slate-200/90 shadow-lg shadow-slate-200/30 hover:border-slate-300 hover:shadow-xl space-y-4 group cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, 0], scale: 1.18 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`h-12 w-12 rounded-2xl ${feat.bg} border ${feat.border} ${feat.text} flex items-center justify-center shadow-sm`}
                >
                  {feat.icon}
                </motion.div>
                <h3 className="font-sans text-lg font-extrabold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Showcase Section */}
      <section id="showcase" className="py-16 px-6 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600">Interactive Showcase</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900">
              <WordReveal text="Lihat Analisis SHAP & Rekomendasi AI" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih profil karyawan di bawah untuk melihat rincian prediksi SHAP dan rekomendasi tindakan intervensi retensi.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-200/70 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("engineer")}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "engineer"
                    ? "bg-lime-400 text-slate-950 shadow-md shadow-lime-500/20"
                    : "text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                Budi Pratama (Senior Engineer)
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "sales"
                    ? "bg-lime-400 text-slate-950 shadow-md shadow-lime-500/20"
                    : "text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                Siti Aminah (Account Executive)
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "support"
                    ? "bg-lime-400 text-slate-950 shadow-md shadow-lime-500/20"
                    : "text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                Dedi Setiadi (Customer Ops)
              </button>
            </div>

            {/* Profile Content — Animated Tab Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
              >
              {/* Left Column: Basic Info */}
              <div className="space-y-6 lg:border-r lg:border-slate-200 lg:pr-8">
                <div className="flex items-center gap-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                  />
                  <div>
                    <h4 className="font-sans text-lg font-bold text-slate-900">{profile.name}</h4>
                    <p className="text-xs text-slate-500">{profile.role}</p>
                    <p className="text-[11px] font-mono text-blue-600 font-semibold mt-0.5">{profile.dept}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Skor Attrition Risk</span>
                    <span className={`font-mono font-bold ${
                      profile.riskScore > 70 ? "text-rose-600" : profile.riskScore > 50 ? "text-amber-600" : "text-emerald-600"
                    }`}>
                      {profile.riskScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profile.riskScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      className={`h-full rounded-full ${
                        profile.riskScore > 70 ? "bg-rose-500" : profile.riskScore > 50 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="text-right">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                      profile.riskScore > 70 ? "bg-rose-100 text-rose-700" : profile.riskScore > 50 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {profile.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: SHAP Factors */}
              <div className="space-y-4">
                <h5 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Top SHAP Risk Drivers
                </h5>
                <div className="space-y-3">
                  {profile.topFactors.map((factor, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.08 }}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <span className="text-slate-800 font-semibold">{factor.name}</span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                        factor.status === "negative" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {factor.weight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Action Recommendation */}
              <div className="space-y-4 bg-lime-50/80 border border-lime-300 p-6 rounded-3xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Sparkles className="h-4 w-4 text-lime-600" />
                  <span>Rekomendasi Intervensi AI</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{profile.recommendation}&rdquo;
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 pt-2"
                >
                  <span>Coba Langsung di Dashboard</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="kalkulator" className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600">Cost Savings</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900">
              <WordReveal text="Kalkulator Potensi ROI" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Hitung estimasi penghematan biaya turnover perusahaan Anda dengan penanganan preskriptif Betah.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden"
          >
            {/* Input Controls — From Left */}
            <motion.div variants={cardFromLeft} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Jumlah Karyawan Perusahaan</span>
                  <span className="font-mono text-blue-600 font-bold">{employeeCount} Karyawan</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Rata-rata Gaji Bulanan</span>
                  <span className="font-mono text-emerald-600 font-bold">Rp {avgSalary} Juta</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Estimasi Turnover Rate Tahunan</span>
                  <span className="font-mono text-amber-600 font-bold">{turnoverRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={turnoverRate}
                  onChange={(e) => setTurnoverRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Catatan Metrik:</p>
                <p>Biaya penggantian 1 karyawan diperhitungkan sebesar 6x gaji bulanan (biaya rekrutmen, onboarding, &amp; hilangnya produktivitas).</p>
              </div>
            </motion.div>

            {/* Results Display — From Right */}
            <motion.div variants={cardFromRight} className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl border border-slate-800">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Estimasi Biaya Turnover Tanpa Betah
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-rose-400">
                  Rp {(currentTurnoverCost / 1000).toFixed(2)} Miliar <span className="text-xs text-slate-400 font-normal">/tahun</span>
                </div>
                <p className="text-xs text-slate-400">
                  Dari ~{totalEmployeesResigning} karyawan yang diperkirakan resign per tahun.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-lime-400 font-bold">
                  Potensi Penghematan Bersih
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-lime-400">
                  Rp {(estimatedSavings / 1000).toFixed(2)} Miliar <span className="text-xs text-slate-400 font-normal">/tahun</span>
                </div>
                <p className="text-xs text-slate-300 pt-1 flex items-center gap-2 font-medium">
                  <TrendingDown className="h-4 w-4 text-lime-400 shrink-0" />
                  <span>Estimasi penyelamatan ~{savedEmployees} talenta terbaik per tahun.</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section (Tim Pengembang) */}
      <section id="creators" className="py-16 px-6 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-lime-300 px-3 py-1 rounded-full border border-lime-400">
              Meet The Creators
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900">
              <WordReveal text="Tim Pengembang Betah" />
            </h2>
          </div>

          {/* Clean Names Pill / Grid — Directional Entrances with LinkedIn Link */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            {[
              { initials: "RB", name: "M. Rizal Basri", link: "https://www.linkedin.com/in/m-rizal-basri/", bg: "bg-slate-900", text: "text-lime-400", variant: cardFromLeft },
              { initials: "MI", name: "Muhammad Irfan Tam Tomo", link: "https://www.linkedin.com/in/irfantam/", bg: "bg-lime-400", text: "text-slate-950", variant: cardZoomIn },
              { initials: "RK", name: "Rifky Kurniawan", link: "https://www.linkedin.com/in/rifkykurniawanputra/", bg: "bg-blue-600", text: "text-white", variant: cardFromRight },
            ].map((member) => (
              <motion.a
                key={member.initials}
                href={member.link}
                target={member.link !== "#" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                variants={member.variant}
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-2xl p-3.5 px-6 shadow-md shadow-slate-200/50 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`h-9 w-9 rounded-xl ${member.bg} ${member.text} flex items-center justify-center font-bold text-xs font-mono shadow-sm`}>
                  {member.initials}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</span>
                  {member.link !== "#" && (
                    <Linkedin className="h-4 w-4 text-[#0A66C2] shrink-0 group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimoni" className="py-20 px-6 bg-white border-t border-slate-200 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Column: Big Circular Avatar Image Container (From Left with Rotation) */}
          <motion.div variants={cardRotateIn} className="lg:col-span-5 flex justify-center">
            <div className="relative">
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-4 rounded-full border border-lime-300 animate-[spin_60s_linear_infinite]" />
              <div className="h-64 w-64 sm:h-80 sm:w-80 rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-slate-300">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                  alt="HR Leader Testimonial"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating Quote Badge */}
              <div className="absolute -bottom-4 -right-4 bg-lime-400 text-slate-950 p-3 rounded-2xl shadow-lg border border-white font-bold text-xs flex items-center gap-2">
                <Star className="h-4 w-4 fill-slate-950" />
                <span>Verified HR Leader</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Quote Text (From Right with WordReveal) */}
          <motion.div variants={cardFromRight} className="lg:col-span-7 space-y-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-lime-300 px-2.5 py-0.5 rounded-full border border-lime-400">Testimonial</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900">
              <WordReveal text="Apa Kata Para HR Manager Tentang Betah" />
            </h2>
            
            <div className="text-4xl font-serif text-slate-900 font-bold">&ldquo;</div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-serif italic">
              <WordReveal text="Penjelasan SHAP Factor pada Betah sangat membantu tim People Ops kami memahami pemicu utama karyawan resign secara presisi. Bukan sekadar dugaan, melainkan keputusan preskriptif berbasis data." delay={0.1} />
            </p>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-sans text-base font-bold text-slate-900">Sri Rahayu</div>
                <div className="text-xs text-slate-500 font-medium">HR Director | Head of People Operations</div>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Request Demo / Support Banner */}
      <section id="demo" className="py-16 px-6 bg-slate-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-lime-400/20 px-3.5 py-1 text-xs font-semibold text-lime-300 border border-lime-400/30">
            <HelpCircle className="h-4 w-4 text-lime-400" />
            <span>Request a Demo &amp; Consultation</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold">
            Jadwalkan Sesi Demo Eksklusif Perusahaan Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Tim konsultan Betah akan membantu mengonfigurasi dan menyiapkan lingkungan analitik HR khusus untuk struktur organisasi Anda.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert("Terima kasih! Permintaan demo telah diterima. Tim konsultan HR Betah akan segera menghubungi Anda."); }} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Email resmi perusahaan Anda..."
              className="w-full sm:w-auto flex-1 rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-lime-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-xs font-bold text-slate-950 transition-all cursor-pointer shadow-lg shadow-lime-500/20"
            >
              <span>Minta Demo</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </motion.div>
      </section>

      {/* Premium Footer Section with Floating CTA Card & Giant Watermark */}
      <footer className="relative bg-slate-950 text-slate-400 text-xs border-t border-slate-900 overflow-hidden pt-20">
        
        {/* Decorative Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-lime-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">

          {/* Top Footer Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
            
            {/* Col 1: Brand (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <img src="/logo.webp" alt="Betah Logo" className="h-9 w-9 object-contain" />
                <span className="font-sans font-extrabold text-white text-base tracking-tight">
                  Betah <span className="text-lime-400 font-mono text-xs font-normal">| AI Advisor</span>
                </span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Platform <span className="text-slate-200 font-semibold">Prescriptive HR Intelligence</span> berbasis AI untuk mendeteksi risiko <em>turnover</em> karyawan 3 bulan lebih awal dan memberikan rekomendasi intervensi retensi presisi tinggi.
              </p>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2.5 font-medium">
                <li>
                  <Link href="/dashboard" className="hover:text-lime-400 transition-colors">
                    Overview Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/high-risk" className="hover:text-lime-400 transition-colors">
                    High-Risk Employees
                  </Link>
                </li>
                <li>
                  <Link href="/department-risk" className="hover:text-lime-400 transition-colors">
                    Department Risk Map
                  </Link>
                </li>
                <li>
                  <Link href="/global-factors" className="hover:text-lime-400 transition-colors">
                    Global SHAP Factors
                  </Link>
                </li>
                <li>
                  <Link href="/what-if" className="hover:text-lime-400 transition-colors">
                    What-If Simulator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Solusi HR */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Solusi &amp; Metrik
              </h4>
              <ul className="space-y-2.5 font-medium">
                <li>
                  <a href="#fitur" className="hover:text-lime-400 transition-colors">
                    Early Warning System
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-lime-400 transition-colors">
                    SHAP Risk Drivers
                  </a>
                </li>
                <li>
                  <a href="#kalkulator" className="hover:text-lime-400 transition-colors">
                    Kalkulator ROI Retensi
                  </a>
                </li>
                <li>
                  <a href="#testimoni" className="hover:text-lime-400 transition-colors">
                    Studi Kasus HR Leader
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Akses & Bantuan */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Akses &amp; Bantuan
              </h4>
              <ul className="space-y-2.5 font-medium">
                <li>
                  <Link href="/login" className="hover:text-lime-400 transition-colors flex items-center gap-1 text-lime-400 font-bold">
                    <span>Login Portal HR</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <a href="#testimoni" className="hover:text-lime-400 transition-colors">
                    Pusat Bantuan &amp; FAQ
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Giant Watermark Brand Text (Graphy/Dopler/Enky Style - Clear High-Contrast) */}
          <div className="pt-8 pb-4 border-t border-slate-900 flex flex-col items-center justify-center relative overflow-hidden select-none">
            <motion.h1
              style={{ y: watermarkY }}
              className="font-sans font-black text-[100px] sm:text-[160px] md:text-[220px] text-transparent bg-clip-text bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 tracking-widest uppercase leading-none text-center pointer-events-none drop-shadow-lg opacity-85"
            >
              BETAH
            </motion.h1>

            {/* Bottom Copyright Bar Overlay */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 pt-6 border-t border-slate-900 relative z-10">
              <p>
                &copy; 2026 <span className="text-white font-bold">Betah AI</span>. Prescriptive HR Intelligence Platform. All rights reserved.
              </p>
              <p className="text-slate-500 font-medium">
                Employee Attrition Intelligence System
              </p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
