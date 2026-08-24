"use client";

import { getInitials } from "@/lib/utils/getInitials";
import { User } from "lucide-react";

interface EmployeeAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const AVATAR_COLOR_PALETTES = [
  { bg: "bg-blue-600", text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },
  { bg: "bg-violet-600", text: "text-white" },
  { bg: "bg-teal-600", text: "text-white" },
  { bg: "bg-emerald-600", text: "text-white" },
  { bg: "bg-amber-600", text: "text-white" },
  { bg: "bg-rose-600", text: "text-white" },
  { bg: "bg-sky-600", text: "text-white" },
];

export function EmployeeAvatar({ name, size = "sm" }: EmployeeAvatarProps) {
  const initials = getInitials(name || "");
  const cleanInitials = initials.replace(/[^A-Z]/g, "");

  // Deterministic color selection based on name string
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % AVATAR_COLOR_PALETTES.length;
  const palette = AVATAR_COLOR_PALETTES[colorIndex];

  const sizeClasses =
    size === "sm"
      ? "h-8 w-8 text-[11px]"
      : size === "md"
      ? "h-10 w-10 text-xs"
      : "h-12 w-12 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-sans font-bold shadow-2xs ${palette.bg} ${palette.text} ${sizeClasses}`}
    >
      {cleanInitials || <User className="h-4 w-4 text-white" />}
    </div>
  );
}
