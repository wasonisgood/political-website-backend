// src/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// 公開路由
router.get('/', activityController.getActivities);
router.get('/:id', activityController.getActivity);

// 需要驗證的路由
router.use(auth);
router.post('/', upload.single('image'), activityController.createActivity);
router.put('/:id', upload.single('image'), activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
