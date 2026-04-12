const express = require('express');
const router = express.Router();
const embeddingController = require('../controllers/embeddingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, embeddingController.createEmbedding);
router.get('/prescription/:prescriptionId', protect, embeddingController.getPrescriptionEmbeddings);
router.delete('/:id', protect, embeddingController.deleteEmbedding);

module.exports = router;
