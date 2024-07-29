import { Dashboard } from '@/components/Dashboard';
import { DashboardHidrator } from '@/components/DashboardHidrator';

import { DashboardProvider } from '@/stores/dashboard/dashboardProvider';

export default function page() {
  return (
    <>
      <DashboardProvider>
        <DashboardHidrator>
          <Dashboard />
        </DashboardHidrator>
      </DashboardProvider>
    </>
  );
}
