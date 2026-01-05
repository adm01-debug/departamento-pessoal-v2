export const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  maxRetries: 3,
  retryDelay: 1000,
  maxmemory: "256mb",
  maxmemoryPolicy: "allkeys-lru",
  enableOfflineQueue: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
  keyPrefix: "dp:",
  db: 0,
};
export const cacheConfig = {
  defaultTTL: 3600,
  sessionTTL: 86400,
  tokenTTL: 604800,
  rateLimitWindow: 60,
  rateLimitMax: 100,
};
export default redisConfig;
