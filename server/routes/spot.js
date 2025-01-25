const express = require('express');
const router = express.Router();
const {
    createParkingSpot,
    updateParkingSpot,
    getAllParkingSpots,
    getParkingSpotById,
    deleteParkingSpot,
    getParkingSpotsByUser,
    getNearbyParkingSpots
} = require('../controllers/spot');
const { auth, isUser } = require('../middlewares/auth');

// Route to create a new parking spot
router.post('/createSpot', auth, isUser, createParkingSpot);

// Route to update a parking spot (ID from request body)
router.put('/update/:spotId', auth, isUser, updateParkingSpot);

// Route to get all parking spots
router.get('/getAllSpots', auth, getAllParkingSpots);

// Route to get a specific parking spot by ID (ID from query parameters)
router.get('/getSpot/:spotId', auth, getParkingSpotById);

// Route to delete a parking spot (ID from request body)
router.delete('/deleteSpots/:spotId', auth, isUser, deleteParkingSpot);

// Route to get all parking spots created by the authenticated user
router.get('/userSpots', auth, getParkingSpotsByUser);

// Route to fetch nearby parking spots within a specific radius (default: 5 km)
router.get('/nearby', auth, getNearbyParkingSpots);

module.exports = router;
