// src/controllers/contactController.js
const Contact = require('../models/Contact');
const { contactSchema } = require('../validations/contactValidation');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/response');

exports.getMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.findAll();
    return ResponseHandler.success(res, messages);
});

exports.getMessage = asyncHandler(async (req, res) => {
    const message = await Contact.findById(req.params.id);
    if (!message) {
        return ResponseHandler.error(res, '找不到此訊息', 404);
    }
    return ResponseHandler.success(res, message);
});

exports.createMessage = asyncHandler(async (req, res) => {
    // 驗證請求數據
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const messageId = await Contact.create(req.body);
    return ResponseHandler.success(
        res, 
        { id: messageId }, 
        '訊息發送成功', 
        201
    );
});

exports.updateMessageStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    // 驗證狀態值
    if (!['pending', 'processed'].includes(status)) {
        return ResponseHandler.error(res, '無效的狀態值', 400);
    }

    // 檢查訊息是否存在
    const message = await Contact.findById(id);
    if (!message) {
        return ResponseHandler.error(res, '找不到此訊息', 404);
    }

    // 更新狀態
    const success = await Contact.updateStatus(id, status);
    if (!success) {
        return ResponseHandler.error(res, '更新失敗', 500);
    }

    return ResponseHandler.success(res, null, '狀態更新成功');
});

exports.deleteMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 檢查訊息是否存在
    const message = await Contact.findById(id);
    if (!message) {
        return ResponseHandler.error(res, '找不到此訊息', 404);
    }

    // 刪除訊息
    const success = await Contact.delete(id);
    if (!success) {
        return ResponseHandler.error(res, '刪除失敗', 500);
    }

    return ResponseHandler.success(res, null, '訊息刪除成功');
});