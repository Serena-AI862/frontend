'use client';

import { useEffect, useState } from 'react';
import { PhoneIcon, ClockIcon, StarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { DashboardData } from '@/types/dashboard';
import { getDashboardData } from '@/lib/api';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl w-full mx-4">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const StatCard = ({ title, value, change, icon }: { title: string; value: string; change: number; icon: React.ReactNode }) => {
    const isPositive = change > 0;
    const changeText = `${isPositive ? '+' : ''}${Math.abs(change)}% from last week`;
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[13px] text-gray-600 font-medium">{title}</div>
          <div className="text-gray-400">{icon}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-[32px] font-semibold mb-1 tracking-tight">{value}</div>
          <div className={`text-[13px] ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {changeText}
          </div>
        </div>
      </div>
    );
  };

  const CallVolumeChart = () => {
    // Fixed y-axis values from 0 to 10 with 2.5 increments
    const yAxisSteps = [0, 2.5, 5, 7.5, 10];
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Call Volume</h2>
        <p className="text-[13px] text-gray-500 mb-8">Number of calls throughout the past week</p>
        
        <div className="h-[280px] relative">
          {/* Chart container with padding for labels */}
          <div className="absolute inset-x-0 top-6 bottom-8 flex">
            {/* Y-axis labels */}
            <div className="w-12 relative">
              {yAxisSteps.reverse().map((value, index) => (
                <div 
                  key={value} 
                  className="absolute right-0 -translate-y-1/2 flex items-center"
                  style={{ 
                    top: `${(index * 100) / (yAxisSteps.length - 1)}%`
                  }}
                >
                  <span className="text-[13px] text-gray-500 pr-2">{value}</span>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="flex-1 relative ml-4">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {yAxisSteps.reverse().map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-full border-b border-gray-100"
                    style={{
                      top: `${(index * 100) / (yAxisSteps.length - 1)}%`,
                    }}
                  />
                ))}
              </div>

              {/* Line chart */}
              <div className="absolute inset-0">
                <svg className="w-full h-full">
                  {/* Line connecting points */}
                  <path
                    d={dashboardData.daily_stats.map((stat, index) => {
                      const x = (index / (dashboardData.daily_stats.length - 1)) * 100;
                      const y = 100 - (stat.calls / 10) * 100;
                      return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                    }).join(' ')}
                    className="stroke-gray-900 stroke-2 fill-none"
                  />
                  
                  {/* Data points */}
                  {dashboardData.daily_stats.map((stat, index) => {
                    const x = (index / (dashboardData.daily_stats.length - 1)) * 100;
                    const y = 100 - (stat.calls / 10) * 100;
                    const day = new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' });
                    
                    return (
                      <g key={index} className="group">
                        {/* Tooltip */}
                        <foreignObject
                          x={`${x}%`}
                          y={`${y}%`}
                          width="1"
                          height="1"
                          className="overflow-visible"
                          style={{ transform: 'translate(-50%, -100%)' }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg rounded-lg py-2 px-3 text-[13px] whitespace-nowrap absolute bottom-full mb-2">
                            <div className="font-medium">{day}</div>
                            <div className="text-gray-500">calls: {stat.calls}</div>
                          </div>
                        </foreignObject>
                        
                        {/* Data point */}
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          className="fill-gray-900"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="absolute inset-x-0 top-full flex justify-between mt-2">
                {dashboardData.daily_stats.map((stat, index) => {
                  const day = new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <span key={index} className="text-[13px] text-gray-500">
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getCallTypeStyles = (type: string) => {
    switch (type) {
      case 'Inquiry':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Complaint':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const getAppointmentStyles = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'text-emerald-600 flex items-center gap-1 before:content-[""] before:w-3 before:h-3 before:bg-emerald-500 before:rounded-full';
      case 'Not Booked':
        return 'text-red-600 flex items-center gap-1 before:content-[""] before:w-3 before:h-3 before:bg-red-500 before:rounded-full';
      default:
        return 'text-gray-600 flex items-center gap-1 before:content-[""] before:w-3 before:h-3 before:bg-gray-500 before:rounded-full';
    }
  };

  const RecentCallsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(dashboardData.recent_calls.length / itemsPerPage);
    
    const paginatedCalls = dashboardData.recent_calls.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Recent Calls</h2>
        <p className="text-[13px] text-gray-500 mb-6">Detailed information about recent calls</p>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by phone number..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Phone Number</th>
                <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Duration</th>
                <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Call Type</th>
                <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Appointment</th>
                <th className="px-6 py-3 bg-gray-50 border-y border-gray-100">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCalls.map((call, index) => (
                <tr key={index} className="text-[13px] hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{call.number}</td>
                  <td className="px-6 py-4 text-gray-900">{call.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium ${getCallTypeStyles(call.call_type)}`}>
                      {call.call_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex text-[13px] font-medium ${getAppointmentStyles(call.appointment === 'Yes' ? 'Booked' : 'Not Booked')}`}>
                      {call.appointment === 'Yes' ? 'Booked' : 'Not Booked'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= (call.rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-[13px] font-medium ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            <span className="text-[13px] text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-[13px] font-medium ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-5">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900">Serena AI Agent Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <StatCard
            title="Total Calls"
            value={dashboardData.total_calls.toString()}
            change={dashboardData.total_calls_change}
            icon={<PhoneIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Appointments Booked"
            value={dashboardData.appointments_booked.toString()}
            change={dashboardData.appointments_change}
            icon={<CalendarIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Avg. Call Duration"
            value={dashboardData.avg_call_duration}
            change={dashboardData.avg_call_duration_change}
            icon={<ClockIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Average Rating"
            value={dashboardData.avg_rating.toFixed(1)}
            change={dashboardData.avg_rating_change}
            icon={<StarIcon className="h-5 w-5" />}
          />
        </div>

        <div className="flex flex-col gap-5">
          <CallVolumeChart />
          <RecentCallsTable />
        </div>
      </div>
    </main>
  );
} 