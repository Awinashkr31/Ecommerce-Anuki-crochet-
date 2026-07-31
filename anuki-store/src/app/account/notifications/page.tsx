"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { Bell, Mail, MessageSquare, Smartphone, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const data = await apiGet("/notifications/preferences");
        setPrefs(data);
      } catch (error) {
        toast.error("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = (key: string) => {
    setPrefs((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiPut("/notifications/preferences", prefs);
      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-neutral-400" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Notification Preferences</h1>
      <p className="text-neutral-500 mb-8">Manage how and when you want to be notified.</p>

      <div className="space-y-8">
        {/* Delivery Channels */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="font-bold text-neutral-900">Delivery Channels</h2>
          </div>
          <div className="p-6 space-y-4">
            <ToggleRow
              icon={<Mail className="text-blue-500" />}
              title="Email Notifications"
              description="Receive updates straight to your inbox."
              checked={prefs?.emailEnabled}
              onChange={() => handleToggle("emailEnabled")}
            />
            <ToggleRow
              icon={<MessageSquare className="text-green-500" />}
              title="SMS Notifications"
              description="Get text messages for important updates."
              checked={prefs?.smsEnabled}
              onChange={() => handleToggle("smsEnabled")}
            />
            <ToggleRow
              icon={<Smartphone className="text-purple-500" />}
              title="Push Notifications"
              description="Receive notifications on your device."
              checked={prefs?.pushEnabled}
              onChange={() => handleToggle("pushEnabled")}
            />
          </div>
        </div>

        {/* Notification Types */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="font-bold text-neutral-900">Notification Types</h2>
          </div>
          <div className="p-6 space-y-4">
            <ToggleRow
              icon={<Bell className="text-rose-500" />}
              title="Order Updates"
              description="Confirmations, shipping updates, and delivery alerts."
              checked={prefs?.orderEnabled}
              onChange={() => handleToggle("orderEnabled")}
            />
            <ToggleRow
              icon={<Bell className="text-emerald-500" />}
              title="Marketing & Promos"
              description="Special offers, new arrivals, and sales."
              checked={prefs?.marketingEnabled}
              onChange={() => handleToggle("marketingEnabled")}
            />
            <ToggleRow
              icon={<Bell className="text-blue-500" />}
              title="Account Security"
              description="Password changes and login alerts."
              checked={prefs?.securityEnabled}
              onChange={() => handleToggle("securityEnabled")}
              disabled // usually mandatory
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, title, description, checked, onChange, disabled = false }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-neutral-50 rounded-lg shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-neutral-900 text-sm">{title}</h4>
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked || false} 
          onChange={onChange}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900 disabled:opacity-50"></div>
      </label>
    </div>
  );
}
