const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Context-aware chat endpoint
router.post('/', protect, chatController.sendMessage);

// Legacy endpoints
router.post('/message', protect, chatController.addMessage);
router.get('/user/:userId', protect, chatController.getChat);

module.exports = router;
