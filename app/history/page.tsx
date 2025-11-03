'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { DayData } from '@/lib/types';
import { formatDisplayDate, calculateTotalActual, isOverTarget } from '@/lib/utils';

export default function HistoryPage() {
  const [allDays, setAllDays] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const days = storage.getAllDays();
    const daysList = Object.values(days)
      .filter((day) => calculateTotalActual(day.meals) > 0)
      .sort((a, b) => b.date.localeCompare(a.date));
    setAllDays(daysList);
  };

  const handleDeleteDay = (date: string) => {
    if (confirm('Are you sure you want to delete this day?')) {
      storage.deleteDayData(date);
      loadHistory();
      if (selectedDay?.date === date) {
        setSelectedDay(null);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">History</h1>

      {allDays.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No history data yet. Start tracking your meals!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allDays.map((day) => {
            const totalActual = calculateTotalActual(day.meals);
            const isOver = isOverTarget(day);

            return (
              <div
                key={day.date}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setSelectedDay(selectedDay?.date === day.date ? null : day)}
                  className="w-full p-4 text-left hover:bg-gray-50 min-h-[60px]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {formatDisplayDate(day.date)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {totalActual}g / {day.dailyTarget}g
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isOver ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      />
                      <span className="text-gray-400">
                        {selectedDay?.date === day.date ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>
                </button>

                {selectedDay?.date === day.date && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="space-y-3 mb-4">
                      {day.meals.map((meal) => {
                        if (meal.actual === null || meal.actual === 0) return null;

                        const mealName = meal.type
                          .split('-')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');

                        return (
                          <div
                            key={meal.type}
                            className="flex justify-between items-center p-3 bg-white rounded"
                          >
                            <span className="font-medium">{mealName}</span>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                Planned: {meal.plannedMin}-{meal.plannedMax}g
                              </div>
                              <div className="text-sm font-semibold">
                                Actual: {meal.actual}g
                                {meal.isDone && (
                                  <span className="text-green-600 ml-2">✓</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleDeleteDay(day.date)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 min-h-[44px]"
                    >
                      Delete Day
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
