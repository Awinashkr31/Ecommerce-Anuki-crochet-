"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Settings, ExternalLink } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function CustomerNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    initializeRealtime, 
    cleanupRealtime, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.id) {
      initializeRealtime(profile.id);
    }
    return () => cleanupRealtime();
  }, [profile?.id, initializeRealtime, cleanupRealtime]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'critical': return 'bg-rose-100 text-rose-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
      >
        <Bell size={20} className="text-neutral-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden z-50">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <h3 className="font-bold text-neutral-900">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={() => markAllAsRead()} className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  Mark all read
                </button>
              )}
              <Link href="/account/notifications" onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1">
                <Settings size={16} />
              </Link>
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                <Bell size={24} className="mx-auto text-neutral-300 mb-2" />
                <p className="text-sm font-medium">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 transition-colors hover:bg-neutral-50 ${!notif.is_read || !notif.isRead ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      if (!notif.is_read && !notif.isRead) markAsRead(notif.id);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getPriorityColor(notif.priority)}`}>
                        <Bell size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-neutral-900 truncate pr-2">{notif.title}</h4>
                          <span className="text-[10px] font-medium text-neutral-400 whitespace-nowrap">
                            {new Date(notif.created_at || notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 line-clamp-2">{notif.message}</p>
                        
                        {notif.actionUrl && (
                          <Link 
                            href={notif.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            View Details <ExternalLink size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
