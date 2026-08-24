"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface SidebarNavLinkProps {
  href: string;
  label: string;
}

/** A single sidebar navigation item that highlights itself when its route is active. */
export function SidebarNavLink({ href, label }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium transition-colors",
        isActive
          ? "bg-[#6FA98C]/[0.16] text-[#A9D6BE]"
          : "text-[#C9CDC6] hover:bg-white/[0.06] hover:text-white"
      )}
    >
      <span
        className={cn(
          "h-[5px] w-[5px] flex-shrink-0 rounded-full bg-current",
          isActive ? "opacity-100" : "opacity-60"
        )}
      />
      {label}
    </Link>
  );
}
