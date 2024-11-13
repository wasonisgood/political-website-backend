// src/middleware/errorHandler.js
const ResponseHandler = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // 數據驗證錯誤
    if (err.name === 'ValidationError') {
        return ResponseHandler.error(res, err.details[0].message, 400);
    }

    // JWT認證錯誤
    if (err.name === 'JsonWebTokenError') {
        return ResponseHandler.error(res, '無效的認證token', 401);
    }

    // 文件上傳錯誤
    if (err.code === 'LIMIT_FILE_SIZE') {
        return ResponseHandler.error(res, '文件大小超出限制', 400);
    }

    if (err.code === 'LIMIT_FILE_TYPE') {
        return ResponseHandler.error(res, '不支援的文件類型', 400);
    }

    // SQL錯誤處理
    if (err.code === 'ER_DUP_ENTRY') {
        return ResponseHandler.error(res, '資料重複', 400);
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return ResponseHandler.error(res, '關聯數據不存在', 400);
    }

    // 默認錯誤響應
    const statusCode = err.statusCode || 500;
    const message = err.message || '服務器內部錯誤';

    return ResponseHandler.error(res, message, statusCode);
};

// 處理未捕獲的Promise rejection
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 處理未捕獲的異常
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = errorHandler;