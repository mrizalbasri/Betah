interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Explains what went wrong when a request to the backend fails, with an optional retry action. */
export function ErrorState({
  message = "Gagal memuat data dari server.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm text-signal-high">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border border-line bg-panel px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
