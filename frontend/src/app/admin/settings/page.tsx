"use client";
import useSWR from 'swr';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { apiGet, apiPut } from '../../../lib/api';

interface Setting {
  id: string;
  key: string;
  value: string;
}

const defaultSettings = [
  { key: 'store_name', label: 'Store Name', type: 'text' },
  { key: 'store_tagline', label: 'Store Tagline', type: 'text' },
  { key: 'store_email', label: 'Contact Email', type: 'email' },
  { key: 'store_phone', label: 'Phone Number', type: 'text' },
  { key: 'store_address', label: 'Store Address', type: 'textarea' },
  { key: 'cod_enabled', label: 'Cash on Delivery Enabled', type: 'toggle' },
  { key: 'free_shipping_threshold', label: 'Free Shipping Above (₹)', type: 'number' },
  { key: 'gst_number', label: 'GST Number', type: 'text' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const fetcher = (url: string) => apiGet<Record<string, string>>(url);
  const { data: rawSettings, isLoading: loading } = useSWR('/settings', fetcher, { revalidateOnFocus: false });

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (rawSettings && !hasInitialized) {
      setSettings(rawSettings);
      setHasInitialized(true);
    }
  }, [rawSettings, hasInitialized]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess('');
      await apiPut('/settings', settings);
      setSuccess('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-neutral-500 mt-1">Configure your store preferences.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </header>

      {success && <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl font-medium text-sm">{success}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 space-y-6 max-w-2xl">
          {defaultSettings.map(s => (
            <div key={s.key}>
              <label className="block text-sm font-bold text-neutral-700 mb-2">{s.label}</label>
              {s.type === 'textarea' ? (
                <textarea
                  value={settings[s.key] || ''}
                  onChange={(e) => updateSetting(s.key, e.target.value)}
                  rows={3}
                  className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none resize-none"
                />
              ) : s.type === 'toggle' ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[s.key] === 'true'}
                    onChange={(e) => updateSetting(s.key, e.target.checked ? 'true' : 'false')}
                    className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 w-5 h-5"
                  />
                  <span className="text-sm text-neutral-600">{settings[s.key] === 'true' ? 'Enabled' : 'Disabled'}</span>
                </label>
              ) : (
                <input
                  type={s.type}
                  value={settings[s.key] || ''}
                  onChange={(e) => updateSetting(s.key, e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
