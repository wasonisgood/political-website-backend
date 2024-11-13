// src/config/redis.js
const Redis = require('ioredis');
const config = require('./config');
const logger = require('./logger');

let redis = null;

// 創建 Redis 客戶端
const createRedisClient = () => {
    if (!redis) {
        redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        redis.on('error', (err) => {
            logger.error('Redis error:', err);
        });

        redis.on('connect', () => {
            logger.info('Redis connected successfully');
        });
    }
    return redis;
};

module.exports = {
    createRedisClient
};