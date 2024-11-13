// src/config/email.js
const nodemailer = require('nodemailer');
const config = require('./config');
const logger = require('./logger');

// 創建郵件傳輸器
const transporter = nodemailer.createTransport(config.email);

// 驗證郵件配置
const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        logger.info('Email configuration is valid');
        return true;
    } catch (error) {
        logger.error('Email configuration error:', error);
        return false;
    }
};

// 發送郵件的通用函數
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: config.email.from,
            to,
            subject,
            text,
            html
        });
        logger.info('Email sent:', info.messageId);
        return info;
    } catch (error) {
        logger.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    transporter,
    verifyEmailConfig,
    sendEmail
};

