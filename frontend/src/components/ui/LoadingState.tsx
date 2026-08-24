import { Spinner } from "@/components/ui/Spinner";

/** Centered loading indicator with a message, filling its parent container. */
export function LoadingState({ message = "Memuat data..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
      <Spinner />
      <p className="text-sm">{message}</p>
    </div>
  );
}
