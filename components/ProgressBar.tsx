'use client';

interface ProgressBarProps {
  current: number;
  targetMin: number | null;
  targetMax: number | null;
}

export default function ProgressBar({ current, targetMin, targetMax }: ProgressBarProps) {
  const hasTarget = targetMin !== null && targetMax !== null;
  
  if (!hasTarget) {
    return (
      <div className="w-full">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">{current}g consumed</span>
          <span className="text-gray-600">No target set</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div className="h-full bg-gray-400" style={{ width: '0%' }} />
        </div>
      </div>
    );
  }
  
  const percentage = Math.min((current / targetMax) * 100, 100);
  const isOver = current > targetMax;
  const isUnder = current < targetMin;
  const isWithin = current >= targetMin && current <= targetMax;

  let barColor = 'bg-gray-400';
  if (isOver) {
    barColor = 'bg-red-500';
  } else if (isWithin) {
    barColor = 'bg-green-500';
  } else if (isUnder) {
    barColor = 'bg-yellow-500';
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{current}g consumed</span>
        <span className="text-gray-600">{targetMin}-{targetMax}g target</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>{percentage.toFixed(1)}%</span>
        {isOver && (
          <span className="text-red-600 font-medium">
            Over by {current - targetMax}g
          </span>
        )}
        {isWithin && (
          <span className="text-green-600 font-medium">
            Within target range
          </span>
        )}
        {isUnder && (
          <span className="text-yellow-600 font-medium">
            {targetMin - current}g below minimum
          </span>
        )}
      </div>
    </div>
  );
}
