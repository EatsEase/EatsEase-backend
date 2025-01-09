const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();
const port = 8000;
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'EatsEase' });
        console.log('MongoDB connected');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

connectDb();

app.use(express.json());
app.use('/api', require('./routes/apiRouter'));

app.listen(port, () => console.log(`Server running on port ${port}`));