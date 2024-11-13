// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');

// 導入配置
require('dotenv').config();

// 導入路由
const policyRoutes = require('./routes/policyRoutes');
const activityRoutes = require('./routes/activityRoutes');
const contactRoutes = require('./routes/contactRoutes');

// 導入中間件
const errorHandler = require('./middleware/errorHandler');

// 創建 Express 應用
const app = express();

// 讀取 Swagger 文檔
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
);

// 基本中間件
app.use(helmet()); // 安全性標頭
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 請求大小限制
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 靜態文件服務
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
//權限類別
app.use('/api/auth', authRoutes);



// API 請求限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分鐘
    max: 100, // 每個IP最多100個請求
    message: {
        status: 429,
        error: '請求太頻繁，請稍後再試'
    }
});

// 日誌配置
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../logs/access.log'),
    { flags: 'a' }
);

// 根據環境使用不同的日誌格式
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    app.use(morgan('dev'));
}

// API文檔
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Political Website API Documentation"
}));

// 健康檢查
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// API 路由
app.use('/api/policies', limiter, policyRoutes);
app.use('/api/activities', limiter, activityRoutes);
app.use('/api/contact', limiter, contactRoutes);

// 處理 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: '找不到該資源'
    });
});

// 錯誤處理中間件
app.use(errorHandler);

// 未捕獲的 Promise rejection 處理
process.on('unhandledRejection', (reason, promise) => {
    console.error('未處理的 Promise rejection:', reason);
    // 在生產環境中，你可能想要做一些額外的處理，比如通知管理員
});

// 未捕獲的異常處理
process.on('uncaughtException', (error) => {
    console.error('未捕獲的異常:', error);
    // 記錄錯誤後優雅退出
    process.exit(1);
});

// 優雅退出處理
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
    console.log('開始優雅退出...');
    // 關閉資料庫連接
    require('./config/database').end()
        .then(() => {
            console.log('資料庫連接已關閉');
            process.exit(0);
        })
        .catch(err => {
            console.error('關閉資料庫連接時發生錯誤:', err);
            process.exit(1);
        });
}

// 啟動服務器
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`服務器運行在端口 ${PORT}`);
    console.log(`環境: ${process.env.NODE_ENV}`);
    console.log(`API文檔: http://localhost:${PORT}/api-docs`);
});

// 導出 app 實例（用於測試）
module.exports = app;