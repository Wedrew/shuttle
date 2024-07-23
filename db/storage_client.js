import redis from 'redis';

// Initialize session client and connect
export const storage_client = redis.createClient({ host: process.env.REDIS_STORAGE_URL, port: process.env.REDIS_PORT});
