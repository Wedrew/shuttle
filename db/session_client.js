import redis from 'redis';

// Initialize session client and connect
export const session_client = redis.createClient({ host: process.env.REDIS_SESSION_URL, port: process.env.REDIS_PORT });