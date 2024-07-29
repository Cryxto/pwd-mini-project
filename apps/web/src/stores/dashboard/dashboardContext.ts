'use client';

import { Dispatch, createContext } from 'react';
import { DashboardActionType, DashboardInterface, Organization, initialDashboardState } from './dashboardAnnotation';


interface DashboardContextInterface {
  state: DashboardInterface;
  dispatch: Dispatch<DashboardActionType>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const DashboardContext = createContext<DashboardContextInterface>({
  state: initialDashboardState,
  dispatch: () => undefined,
  loading: true,
  setLoading: () => undefined,
});
