'use client';

import { getDashboardData } from '@/server.actions';
import { Organization } from '@/stores/dashboard/dashboardAnnotation';
import { DashboardContext } from '@/stores/dashboard/dashboardContext';
import { useEffect, useContext, ReactNode } from 'react';

export const DashboardHidrator = ({ children }: { children: ReactNode }) => {
  const { state, dispatch, setLoading } = useContext(DashboardContext);

  useEffect(() => {
    const hidrating = async () => {
      const dashBoardData = await getDashboardData();
      setLoading(false); // Set loading to false after checking authentication
      console.log(dashBoardData.data);

      dispatch({
        type: 'POPULATE',
        payload: dashBoardData.data as Organization,
      });
    };

    hidrating();
  }, [dispatch, setLoading]);

  return <>{children}</>;
};
