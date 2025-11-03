export type MealType = 
  | 'breakfast'
  | 'intra-workout'
  | 'post-workout'
  | 'lunch'
  | 'snack-1'
  | 'snack-2'
  | 'snack-3'
  | 'dinner';

export interface MealData {
  type: MealType;
  plannedMin: number;
  plannedMax: number;
  actual: number | null;
  isDone: boolean;
}

export interface DayData {
  date: string; // YYYY-MM-DD format
  dailyTarget: number;
  meals: MealData[];
}

export interface AppSettings {
  dailyTarget: number;
  defaultPlannedRanges: Record<MealType, { min: number; max: number }>;
}

export const MEAL_TYPES: MealType[] = [
  'breakfast',
  'intra-workout',
  'post-workout',
  'lunch',
  'snack-1',
  'snack-2',
  'snack-3',
  'dinner',
];

export const MEAL_LABELS: Record<MealType, string> = {
  'breakfast': 'Breakfast',
  'intra-workout': 'Intra Workout',
  'post-workout': 'Post Workout',
  'lunch': 'Lunch',
  'snack-1': 'Snack 1',
  'snack-2': 'Snack 2',
  'snack-3': 'Snack 3',
  'dinner': 'Dinner',
};
