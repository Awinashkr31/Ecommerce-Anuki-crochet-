
import redisClient from './redis';
import dotenv from 'dotenv';

dotenv.config();

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/payload';

export const getShiprocketToken = async (): Promise<string | null> => {
  try {
    // Check Redis for cached token
    if (redisClient.isReady) {
      const cachedToken = await redisClient.get('shiprocket_token');
      if (cachedToken) return cachedToken;
    }

    // Generate new token
    const response = await fetch(`${SHIPROCKET_API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      })
    });

    if (!response.ok) throw new Error('Shiprocket login failed');
    const data = await response.json();
    const token = data.token;

    // Cache token (Shiprocket tokens usually expire in 24h, cache for 20h)
    if (redisClient.isReady) {
      await redisClient.setEx('shiprocket_token', 72000, token);
    }

    return token;
  } catch (error) {
    console.error('Failed to get Shiprocket Token:', error);
    return null;
  }
};

export const createShiprocketOrder = async (orderData: any) => {
  const token = await getShiprocketToken();
  if (!token) throw new Error('Shiprocket authentication failed');

  const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
  });

  if (!response.ok) throw new Error('Failed to create Shiprocket order');
  return response.json();
};
