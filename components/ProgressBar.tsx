'use client';

interface ProgressBarProps {
  current: number;
  target: number;
}

export default function ProgressBar({ current, target }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOver = current > target;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{current}g consumed</span>
        <span className="text-gray-600">{target}g target</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isOver ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>{percentage.toFixed(1)}%</span>
        {isOver && (
          <span className="text-red-600 font-medium">
            Over by {current - target}g
          </span>
        )}
        {!isOver && current > 0 && (
          <span className="text-green-600 font-medium">
            {target - current}g remaining
          </span>
        )}
      </div>
    </div>
  );
}
