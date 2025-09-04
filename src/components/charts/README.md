# Chart Components for DefendSphere Dashboard

This directory contains reusable chart components for the DefendSphere dashboard.

## Components

### 1. SecurityHealthChart
A circular progress chart showing security health percentage.

**Props:**
- `percentage: number` - Security health percentage (0-100)
- `size?: number` - Chart size in pixels (default: 200)
- `strokeWidth?: number` - Stroke width (default: 12)

**Features:**
- Color-coded based on percentage (green: 80%+, yellow: 60-79%, orange: 40-59%, red: <40%)
- Smooth animations
- Responsive design

### 2. ProblemsOverview
A list of problem indicators with circular badges.

**Props:**
- `data: ProblemData[]` - Array of problem data

**ProblemData interface:**
```typescript
interface ProblemData {
  label: string;
  value: number;
  color: string;
}
```

**Features:**
- Color-coded problem types
- Visual indicators for each problem level
- Responsive layout

### 3. HealthTrendChart
A line chart showing health trends over time.

**Props:**
- `data: HealthData[]` - Array of health data points

**HealthData interface:**
```typescript
interface HealthData {
  date: string;
  health: number;
}
```

**Features:**
- Interactive data points
- Color-coded health levels
- Grid lines and legends
- Smooth animations

### 4. CriticalLevelsChart
A horizontal stacked bar chart showing critical levels by element.

**Props:**
- `data: CriticalLevelData[]` - Array of critical level data

**CriticalLevelData interface:**
```typescript
interface CriticalLevelData {
  element: string;
  green: number;
  yellow: number;
  red: number;
}
```

**Features:**
- Stacked horizontal bars
- Color-coded risk levels (green: low, yellow: medium, red: high)
- Interactive tooltips
- Summary statistics

## Usage Examples

### Security Health Chart
```tsx
import SecurityHealthChart from '../components/charts/SecurityHealthChart';

<SecurityHealthChart percentage={75} />
```

### Problems Overview
```tsx
import ProblemsOverview from '../components/charts/ProblemsOverview';

const problemsData = [
  { label: 'Critical Problems', value: 5, color: 'bg-red-500' },
  { label: 'High Problems', value: 12, color: 'bg-orange-500' },
  // ... more data
];

<ProblemsOverview data={problemsData} />
```

### Health Trend Chart
```tsx
import HealthTrendChart from '../components/charts/HealthTrendChart';

const healthData = [
  { date: '2025-08-01', health: 60 },
  { date: '2025-08-10', health: 40 },
  // ... more data
];

<HealthTrendChart data={healthData} />
```

### Critical Levels Chart
```tsx
import CriticalLevelsChart from '../components/charts/CriticalLevelsChart';

const criticalData = [
  {
    element: 'Assets',
    green: 20,
    yellow: 10,
    red: 5
  },
  // ... more data
];

<CriticalLevelsChart data={criticalData} />
```

## Styling

All components use Tailwind CSS classes and follow the DefendSphere design system:
- Primary colors: `#56a3d9` (blue), `#134876` (dark blue)
- Status colors: `#10b981` (green), `#f59e0b` (yellow), `#f97316` (orange), `#ef4444` (red)
- Consistent spacing and typography
- Smooth transitions and hover effects

## Responsiveness

Components are designed to be responsive:
- Mobile-first approach
- Flexible layouts that adapt to different screen sizes
- Touch-friendly interactions on mobile devices

## Accessibility

Components include accessibility features:
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast color schemes
- Screen reader friendly text alternatives

---

**Версия**: 1.0.0  
**Последнее обновление**: Сентябрь 2025  
**Автор**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"