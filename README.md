# Daily Net Carbs Tracker

A mobile-responsive web application for tracking daily net carbs intake with meal planning, history, and calendar features.

## Features

- **8 Meal Categories**: Breakfast, Intra Workout, Post Workout, Lunch, Snack 1-3, Dinner
- **Planned vs Actual Tracking**: Set planned ranges and log actual carbs consumed
- **Calendar View**: Monthly calendar with color-coded daily totals (green for under target, red for over)
- **History View**: Browse and review past days' tracking data
- **Settings**: Configure daily target and default planned ranges
- **Data Management**: Copy data from previous days, reset days, export/import data
- **Progressive Web App**: Add to home screen on mobile devices
- **Local Storage**: All data persists in the browser (no backend needed)

## Tech Stack

- **Next.js 14+** with App Router
- **React 18+** with hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **localStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/solikiev/carbs.git
cd carbs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/solikiev/carbs)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

4. For production deployment:
```bash
vercel --prod
```

### Vercel Dashboard Deployment

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration
5. Click "Deploy"

## Usage

### Daily Tracking

1. Set your daily target in Settings (default: 150g)
2. Set planned ranges for each meal
3. Log actual carbs after eating
4. Mark meals as done
5. View progress toward daily goal

### Calendar

- View monthly overview of tracked days
- Green days are at or below target
- Red days exceed target
- Click any day to see detailed breakdown

### History

- Browse past days with logged data
- View detailed meal breakdown
- Delete days if needed

### Data Management

- **Copy from Day**: Copy planned or actual values from a previous day
- **Reset Day**: Clear all meals for the current day
- **Export/Import**: Backup or transfer data between devices

## Mobile Usage

The app is optimized for mobile devices:
- Touch-friendly buttons (minimum 44px)
- Number inputs optimized for mobile keyboards
- Responsive design that adapts to screen size
- Can be added to home screen as PWA

To add to home screen:
- **iOS**: Tap Share button → "Add to Home Screen"
- **Android**: Tap Menu → "Add to Home Screen"

## Local Storage

All data is stored locally in your browser:
- No account required
- No internet connection needed (after initial load)
- Data persists across sessions
- Use Export/Import to backup or transfer data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.