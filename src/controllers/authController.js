// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/response');

// 初始化時生成密碼雜湊
const initializeAdminPassword = async () => {
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Generated new hash for admin password:', hashedPassword);
    return hashedPassword;
};

let adminHashedPassword = ''; // 將存儲初始化的雜湊密碼

// 立即初始化密碼
initializeAdminPassword().then(hash => {
    adminHashedPassword = hash;
    console.log('Admin password initialized');
});

exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username });
    console.log('Using hashed password:', adminHashedPassword);

    // 固定的管理員用戶
    const adminUser = {
        username: 'admin',
        password: adminHashedPassword
    };

    // 檢查用戶名
    if (username !== adminUser.username) {
        console.log('Username mismatch');
        return ResponseHandler.error(res, '帳號或密碼錯誤', 401);
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    console.log('Password comparison:', { 
        provided: password,
        isValid: isPasswordValid 
    });

    if (!isPasswordValid) {
        console.log('Password mismatch');
        return ResponseHandler.error(res, '帳號或密碼錯誤', 401);
    }

    // 生成 JWT
    const token = jwt.sign(
        { 
            username: adminUser.username,
            role: 'admin'
        },
        config.jwt.secret || 'your-secret-key',
        { 
            expiresIn: config.jwt.expiresIn || '1d',
            algorithm: 'HS256'
        }
    );

    console.log('Login successful, token generated');

    return ResponseHandler.success(res, { token }, '登入成功');
});

// 驗證密碼的測試端點
exports.testHash = asyncHandler(async (req, res) => {
    const { password } = req.body;
    console.log('Testing password:', password);
    console.log('Against hash:', adminHashedPassword);
    
    const isValid = await bcrypt.compare(password, adminHashedPassword);
    console.log('Test result:', isValid);
    
    return ResponseHandler.success(res, {
        providedPassword: password,
        currentHash: adminHashedPassword,
        isValid,
        note: "正確的密碼應該是 'admin123'"
    });
});