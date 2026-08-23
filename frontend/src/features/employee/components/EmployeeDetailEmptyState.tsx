/** Placeholder shown in the detail panel before any employee row has been clicked. */
export function EmployeeDetailEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-5 py-16 text-center text-ink-soft">
      <p className="text-sm">Pilih karyawan dari tabel</p>
      <p className="text-xs">
        Klik salah satu baris untuk melihat detail risiko dan faktor SHAP.
      </p>
    </div>
  );
}
