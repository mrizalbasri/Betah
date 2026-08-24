import type { ReactNode } from "react";
import { UpdatedPill } from "@/components/layout/UpdatedPill";

interface TopbarProps {
  title: string;
  subtitle: ReactNode;
}

/** Page header shared by every workspace page: title, subtitle, and refresh status. */
export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div className="flex items-end justify-between border-b border-line bg-paper px-9 pb-[18px] pt-[22px]">
      <div>
        <h1 className="mb-1 font-serif text-[26px] font-medium tracking-tight text-ink">
          {title}
        </h1>
        <div className="text-[13px] text-ink-soft">{subtitle}</div>
      </div>
      <UpdatedPill label="Diperbarui 12 menit lalu" />
    </div>
  );
}
