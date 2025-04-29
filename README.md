# Serena AI Agent Dashboard Frontend

A modern, responsive dashboard built with Next.js 13+ and Tailwind CSS to display AI agent call statistics and metrics.

## Project Structure

```
dashboard/frontend/
├── src/                    # Source directory
│   ├── app/               # Next.js 13+ app directory
│   │   ├── page.tsx      # Main dashboard page
│   │   ├── layout.tsx    # App layout
│   │   └── globals.css   # Global styles
│   ├── lib/              # Utility functions
│   │   └── api.ts       # API functions
│   └── types/            # Type definitions
│       └── dashboard.ts  # Dashboard types
├── node_modules/          # Dependencies
├── .next/                # Next.js build output
├── package.json          # Project configuration
├── package-lock.json     # Dependency lock file
├── tailwind.config.ts    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
├── next-env.d.ts        # Next.js TypeScript definitions
└── .env.frontend        # Environment variables
```

## Features

- Real-time dashboard metrics
- Interactive call volume visualization
- Detailed recent calls table with search functionality
- Time range filtering (Day/Week/Month)
- Responsive design for all screen sizes

## Key Components

1. **StatCard**: Displays key metrics with change indicators
2. **CallVolumeChart**: Visual representation of call volume over time
3. **RecentCallsTable**: Detailed view of recent calls with search capability
4. **TimeRangeSelector**: Toggle between different time ranges

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env.frontend` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Type Safety**: TypeScript
- **API Integration**: Native Fetch API

## Development Guidelines

1. **Component Organization**:
   - All components are co-located in the main page for better maintainability
   - Shared types are in `types/dashboard.ts`
   - API functions are centralized in `lib/api.ts`

2. **Styling**:
   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Maintain consistent spacing and color schemes

3. **Data Fetching**:
   - Use the centralized API functions from `lib/api.ts`
   - Handle loading and error states appropriately
   - Implement proper TypeScript types for all data

4. **State Management**:
   - Use React hooks for local state
   - Implement proper loading and error handling
   - Maintain type safety throughout the application

## API Integration

The dashboard connects to a backend API with the following endpoints:

```typescript
// Fetch dashboard data
GET /api/v1/dashboard?timeRange={day|week|month}
```

Response type follows the `DashboardData` interface defined in `types/dashboard.ts`.