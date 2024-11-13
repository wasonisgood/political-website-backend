// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');

// 公開路由
router.post('/messages', contactController.createMessage);

// 需要驗證的路由
router.use(auth);
router.get('/messages', contactController.getMessages);
router.get('/messages/:id', contactController.getMessage);
router.put('/messages/:id/status', contactController.updateMessageStatus);
router.delete('/messages/:id', contactController.deleteMessage);

module.exports = router;