"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { apiGet } from '../../../lib/api';

interface AuditLog {
  id: string;
  action: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: { name: string; email: string; role: string };
}

export default function AdminAuditLogsPage() {
  import useSWR from 'swr';
  const fetcher = (url: string) => apiGet<AuditLog[]>(url);
  const { data: logs = [], isLoading: loading } = useSWR('/audit-logs', fetcher, { revalidateOnFocus: true });

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Audit Logs</h1>
        <p className="text-neutral-500 mt-1">Complete history of admin actions. <span className="font-bold text-neutral-700">{logs.length} entries</span></p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-bold">No audit logs yet</p>
            <p className="text-sm mt-1">Actions performed by admins will be logged here.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">User</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Action</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Entity ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm text-neutral-500">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm">{log.user?.name || 'System'}</div>
                    <div className="text-xs text-neutral-400">{log.user?.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-black uppercase tracking-wider">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-neutral-500">{log.entityId?.slice(0, 8) || '—'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
