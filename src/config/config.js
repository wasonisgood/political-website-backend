// src/config/config.js
require('dotenv').config();

const config = {
    app: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
        apiPrefix: '/api'
    },
    
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME
    },
    
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },
    
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        uploadDir: 'uploads/'
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: {
            enabled: process.env.FILE_LOGGING_ENABLED === 'true',
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        }
    },
    
    rateLimiting: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },

    security: {
        bcryptSaltRounds: 10,
        allowedHosts: process.env.ALLOWED_HOSTS ? process.env.ALLOWED_HOSTS.split(',') : []
    },

    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        from: process.env.EMAIL_FROM
    }
};

module.exports = config;

