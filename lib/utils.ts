import { DayData, MealData } from './types';

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
    days.push(new Date(date));
  }
  
  return days;
}

export function getCalendarGrid(year: number, month: number): (Date | null)[] {
  const days = getMonthDays(year, month);
  const firstDayOfWeek = days[0].getDay();
  const grid: (Date | null)[] = Array(firstDayOfWeek).fill(null);
  
  return [...grid, ...days];
}

export function calculateTotalActual(meals: MealData[]): number {
  return meals.reduce((sum, meal) => sum + (meal.actual || 0), 0);
}

export function calculateTotalPlannedMin(meals: MealData[]): number {
  return meals.reduce((sum, meal) => sum + (meal.plannedMin ?? 0), 0);
}

export function calculateTotalPlannedMax(meals: MealData[]): number {
  return meals.reduce((sum, meal) => sum + (meal.plannedMax ?? 0), 0);
}

export function calculateRemaining(dayData: DayData): number {
  const totalActual = calculateTotalActual(dayData.meals);
  // Use max target for remaining calculation, or 0 if not set
  const target = dayData.dailyTargetMax ?? 0;
  return target - totalActual;
}

export function calculateProgress(dayData: DayData): number {
  const totalActual = calculateTotalActual(dayData.meals);
  const target = dayData.dailyTargetMax ?? 0;
  if (target === 0) return 0;
  return Math.min((totalActual / target) * 100, 100);
}

export function isOverTarget(dayData: DayData): boolean {
  const totalActual = calculateTotalActual(dayData.meals);
  const max = dayData.dailyTargetMax;
  if (max === null) return false;
  return totalActual > max;
}

export function isUnderTarget(dayData: DayData): boolean {
  const totalActual = calculateTotalActual(dayData.meals);
  const min = dayData.dailyTargetMin;
  if (min === null) return false;
  return totalActual < min;
}

export function isWithinTarget(dayData: DayData): boolean {
  const totalActual = calculateTotalActual(dayData.meals);
  const min = dayData.dailyTargetMin;
  const max = dayData.dailyTargetMax;
  if (min === null || max === null) return false;
  return totalActual >= min && totalActual <= max;
}

export function getDayStatusColor(dayData: DayData | null): string {
  if (!dayData) return 'transparent';
  
  const totalActual = calculateTotalActual(dayData.meals);
  if (totalActual === 0) return 'transparent';
  
  // If no target range is set, return transparent
  if (dayData.dailyTargetMin === null || dayData.dailyTargetMax === null) {
    return 'transparent';
  }
  
  // Red: over max
  if (totalActual > dayData.dailyTargetMax) {
    return '#ef4444';
  }
  
  // Yellow/Orange: under min
  if (totalActual < dayData.dailyTargetMin) {
    return '#f59e0b';
  }
  
  // Green: within range
  return '#10b981';
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

export function formatDisplayDate(dateString: string): string {
  const date = parseDate(dateString);
  const month = getMonthName(date.getMonth());
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
