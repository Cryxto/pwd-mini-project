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

// Register all necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const granularityOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

const EventStatistics = () => {
  const { state } = useContext(DashboardContext);
  const [chartData, setChartData] = useState<ChartData<'bar', number[]> | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (state.Organization?.Event) {
      const events = Array.isArray(state.Organization.Event)
        ? state.Organization.Event
        : [state.Organization.Event];

      // Filter events by date range
      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.heldAt);
        if (startDate && endDate) {
          return eventDate >= startDate && eventDate <= endDate;
        }
        return true;
      });

      // Aggregate data
      const aggregateData = filteredEvents.reduce((acc: { [key: string]: number }, event) => {
        const transactions = Array.isArray(event.EventTransaction) ? event.EventTransaction : [event.EventTransaction];
        transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.paidAt);
          const key = getKey(transactionDate, granularity);
          acc[key] = (acc[key] || 0) + 1; // Count transactions
        });
        return acc;
      }, {});

      // Prepare chart data
      const labels = Object.keys(aggregateData);
      const data = Object.values(aggregateData);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Average Transactions',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
    }
  }, [state.Organization, startDate, endDate, granularity]);

  const getKey = (date: Date, granularity: 'day' | 'week' | 'month' | 'year') => {
    switch (granularity) {
      case 'day':
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      case 'week':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        return startOfWeek.toISOString().split('T')[0]; // Start of the week YYYY-MM-DD
      case 'month':
        return `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-M
      case 'year':
        return date.getFullYear().toString(); // YYYY
      default:
        return '';
    }
  };

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Event Statistics</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <DatePicker
          selected={startDate ?? undefined}  // Use nullish coalescing operator
          onChange={(date) => setStartDate(date as Date | null)}
          selectsStart
          startDate={startDate ?? undefined}  // Use nullish coalescing operator
          endDate={endDate ?? undefined}  // Use nullish coalescing operator
          placeholderText="Start Date"
          className="input input-bordered w-full max-w-xs"
        />
        <DatePicker
          selected={endDate ?? undefined}  // Use nullish coalescing operator
          onChange={(date) => setEndDate(date as Date | null)}
          selectsEnd
          startDate={startDate ?? undefined}  // Use nullish coalescing operator
          endDate={endDate ?? undefined}  // Use nullish coalescing operator
          placeholderText="End Date"
          className="input input-bordered w-full max-w-xs"
        />
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as 'day' | 'week' | 'month' | 'year')}
          className="select select-bordered w-full max-w-xs"
        >
          {granularityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {chartData && (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default EventStatistics;
