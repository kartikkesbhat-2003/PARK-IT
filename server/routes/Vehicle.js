const express = require('express');
const router = express.Router();

const {
    createVehicle,
    getVehicles,
    getVehiclesByUser,
    getVehicleDetails,
    deleteVehicle,
} = require('../controllers/Vehicle');

const {auth, isUser, isAdmin} = require('../middlewares/auth');

router.post('/addVehicle', auth, isUser, createVehicle); // Adjust this line if necessary
router.get('/getVehicles', auth, isAdmin, getVehicles);
router.get('/getVehiclesByUser', auth, getVehiclesByUser);
router.get('/getVehicle', auth, getVehicleDetails);
router.delete('/deleteVehicle', auth, deleteVehicle);

module.exports = router;
