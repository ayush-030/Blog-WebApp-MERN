const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/blogPosts'); 

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

const corsOptions = {
    origin: 'https://blog-web-app-mern-snowy.vercel.app', 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions)); 

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error(err));

app.use('/api/posts', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
