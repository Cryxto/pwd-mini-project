// components/EventStatistics.tsx

'use client';

import { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '@/stores/dashboard/dashboardContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Event } from '@/stores/dashboard/dashboardAnnotation';

// Register all necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EventStatistics = () => {
  const { state } = useContext(DashboardContext);
  const [chartData, setChartData] = useState<ChartData<'bar', number[]> | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (state.Organization?.Event) {
      const events = Array.isArray(state.Organization.Event)
        ? state.Organization.Event
        : [state.Organization.Event];

      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.heldAt);
        if (startDate && endDate) {
          return eventDate >= startDate && eventDate <= endDate;
        }
        return true;
      });

      const labels = filteredEvents.map(event => event.title);
      const data = filteredEvents.map(event => (Array.isArray(event.EventTransaction) ? event.EventTransaction.length : 1));

      setChartData({
        labels,
        datasets: [
          {
            label: 'Number of Transactions',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
    }
  }, [state.Organization, startDate, endDate]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Event Statistics</h2>
      <div className="mb-4 flex space-x-2">
        <DatePicker
          selected={startDate ?? undefined}  // Use nullish coalescing operator
          onChange={(date) => setStartDate(date as Date | null)}
          selectsStart
          startDate={startDate ?? undefined}  // Use nullish coalescing operator
          endDate={endDate ?? undefined}  // Use nullish coalescing operator
          placeholderText="Start Date"
          className="input input-bordered"
        />
        <DatePicker
          selected={endDate ?? undefined}  // Use nullish coalescing operator
          onChange={(date) => setEndDate(date as Date | null)}
          selectsEnd
          startDate={startDate ?? undefined}  // Use nullish coalescing operator
          endDate={endDate ?? undefined}  // Use nullish coalescing operator
          placeholderText="End Date"
          className="input input-bordered"
        />
      </div>
      {chartData && (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default EventStatistics;
