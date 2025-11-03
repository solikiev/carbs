'use client';

import { MealData, MEAL_LABELS } from '@/lib/types';

interface MealCardProps {
  meal: MealData;
  onUpdateActual: (actual: number | null) => void;
  onToggleDone: () => void;
  onUpdatePlanned: (min: number, max: number) => void;
}

export default function MealCard({ meal, onUpdateActual, onToggleDone, onUpdatePlanned }: MealCardProps) {
  const handleActualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onUpdateActual(null);
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 0) {
        onUpdateActual(num);
      }
    }
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      onUpdatePlanned(num, meal.plannedMax);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      onUpdatePlanned(meal.plannedMin, num);
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${meal.isDone ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300'}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{MEAL_LABELS[meal.type]}</h3>
        <button
          onClick={onToggleDone}
          className={`px-3 py-1 rounded text-sm font-medium min-h-[44px] ${
            meal.isDone
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {meal.isDone ? '✓ Done' : 'Mark Done'}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Planned Range
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={meal.plannedMin}
              onChange={handleMinChange}
              className="w-20 px-3 py-2 border border-gray-300 rounded text-center min-h-[44px]"
              min="0"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={meal.plannedMax}
              onChange={handleMaxChange}
              className="w-20 px-3 py-2 border border-gray-300 rounded text-center min-h-[44px]"
              min="0"
            />
            <span className="text-gray-700 text-sm">g</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actual Carbs
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={meal.actual ?? ''}
              onChange={handleActualChange}
              placeholder="Enter carbs"
              className="flex-1 px-3 py-2 border border-gray-300 rounded min-h-[44px]"
              min="0"
            />
            <span className="text-gray-700 text-sm">g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
