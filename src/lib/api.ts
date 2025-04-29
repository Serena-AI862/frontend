import { DashboardData } from '@/types/dashboard';

// Get the API URL from environment variable, fallback to localhost in development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getDashboardData(): Promise<DashboardData> {
  const url = `${API_BASE_URL}/api/v1/dashboard`;
  console.log('Fetching from:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorInfo = {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorData
      };
      console.error('API Error:', errorInfo);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', {
      url,
      error: error instanceof Error ? error.message : error
    });
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
  }
} 