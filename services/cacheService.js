const redisClient = require("../config/redis");

const CACHE_EXPIRATION = 3600; // 1 hour in seconds

const cacheService = {
  // Get cached data
  async get(key) {
    try {
      const cachedData = await redisClient.get(key);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error("Error getting from cache:", error);
      return null;
    }
  },

  // Set cache data
  async set(key, data) {
    try {
      await redisClient.set(key, JSON.stringify(data), {
        EX: CACHE_EXPIRATION,
      });
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  },

  // Delete cache by key
  async delete(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error("Error deleting from cache:", error);
    }
  },

  // Delete all product-related caches
  async invalidateProductCache() {
    try {
      const keys = await redisClient.keys("product:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error("Error invalidating product cache:", error);
    }
  },
};

module.exports = cacheService;
