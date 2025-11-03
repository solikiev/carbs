'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { AppSettings, MEAL_TYPES, MEAL_LABELS } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');

  useEffect(() => {
    setSettings(storage.getSettings());
  }, []);

  const handleSaveSettings = () => {
    if (!settings) return;
    
    // Validation: max should be >= min if both are set
    if (
      settings.dailyTargetMin !== null &&
      settings.dailyTargetMax !== null &&
      settings.dailyTargetMax < settings.dailyTargetMin
    ) {
      alert('Maximum target must be greater than or equal to minimum target');
      return;
    }
    
    storage.saveSettings(settings);
    alert('Settings saved successfully!');
  };

  const handleExport = () => {
    const data = storage.exportData();
    setExportData(data);
  };

  const handleImport = () => {
    if (!importData) {
      alert('Please paste data to import');
      return;
    }

    const success = storage.importData(importData);
    if (success) {
      alert('Data imported successfully!');
      setSettings(storage.getSettings());
      setImportData('');
    } else {
      alert('Failed to import data. Please check the format.');
    }
  };

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportData);
    alert('Data copied to clipboard!');
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Daily Target Range</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum (g)
              </label>
              <input
                type="number"
                value={settings.dailyTargetMin ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSettings({
                    ...settings,
                    dailyTargetMin: value === '' ? null : parseInt(value, 10),
                  });
                }}
                placeholder="Enter minimum target"
                className="w-full px-3 py-2 border border-gray-300 rounded min-h-[44px]"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum (g)
              </label>
              <input
                type="number"
                value={settings.dailyTargetMax ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSettings({
                    ...settings,
                    dailyTargetMax: value === '' ? null : parseInt(value, 10),
                  });
                }}
                placeholder="Enter maximum target"
                className="w-full px-3 py-2 border border-gray-300 rounded min-h-[44px]"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Default Planned Ranges</h2>
          <div className="space-y-3">
            {MEAL_TYPES.map((mealType) => (
              <div key={mealType}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {MEAL_LABELS[mealType]}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={settings.defaultPlannedRanges[mealType].min ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSettings({
                        ...settings,
                        defaultPlannedRanges: {
                          ...settings.defaultPlannedRanges,
                          [mealType]: {
                            ...settings.defaultPlannedRanges[mealType],
                            min: value === '' ? null : parseInt(value, 10),
                          },
                        },
                      });
                    }}
                    placeholder="Min"
                    className="w-20 px-3 py-2 border border-gray-300 rounded text-center min-h-[44px]"
                    min="0"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={settings.defaultPlannedRanges[mealType].max ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSettings({
                        ...settings,
                        defaultPlannedRanges: {
                          ...settings.defaultPlannedRanges,
                          [mealType]: {
                            ...settings.defaultPlannedRanges[mealType],
                            max: value === '' ? null : parseInt(value, 10),
                          },
                        },
                      });
                    }}
                    placeholder="Max"
                    className="w-20 px-3 py-2 border border-gray-300 rounded text-center min-h-[44px]"
                    min="0"
                  />
                  <span className="text-gray-700 text-sm">g</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 min-h-[48px]"
        >
          Save Settings
        </button>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Export Data</h2>
          <p className="text-sm text-gray-600 mb-3">
            Export all your data to backup or transfer to another device.
          </p>
          <button
            onClick={handleExport}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 mb-3 min-h-[48px]"
          >
            Export Data
          </button>
          {exportData && (
            <div>
              <textarea
                value={exportData}
                readOnly
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded text-xs font-mono mb-2"
              />
              <button
                onClick={handleCopyExport}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 min-h-[44px]"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Import Data</h2>
          <p className="text-sm text-gray-600 mb-3">
            Paste your exported data here to import it.
          </p>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste exported data here..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded text-xs font-mono mb-3"
          />
          <button
            onClick={handleImport}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 min-h-[48px]"
          >
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
}
