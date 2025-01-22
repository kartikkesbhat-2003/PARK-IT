const mongoose = require( "mongoose" );
require( "dotenv" ).config();

exports.connect = () => {
    // mongoose.connect(process.env.DATABASE_URL, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // })
    mongoose.connect(process.env.DATABASE_URL)

    .then(() => console.log( "MongoDB Connected!" ))
    .catch((err) => {
        console.log("Error connecting to MongoDB");
        console.log(err.message);
        process.exit(1);
    })
}
