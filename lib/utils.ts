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
  return meals.reduce((sum, meal) => sum + (meal.plannedMin || 0), 0);
}

export function calculateTotalPlannedMax(meals: MealData[]): number {
  return meals.reduce((sum, meal) => sum + (meal.plannedMax || 0), 0);
}

export function calculateRemaining(dayData: DayData): { min: number | null; max: number | null } {
  const totalActual = calculateTotalActual(dayData.meals);
  return {
    min: dayData.dailyTargetMin !== null ? dayData.dailyTargetMin - totalActual : null,
    max: dayData.dailyTargetMax !== null ? dayData.dailyTargetMax - totalActual : null,
  };
}

export function calculateProgress(dayData: DayData): number {
  const totalActual = calculateTotalActual(dayData.meals);
  const targetMax = dayData.dailyTargetMax;
  if (targetMax === null || targetMax === 0) return 0;
  return Math.min((totalActual / targetMax) * 100, 100);
}

export function isOverTarget(dayData: DayData): boolean {
  const totalActual = calculateTotalActual(dayData.meals);
  if (dayData.dailyTargetMax === null) return false;
  return totalActual > dayData.dailyTargetMax;
}

export function isUnderTarget(dayData: DayData): boolean {
  const totalActual = calculateTotalActual(dayData.meals);
  if (dayData.dailyTargetMin === null) return false;
  return totalActual < dayData.dailyTargetMin;
}

export function isWithinTarget(dayData: DayData): boolean {
  const totalActual = calculateTotalActual(dayData.meals);
  if (dayData.dailyTargetMin === null || dayData.dailyTargetMax === null) return false;
  return totalActual >= dayData.dailyTargetMin && totalActual <= dayData.dailyTargetMax;
}

export function getDayStatusColor(dayData: DayData | null): string {
  if (!dayData) return 'transparent';
  
  const totalActual = calculateTotalActual(dayData.meals);
  if (totalActual === 0) return 'transparent';
  
  // Three-color system: green (within), yellow (below min), red (above max)
  if (isOverTarget(dayData)) return '#ef4444'; // red
  if (isUnderTarget(dayData)) return '#eab308'; // yellow
  if (isWithinTarget(dayData)) return '#10b981'; // green
  
  return 'transparent';
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
