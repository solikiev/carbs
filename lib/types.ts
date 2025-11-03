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
  plannedMin: number | null;
  plannedMax: number | null;
  actual: number | null;
  isDone: boolean;
}

export interface DayData {
  date: string; // YYYY-MM-DD format
  dailyTargetMin: number | null;
  dailyTargetMax: number | null;
  meals: MealData[];
}

export interface AppSettings {
  dailyTargetMin: number | null;
  dailyTargetMax: number | null;
  defaultPlannedRanges: Record<MealType, { min: number | null; max: number | null }>;
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
