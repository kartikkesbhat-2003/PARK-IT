const express = require('express');
const router = express.Router();
const {
    createSpot,
    updateSpot,
    getAllSpots,
    getSpotById,
} = require('../controllers/spot');

// Route to create a new parking spot
router.post('/create', createSpot);

// Route to update a parking spot by ID
router.put('/update/:spotId', updateSpot);

// Route to get all parking spots
router.get('/all', getAllSpots);

// Route to get a specific parking spot by ID
router.get('/:spotId', getSpotById);

module.exports = router;
