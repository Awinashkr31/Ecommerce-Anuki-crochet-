const redisClient = { 
  isReady: false, 
  connect: async () => {}, 
  get: async (key: string) => null, 
  setEx: async (key: string, time: number, val: string) => {},
  del: async (key: string) => {}
};
export default redisClient;