// app/dashboard/DashboardContext.tsx => Jiehoon Lee
"use client";

import React, { createContext, useContext, useState } from "react";

interface DashboardContextType {
  selectedTaskListId: string | null;
  setSelectedTaskListId: (id: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [selectedTaskListId, setSelectedTaskListId] = useState<string | null>(
    null
  );

  return (
    <DashboardContext.Provider
      value={{ selectedTaskListId, setSelectedTaskListId }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
