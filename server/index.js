const express = require('express');
const app = express();

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // backened entertain the front request
const dotenv = require('dotenv');
const userRoutes = require('./routes/User');
const spotRoutes = require('./routes/spot'); // Import Spot Routes
const vehicleRoutes = require('./routes/Vehicle');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');

dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect
database.connect();

//cloudinary connect
cloudinaryConnect();

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/spot", spotRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);

// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running...",
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});

