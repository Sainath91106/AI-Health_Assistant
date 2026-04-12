const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

// Generate personalized diet plan using AI
router.post('/generate', protect, dietController.generateDietPlan);

// CRUD operations
router.post('/', protect, dietController.createDiet);
router.get('/user/:userId', protect, dietController.getUserDiets);
router.delete('/:id', protect, dietController.deleteDiet);

module.exports = router;
