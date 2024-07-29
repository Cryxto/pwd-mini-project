// components/Dashboard.tsx

'use client';

import { DashboardContext } from '@/stores/dashboard/dashboardContext';
import { useContext, useState } from 'react';
import EventList from './EventList';
import EventStatistics from './EventStatistics';

export function Dashboard() {
  const { state } = useContext(DashboardContext);
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="flex justify-center mx-10 my-10">
      <div role="tablist" className="tabs tabs-lifted max-w-full w-full">
        {/* Events Tab */}
        <input
          type="radio"
          name="dashboard_tabs"
          role="tab"
          className="tab font-bold"
          aria-label="Events"
          checked={activeTab === 'events'}
          onChange={() => setActiveTab('events')}
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full"
        >
          {/* Tab content 1 */}
          {activeTab === 'events' && <EventList />}

        </div>
        {/* Statistics Tab */}
        <input
          type="radio"
          name="dashboard_tabs"
          role="tab"
          className="tab font-bold"
          aria-label="Statistics"
          checked={activeTab === 'statistics'}
          onChange={() => setActiveTab('statistics')}
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full"
        >
          {activeTab === 'statistics' && <EventStatistics />}
        </div>
      </div>
    </div>
  );
}
