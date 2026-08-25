"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { name: "Fitur Utama", href: "#fitur" },
  { name: "Interactive Demo", href: "#showcase" },
  { name: "Kalkulator ROI", href: "#kalkulator" },
  { name: "Tim Creator", href: "#creators" },
  { name: "Testimoni", href: "#testimoni" },
];

export function LandingNavbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.img
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            src="/logo.webp"
            alt="Betah Logo"
            className="h-10 w-10 object-contain rounded-xl shadow-xs"
          />
          <div>
            <div className="font-sans text-xl font-bold text-slate-900 tracking-tight">
              Betah
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Employee Attrition Intelligence</p>
          </div>
        </Link>

        {/* Navigation Items with Animated Framer Motion Hover Pill */}
        <nav
          className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {NAV_ITEMS.map((item, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <a
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                className="relative px-4 py-2 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1 z-10 hover:text-slate-950"
              >
                {isHovered && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/70 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Header Action Button — Clean & Uncluttered */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Masuk Akun
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span>Uji Coba Demo</span>
              <ArrowRight className="h-3.5 w-3.5 text-lime-400" />
            </Link>
          </motion.div>
        </div>

      </div>
    </header>
  );
}
