// src/controllers/policyController.js
const Policy = require('../models/Policy');
const { policySchema } = require('../validations/policyValidation');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/response');

exports.getPolicies = asyncHandler(async (req, res) => {
    const policies = await Policy.findAll();
    return ResponseHandler.success(res, policies);
});

exports.getPolicy = asyncHandler(async (req, res) => {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
        return ResponseHandler.error(res, '政策不存在', 404);
    }
    return ResponseHandler.success(res, policy);
});

exports.createPolicy = asyncHandler(async (req, res) => {
    // 驗證請求數據
    const { error } = policySchema.validate(req.body);
    if (error) {
        return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const policyId = await Policy.create(req.body);
    return ResponseHandler.success(res, { id: policyId }, '政策創建成功', 201);
});

exports.updatePolicy = asyncHandler(async (req, res) => {
    // 檢查政策是否存在
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
        return ResponseHandler.error(res, '政策不存在', 404);
    }

    // 驗證請求數據
    const { error } = policySchema.validate(req.body);
    if (error) {
        return ResponseHandler.error(res, error.details[0].message, 400);
    }

    await Policy.update(req.params.id, req.body);
    return ResponseHandler.success(res, null, '政策更新成功');
});

exports.deletePolicy = asyncHandler(async (req, res) => {
    // 檢查政策是否存在
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
        return ResponseHandler.error(res, '政策不存在', 404);
    }

    await Policy.delete(req.params.id);
    return ResponseHandler.success(res, null, '政策刪除成功');
});



