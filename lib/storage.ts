import { DayData, AppSettings, MEAL_TYPES, MealType } from './types';

const STORAGE_KEYS = {
  DAYS: 'carbs-tracker-days',
  SETTINGS: 'carbs-tracker-settings',
};

const DEFAULT_SETTINGS: AppSettings = {
  dailyTarget: 150,
  defaultPlannedRanges: {
    'breakfast': { min: 70, max: 80 },
    'intra-workout': { min: 0, max: 0 },
    'post-workout': { min: 0, max: 0 },
    'lunch': { min: 40, max: 50 },
    'snack-1': { min: 0, max: 0 },
    'snack-2': { min: 0, max: 0 },
    'snack-3': { min: 0, max: 0 },
    'dinner': { min: 30, max: 40 },
  },
};

export const storage = {
  getDayData(date: string): DayData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const allDays = this.getAllDays();
      return allDays[date] || null;
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
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
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
      dailyTarget: settings.dailyTarget,
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
