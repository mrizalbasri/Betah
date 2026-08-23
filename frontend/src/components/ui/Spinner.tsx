/** Small inline loading spinner for async states. */
export function Spinner() {
  return (
    <div
      role="status"
      aria-label="Memuat"
      className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent"
    />
  );
}
