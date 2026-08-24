"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SelectedEmployeeContextValue {
  selectedEmployeeId: string | null;
  selectEmployee: (id: string) => void;
}

const SelectedEmployeeContext = createContext<
  SelectedEmployeeContextValue | undefined
>(undefined);

export function SelectedEmployeeProvider({
  children,
  initialEmployeeId = null,
}: {
  children: ReactNode;
  initialEmployeeId?: string | null;
}) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    initialEmployeeId
  );

  return (
    <SelectedEmployeeContext.Provider
      value={{
        selectedEmployeeId,
        selectEmployee: setSelectedEmployeeId,
      }}
    >
      {children}
    </SelectedEmployeeContext.Provider>
  );
}

/** Access the currently selected employee id and its setter. Must be used within SelectedEmployeeProvider. */
export function useSelectedEmployee(): SelectedEmployeeContextValue {
  const context = useContext(SelectedEmployeeContext);
  if (!context) {
    throw new Error(
      "useSelectedEmployee must be used within a SelectedEmployeeProvider"
    );
  }
  return context;
}
