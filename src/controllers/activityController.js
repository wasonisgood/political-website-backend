// src/controllers/activityController.js
const Activity = require('../models/Activity');
const { activitySchema } = require('../validations/activityValidation');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/response');

exports.getActivities = asyncHandler(async (req, res) => {
    const activities = await Activity.findAll();
    return ResponseHandler.success(res, activities);
});

exports.getActivity = asyncHandler(async (req, res) => {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
        return ResponseHandler.error(res, '活動不存在', 404);
    }
    return ResponseHandler.success(res, activity);
});

exports.createActivity = asyncHandler(async (req, res) => {
    // 驗證請求數據
    const { error } = activitySchema.validate(req.body);
    if (error) {
        return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const activityId = await Activity.create(req.body);
    return ResponseHandler.success(res, { id: activityId }, '活動創建成功', 201);
});

exports.updateActivity = asyncHandler(async (req, res) => {
    // 檢查活動是否存在
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
        return ResponseHandler.error(res, '活動不存在', 404);
    }

    // 驗證請求數據
    const { error } = activitySchema.validate(req.body);
    if (error) {
        return ResponseHandler.error(res, error.details[0].message, 400);
    }

    await Activity.update(req.params.id, req.body);
    return ResponseHandler.success(res, null, '活動更新成功');
});

exports.deleteActivity = asyncHandler(async (req, res) => {
    // 檢查活動是否存在
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
        return ResponseHandler.error(res, '活動不存在', 404);
    }

    await Activity.delete(req.params.id);
    return ResponseHandler.success(res, null, '活動刪除成功');
});