import { DayData, AppSettings, MEAL_TYPES, MealType } from './types';

const STORAGE_KEYS = {
  DAYS: 'carbs-tracker-days',
  SETTINGS: 'carbs-tracker-settings',
};

const DEFAULT_SETTINGS: AppSettings = {
  dailyTargetMin: null,
  dailyTargetMax: null,
  defaultPlannedRanges: {
    'breakfast': { min: null, max: null },
    'intra-workout': { min: null, max: null },
    'post-workout': { min: null, max: null },
    'lunch': { min: null, max: null },
    'snack-1': { min: null, max: null },
    'snack-2': { min: null, max: null },
    'snack-3': { min: null, max: null },
    'dinner': { min: null, max: null },
  },
};

export const storage = {
  getDayData(date: string): DayData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const allDays = this.getAllDays();
      const dayData = allDays[date];
      if (!dayData) return null;
      
      // Migration: Convert old single dailyTarget to range
      const anyDayData = dayData as any;
      if ('dailyTarget' in anyDayData && !('dailyTargetMin' in anyDayData)) {
        const oldTarget = anyDayData.dailyTarget;
        const migratedData: DayData = {
          date: dayData.date,
          meals: dayData.meals,
          dailyTargetMin: oldTarget,
          dailyTargetMax: oldTarget,
        };
        return migratedData;
      }
      
      return dayData;
    } catch (error) {
      console.error('Error getting day data:', error);
      return null;
    }
  },

  getAllDays(): Record<string, DayData> {
    if (typeof window === 'undefined') return {};
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAYS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting all days:', error);
      return {};
    }
  },

  saveDayData(dayData: DayData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const allDays = this.getAllDays();
      allDays[dayData.date] = dayData;
      localStorage.setItem(STORAGE_KEYS.DAYS, JSON.stringify(allDays));
    } catch (error) {
      console.error('Error saving day data:', error);
    }
  },

  deleteDayData(date: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const allDays = this.getAllDays();
      delete allDays[date];
      localStorage.setItem(STORAGE_KEYS.DAYS, JSON.stringify(allDays));
    } catch (error) {
      console.error('Error deleting day data:', error);
    }
  },

  getSettings(): AppSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      
      const parsed = JSON.parse(data);
      
      // Migration: Convert old single dailyTarget to range
      if ('dailyTarget' in parsed && !('dailyTargetMin' in parsed)) {
        const oldTarget = parsed.dailyTarget;
        parsed.dailyTargetMin = oldTarget;
        parsed.dailyTargetMax = oldTarget;
        delete parsed.dailyTarget;
      }
      
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  createEmptyDayData(date: string): DayData {
    const settings = this.getSettings();
    return {
      date,
      dailyTargetMin: settings.dailyTargetMin,
      dailyTargetMax: settings.dailyTargetMax,
      meals: MEAL_TYPES.map(type => ({
        type,
        plannedMin: settings.defaultPlannedRanges[type].min,
        plannedMax: settings.defaultPlannedRanges[type].max,
        actual: null,
        isDone: false,
      })),
    };
  },

  exportData(): string {
    if (typeof window === 'undefined') return '';
    
    try {
      const allDays = this.getAllDays();
      const settings = this.getSettings();
      return JSON.stringify({ days: allDays, settings }, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  },

  importData(jsonString: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const data = JSON.parse(jsonString);
      if (data.days) {
        localStorage.setItem(STORAGE_KEYS.DAYS, JSON.stringify(data.days));
      }
      if (data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
};
