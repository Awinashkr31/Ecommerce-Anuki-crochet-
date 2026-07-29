import { create } from 'zustand';
import { apiGet, apiPut } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isInitialized: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  initializeRealtime: (userId: string) => void;
  cleanupRealtime: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  let realtimeChannel: any = null;

  return {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isInitialized: false,

    fetchNotifications: async () => {
      set({ isLoading: true });
      try {
        const data = await apiGet('/notifications/my');
        set({
          notifications: data.notifications || [],
          unreadCount: data.unreadCount || 0,
          isInitialized: true
        });
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        set({ isLoading: false });
      }
    },

    markAsRead: async (id: string) => {
      const { notifications, unreadCount } = get();
      
      // Optimistic update
      const updated = notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      );
      
      const wasUnread = notifications.find(n => n.id === id && !n.is_read);
      
      set({ 
        notifications: updated,
        unreadCount: wasUnread ? Math.max(0, unreadCount - 1) : unreadCount
      });

      try {
        await apiPut(`/notifications/${id}/read`, {});
      } catch (error) {
        // Revert on failure (omitted for simplicity, but good practice)
        console.error('Failed to mark read', error);
      }
    },

    markAllAsRead: async () => {
      const { notifications } = get();
      const updated = notifications.map(n => ({ ...n, is_read: true }));
      
      set({ notifications: updated, unreadCount: 0 });
      
      try {
        await apiPut('/notifications/mark-all-read', {});
      } catch (error) {
        console.error('Failed to mark all read', error);
      }
    },

    initializeRealtime: (userId: string) => {
      if (realtimeChannel) return; // Already listening

      // Fetch initial set
      get().fetchNotifications();

      // Listen to Supabase Realtime for inserts on the Notification table
      realtimeChannel = supabase
        .channel('public:Notification')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Notification',
            filter: `userId=eq.${userId}`
          },
          (payload) => {
            const newNotif = payload.new as Notification;
            
            // Show toast
            if (newNotif.priority === 'high' || newNotif.priority === 'critical') {
              toast.error(newNotif.title + '\n' + newNotif.message, { duration: 5000, icon: '🔔' });
            } else {
              toast.success(newNotif.title, { icon: '🔔' });
            }

            // Update store
            set((state) => ({
              notifications: [newNotif, ...state.notifications],
              unreadCount: state.unreadCount + 1
            }));
          }
        )
        .subscribe();
    },

    cleanupRealtime: () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
      }
    }
  };
});
