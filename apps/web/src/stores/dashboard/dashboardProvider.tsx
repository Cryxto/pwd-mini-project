"use client"
import { ReactNode, useReducer, useState } from 'react';
import { dashboardReducer } from './dashboardReducer';
import { initialDashboardState } from './dashboardAnnotation';
import { DashboardContext } from './dashboardContext';


export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const [loading, setLoading] = useState(true);

  return (
    <DashboardContext.Provider value={{ state, dispatch, loading, setLoading }}>
      {children}
    </DashboardContext.Provider>
  );
};
