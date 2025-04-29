export interface DashboardData {
  total_calls: number;
  total_calls_change: number;
  appointments_booked: number;
  appointments_change: number;
  avg_call_duration: string;
  avg_call_duration_change: number;
  avg_rating: number;
  avg_rating_change: number;
  daily_stats: Array<{
    date: string;
    calls: number;
    appointments: number;
    duration: number;
    rating: number;
  }>;
  recent_calls: Array<{
    number: string;
    call_type: string;
    appointment: string;
    rating: number;
    duration: string;
  }>;
} 