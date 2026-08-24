import { getInitials } from "@/lib/utils/getInitials";

interface EmployeeAvatarProps {
  name: string;
  size?: "sm" | "md";
}

/** Renders a circular avatar with the employee's initials. */
export function EmployeeAvatar({ name, size = "sm" }: EmployeeAvatarProps) {
  const dimension = size === "sm" ? "h-[30px] w-[30px] text-[11px]" : "h-[42px] w-[42px] text-sm";

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono font-semibold text-accent ${dimension}`}
    >
      {getInitials(name)}
    </div>
  );
}
