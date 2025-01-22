const express = require('express');
const router = express.Router();
const {
    createSpot,
    updateSpot,
    getSpots,
    getSpotById,
    deleteSpot,
    getSpotsByUser  // Added deleteSpot import
} = require('../controllers/spot');
const { auth, isAdmin, isUser } = require('../middlewares/auth');

// Route to create a new parking spot
router.post('/addSpot',auth, isUser, createSpot);

// Route to update a parking spot by ID
router.put('/update', auth, isUser, updateSpot);

// Route to get all parking spots
router.get('/getSpots',auth ,getSpots);

// Route to get a specific parking spot by ID
router.get('/spot', getSpotById);

// Route to delete a parking spot by ID
router.delete('/delete', deleteSpot);  // Added delete route

router.get('/getSpotsByUser,', auth, getSpotsByUser);

// router.delete('/delete', (req, res) => {
//     console.log('Delete request received for spot ID:', req.params.spotId);
//     deleteSpot(req, res); // Call your deleteSpot controller function
// });

module.exports = router;
