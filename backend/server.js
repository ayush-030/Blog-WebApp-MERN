
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const blogPostsRouter = require('./routes/blogPosts'); 

app.use(cors());
app.use(express.json());


mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.use('/api/posts', blogPostsRouter); 


app.get('/', (req, res) => {
    res.send('Blog API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
