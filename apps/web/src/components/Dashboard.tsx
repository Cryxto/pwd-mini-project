// components/Dashboard.tsx

'use client';

import { DashboardContext } from '@/stores/dashboard/dashboardContext';
import { useContext, useState } from 'react';
import EventList from './EventList';
import EventStatistics from './EventStatistics';

export function Dashboard() {
  const { state } = useContext(DashboardContext);
  const [activeTab, setActiveTab] = useState<'events' | 'statistics'>('events');

  // Helper function to safely access event length
  const getEventLength = () => {
    const events = state.Organization?.Event;
    if (!events) return 0;
    return Array.isArray(events) ? events.length : 1;
  };

  return (
    <div className="flex flex-col items-center mx-10 my-10">
      <div role="tablist" className="tabs tabs-boxed">
        <button
          role="tab"
          aria-controls="events-tab"
          aria-selected={activeTab === 'events'}
          className={`tab ${activeTab === 'events' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          role="tab"
          aria-controls="statistics-tab"
          aria-selected={activeTab === 'statistics'}
          className={`tab ${activeTab === 'statistics' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
      </div>
      <div id="events-tab" role="tabpanel" className={`tab-content bg-base-100 border-base-300 rounded-box p-6 w-full ${activeTab === 'events' ? 'block' : 'hidden'}`}>
        {activeTab === 'events' && <EventList />}
      </div>
      <div id="statistics-tab" role="tabpanel" className={`tab-content bg-base-100 border-base-300 rounded-box p-6 w-full ${activeTab === 'statistics' ? 'block' : 'hidden'}`}>
        {activeTab === 'statistics' && <EventStatistics />}
      </div>
    </div>
  );
}
