'use client';

import { DayData } from '@/lib/types';
import {
  calculateTotalActual,
  calculateTotalPlannedMin,
  calculateTotalPlannedMax,
} from '@/lib/utils';

interface DaySummaryProps {
  dayData: DayData;
}

export default function DaySummary({ dayData }: DaySummaryProps) {
  const totalActual = calculateTotalActual(dayData.meals);
  const totalPlannedMin = calculateTotalPlannedMin(dayData.meals);
  const totalPlannedMax = calculateTotalPlannedMax(dayData.meals);
  const remaining = dayData.dailyTarget - totalActual;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Planned Range</p>
          <p className="text-xl font-bold text-gray-800">
            {totalPlannedMin}-{totalPlannedMax}g
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Daily Target</p>
          <p className="text-xl font-bold text-gray-800">{dayData.dailyTarget}g</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Actual</p>
          <p className="text-xl font-bold text-blue-600">{totalActual}g</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Remaining</p>
          <p className={`text-xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {remaining}g
          </p>
        </div>
      </div>
    </div>
  );
}
