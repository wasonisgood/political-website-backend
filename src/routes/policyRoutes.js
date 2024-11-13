// src/routes/policyRoutes.js
const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// 公開路由
router.get('/', policyController.getPolicies);
router.get('/:id', policyController.getPolicy);

// 需要驗證的路由
router.use(auth);
router.post('/', upload.single('image'), policyController.createPolicy);
router.put('/:id', upload.single('image'), policyController.updatePolicy);
router.delete('/:id', policyController.deletePolicy);

module.exports = router;


