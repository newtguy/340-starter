const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Route for intentional error
router.get('/trigger-error', errorController.triggerError);

module.exports = router;