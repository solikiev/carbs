'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { DayData } from '@/lib/types';
import {
  getCalendarGrid,
  formatDate,
  getDayStatusColor,
  getMonthName,
  calculateTotalActual,
  formatDisplayDate,
} from '@/lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allDays, setAllDays] = useState<Record<string, DayData>>({});
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    setAllDays(storage.getAllDays());
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = getCalendarGrid(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (date: Date) => {
    const dateString = formatDate(date);
    const dayData = allDays[dateString];
    setSelectedDay(dayData || null);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendar</h1>

      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 min-h-[44px]"
          >
            ← Prev
          </button>
          <h2 className="text-xl font-semibold">
            {getMonthName(month)} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 min-h-[44px]"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateString = formatDate(date);
            const dayData = allDays[dateString];
            const backgroundColor = getDayStatusColor(dayData);
            const isToday = dateString === formatDate(new Date());

            return (
              <button
                key={dateString}
                onClick={() => handleDayClick(date)}
                className={`aspect-square flex items-center justify-center rounded-lg font-medium text-sm transition-colors min-h-[44px] ${
                  isToday ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  backgroundColor: backgroundColor,
                  color: backgroundColor !== 'transparent' ? 'white' : 'inherit',
                }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Under target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Over target</span>
          </div>
        </div>
      </div>

      {selectedDay && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-semibold mb-4">
            {formatDisplayDate(selectedDay.date)}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Daily Target</p>
              <p className="text-2xl font-bold text-gray-800">{selectedDay.dailyTarget}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Actual</p>
              <p className="text-2xl font-bold text-blue-600">
                {calculateTotalActual(selectedDay.meals)}g
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Meals</h4>
            {selectedDay.meals.map((meal) => {
              const mealName = meal.type
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

              return (
                <div
                  key={meal.type}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <span className="font-medium">{mealName}</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Planned: {meal.plannedMin}-{meal.plannedMax}g
                    </div>
                    <div className="text-sm font-semibold">
                      Actual: {meal.actual ?? '-'}g
                      {meal.isDone && <span className="text-green-600 ml-2">✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
