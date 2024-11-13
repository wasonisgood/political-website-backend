// src/config/logger.js
const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('./config');

// 定義日誌格式
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// 創建 winston logger 實例
const logger = winston.createLogger({
    level: config.logging.level,
    format: logFormat,
    transports: [
        // 寫入所有日誌級別到控制台
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// 如果啟用了文件日誌，添加文件傳輸
if (config.logging.file.enabled) {
    logger.add(new winston.transports.DailyRotateFile({
        filename: config.logging.file.filename,
        datePattern: config.logging.file.datePattern,
        maxSize: config.logging.file.maxSize,
        maxFiles: config.logging.file.maxFiles,
        format: logFormat
    }));
}

// 開發環境下的額外設置
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;

