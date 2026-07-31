"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Bell, Mail, MessageSquare, AlertCircle, RefreshCw, Send, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/notifications/analytics");
      setAnalytics(data);
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-neutral-400" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notification Center</h1>
          <p className="text-neutral-500">Monitor system alerts and user notification engagement.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Sent</p>
              <h3 className="text-3xl font-bold mt-2">{analytics?.totalSent || 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Send size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Read Rate</p>
              <h3 className="text-3xl font-bold mt-2">{analytics?.readRate || 0}%</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Failed Delivery</p>
              <h3 className="text-3xl font-bold mt-2">{analytics?.failedCount || 0}</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="font-bold text-neutral-900">Delivery Channels</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                <Bell size={24} />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">In-App</p>
                <p className="text-2xl font-bold">{analytics?.channelUsage?.inApp || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">Email</p>
                <p className="text-2xl font-bold">{analytics?.channelUsage?.email || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium">SMS</p>
                <p className="text-2xl font-bold">{analytics?.channelUsage?.sms || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
