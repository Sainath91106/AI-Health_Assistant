const express = require('express');
const router = express.Router();

const prescriptionController = require('../controllers/prescriptionController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
// POST /api/prescriptions/chatbot
router.post('/chatbot', protect, prescriptionController.prescriptionChatbot);

// POST /api/prescriptions/upload
router.post('/upload', protect, upload.single('file'), prescriptionController.uploadPrescription);

router.post('/', protect, prescriptionController.createPrescription);
router.get('/user/:userId', protect, prescriptionController.getUserPrescriptions);
router.get('/:id', protect, prescriptionController.getPrescriptionById);
router.put('/:id', protect, prescriptionController.updatePrescription);
router.delete('/:id', protect, prescriptionController.deletePrescription);

module.exports = router;
