'use client';

interface ProgressBarProps {
  current: number;
  targetMin: number | null;
  targetMax: number | null;
}

export default function ProgressBar({ current, targetMin, targetMax }: ProgressBarProps) {
  // Calculate percentage based on max target
  const percentage = targetMax !== null && targetMax > 0 
    ? Math.min((current / targetMax) * 100, 100)
    : 0;
  
  // Determine status: within range, under min, or over max
  const isOver = targetMax !== null && current > targetMax;
  const isUnder = targetMin !== null && current < targetMin;
  const isWithin = targetMin !== null && targetMax !== null && current >= targetMin && current <= targetMax;
  
  // Determine color
  let barColor = 'bg-gray-400';
  if (isOver) barColor = 'bg-red-500';
  else if (isUnder) barColor = 'bg-yellow-500';
  else if (isWithin) barColor = 'bg-green-500';

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{current}g consumed</span>
        <span className="text-gray-600">
          {targetMin !== null && targetMax !== null
            ? `${targetMin}-${targetMax}g target`
            : 'No target set'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>{targetMax !== null ? percentage.toFixed(1) : '0.0'}%</span>
        {isOver && targetMax !== null && (
          <span className="text-red-600 font-medium">
            Over by {current - targetMax}g
          </span>
        )}
        {isUnder && targetMin !== null && (
          <span className="text-yellow-600 font-medium">
            Under by {targetMin - current}g
          </span>
        )}
        {isWithin && targetMax !== null && (
          <span className="text-green-600 font-medium">
            {targetMax - current}g remaining
          </span>
        )}
      </div>
    </div>
  );
}
