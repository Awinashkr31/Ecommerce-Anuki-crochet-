import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../lib/api';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (err: any) {
      console.error('Error checking push subscription:', err);
    }
  };

  const subscribe = async () => {
    if (!isSupported) return;
    
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const registration = await navigator.serviceWorker.ready;
      
      let vapidPublicKey;
      try {
        const response = await apiGet<{publicKey: string}>('/notifications/vapid-key');
        vapidPublicKey = response.publicKey;
      } catch (e) {
        console.warn("Could not fetch vapid key from API", e);
      }
      
      if (!vapidPublicKey) {
         vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      }
      
      if (!vapidPublicKey) {
        throw new Error('VAPID public key not found');
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      setSubscription(sub);

      // Send to server
      await apiPost('/notifications/subscribe', sub.toJSON());

    } catch (err: any) {
      console.error('Push subscription failed:', err);
      setError(err.message || 'Failed to subscribe to push notifications');
    } finally {
      setLoading(false);
    }
  };

  return { isSupported, subscription, loading, error, subscribe };
}
