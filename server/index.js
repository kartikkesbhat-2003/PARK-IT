const express = require('express');
const app = express();

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors'); //backened entertain the front request
const dotenv = require('dotenv');
const userRoutes = require('./routes/User');

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
)

app.use("/api/v1/auth", userRoutes);

//default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running..."
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})