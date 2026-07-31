// In-memory cache to replace Redis, avoiding external dependencies while providing huge performance boosts
const cacheStore = new Map<string, { value: string, expiry: number }>();

const redisClient = { 
  isReady: true, 
  connect: async () => {}, 
  get: async (key: string) => {
    const item = cacheStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      cacheStore.delete(key);
      return null;
    }
    return item.value;
  }, 
  setEx: async (key: string, timeSeconds: number, val: string) => {
    cacheStore.set(key, {
      value: val,
      expiry: Date.now() + (timeSeconds * 1000)
    });
  },
  del: async (key: string) => {
    cacheStore.delete(key);
  }
};
export default redisClient;