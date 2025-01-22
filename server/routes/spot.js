const express = require('express');
const router = express.Router();
const {
    createSpot,
    updateSpot,
    getAllSpots,
    getSpotById,
    deleteSpot,  // Added deleteSpot import
} = require('../controllers/spot');

// Route to create a new parking spot
router.post('/create', createSpot);

// Route to update a parking spot by ID
router.put('/update/:spotId', updateSpot);

// Route to get all parking spots
router.get('/all', getAllSpots);

// Route to get a specific parking spot by ID
router.get('/:spotId', getSpotById);

// Route to delete a parking spot by ID
router.delete('/delete/:spotId', deleteSpot);  // Added delete route

router.delete('/delete/:spotId', (req, res) => {
    console.log('Delete request received for spot ID:', req.params.spotId);
    deleteSpot(req, res); // Call your deleteSpot controller function
});

module.exports = router;
