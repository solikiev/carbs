'use client';

import { DayData } from '@/lib/types';
import {
  calculateTotalActual,
  calculateTotalPlannedMin,
  calculateTotalPlannedMax,
  isOverTarget,
  isUnderTarget,
  isWithinTarget,
} from '@/lib/utils';

interface DaySummaryProps {
  dayData: DayData;
}

export default function DaySummary({ dayData }: DaySummaryProps) {
  const totalActual = calculateTotalActual(dayData.meals);
  const totalPlannedMin = calculateTotalPlannedMin(dayData.meals);
  const totalPlannedMax = calculateTotalPlannedMax(dayData.meals);
  
  const hasTargetRange = dayData.dailyTargetMin !== null && dayData.dailyTargetMax !== null;
  
  let status = 'Not Set';
  let statusColor = 'text-gray-600';
  let remaining = 0;
  
  if (hasTargetRange) {
    if (isOverTarget(dayData)) {
      status = 'Above Target';
      statusColor = 'text-red-600';
      remaining = dayData.dailyTargetMax! - totalActual;
    } else if (isUnderTarget(dayData)) {
      status = 'Below Target';
      statusColor = 'text-yellow-600';
      remaining = dayData.dailyTargetMin! - totalActual;
    } else if (isWithinTarget(dayData)) {
      status = 'Within Target';
      statusColor = 'text-green-600';
      remaining = dayData.dailyTargetMax! - totalActual;
    }
  }

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
          <p className="text-xl font-bold text-gray-800">
            {hasTargetRange 
              ? `${dayData.dailyTargetMin}-${dayData.dailyTargetMax}g`
              : 'Not Set'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Actual</p>
          <p className="text-xl font-bold text-blue-600">{totalActual}g</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className={`text-xl font-bold ${statusColor}`}>
            {status}
          </p>
        </div>
        {hasTargetRange && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600">
              {remaining < 0 ? 'Over by' : 'Remaining to max'}
            </p>
            <p className={`text-lg font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {Math.abs(remaining)}g
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
