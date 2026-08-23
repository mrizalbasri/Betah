/** Extracts up to two uppercase initials from a full name, e.g. "Budi Santoso" -> "BS". */
export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("");
}
