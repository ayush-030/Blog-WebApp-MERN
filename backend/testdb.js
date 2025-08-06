
    const mongoose = require('mongoose');
    require('dotenv').config(); 

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error("MONGODB_URI is not defined in your .env file!");
        process.exit(1);
    }

    console.log("Attempting to connect to MongoDB with URI:", MONGODB_URI);

    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Test Connection: MongoDB connected successfully!');
            mongoose.connection.close(); 
        })
        .catch(err => {
            console.error('Test Connection: MongoDB connection error:', err);
           
            console.error('Full Error Object:', JSON.stringify(err, null, 2));
            process.exit(1);
        });
    