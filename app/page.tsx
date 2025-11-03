'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { DayData } from '@/lib/types';
import { getTodayString, formatDisplayDate } from '@/lib/utils';
import MealCard from '@/components/MealCard';
import ProgressBar from '@/components/ProgressBar';
import DaySummary from '@/components/DaySummary';
import { calculateTotalActual } from '@/lib/utils';

export default function Home() {
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  useEffect(() => {
    loadDayData(selectedDate);
  }, [selectedDate]);

  const loadDayData = (date: string) => {
    let data = storage.getDayData(date);
    if (!data) {
      data = storage.createEmptyDayData(date);
      storage.saveDayData(data);
    }
    setDayData(data);
  };

  const handleUpdateMeal = (mealIndex: number, updates: Partial<DayData['meals'][0]>) => {
    if (!dayData) return;

    const updatedMeals = [...dayData.meals];
    updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], ...updates };

    const updatedDayData = { ...dayData, meals: updatedMeals };
    setDayData(updatedDayData);
    storage.saveDayData(updatedDayData);
  };

  const handleResetDay = () => {
    if (!dayData) return;
    
    if (confirm('Are you sure you want to reset all meals for this day?')) {
      const resetDayData = storage.createEmptyDayData(dayData.date);
      setDayData(resetDayData);
      storage.saveDayData(resetDayData);
    }
  };

  const handleCopyFromDay = async () => {
    const dateStr = prompt('Enter date to copy from (YYYY-MM-DD):');
    if (!dateStr) return;

    const sourceDayData = storage.getDayData(dateStr);
    if (!sourceDayData) {
      alert('No data found for that date');
      return;
    }

    const copyType = confirm('Copy ACTUAL values? (Cancel to copy PLANNED values)');
    
    if (!dayData) return;

    const updatedMeals = dayData.meals.map((meal, index) => {
      const sourceMeal = sourceDayData.meals[index];
      if (copyType) {
        // Copy actual values
        return {
          ...meal,
          actual: sourceMeal.actual,
          isDone: sourceMeal.isDone,
        };
      } else {
        // Copy planned values
        return {
          ...meal,
          plannedMin: sourceMeal.plannedMin,
          plannedMax: sourceMeal.plannedMax,
        };
      }
    });

    const updatedDayData = { ...dayData, meals: updatedMeals };
    setDayData(updatedDayData);
    storage.saveDayData(updatedDayData);
  };

  if (!dayData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const totalActual = calculateTotalActual(dayData.meals);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Carbs Tracker</h1>
        <p className="text-gray-600">{formatDisplayDate(selectedDate)}</p>
      </div>

      <div className="mb-6">
        <ProgressBar 
          current={totalActual} 
          targetMin={dayData.dailyTargetMin} 
          targetMax={dayData.dailyTargetMax} 
        />
      </div>

      <div className="mb-6">
        <DaySummary dayData={dayData} />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleResetDay}
          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 min-h-[48px]"
        >
          Reset Day
        </button>
        <button
          onClick={handleCopyFromDay}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 min-h-[48px]"
        >
          Copy from Day
        </button>
      </div>

      <div className="space-y-4">
        {dayData.meals.map((meal, index) => (
          <MealCard
            key={meal.type}
            meal={meal}
            onUpdateActual={(actual) => handleUpdateMeal(index, { actual })}
            onToggleDone={() => handleUpdateMeal(index, { isDone: !meal.isDone })}
            onUpdatePlanned={(min, max) =>
              handleUpdateMeal(index, { plannedMin: min, plannedMax: max })
            }
          />
        ))}
      </div>
    </div>
  );
}
