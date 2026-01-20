import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import { MongoDbUrl } from "./config.js";
import { PORT } from "./config.js";

import userAuth from './routes/userAuth.js'
import medicineRoute from './routes/medicineRoute.js'
import passwordResetRoute from './routes/passwordReset.js'
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import categoryRoute from './routes/categoryRoute.js';

const app = express();

// CORS configuration for frontend
const corsOptions = {
    origin: ['http://localhost:3000', 'https://medzon.netlify.app', 'https://medizone.netlify.app'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(express.json()); //middleware for parsing request body
app.use(cors(corsOptions));

// Logging middleware for development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

app.get('/', (req,res)=>{
    return res.status(200).send('Medizone Backend is running.')
})

// API Routes
app.use('/user', userAuth);
app.use('/medicine', medicineRoute);
app.use('/medicines', medicineRoute); // Alternative route
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/orders', orderRoute); // Alternative route for frontend compatibility
app.use('/categories', categoryRoute);
app.use('/password', passwordResetRoute);
app.use('/user/forgot-password', passwordResetRoute); // Forward forgot password to password reset
app.use('/user/reset-password', passwordResetRoute); // Forward reset password

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

mongoose.connect(MongoDbUrl)
        .then(()=>{
            console.log('App is connected to database.');
            app.listen(PORT, ()=> {
                console.log(`app is listening on port no. ${PORT}`);
            });
        })
        .catch((error)=>{
            console.log(error);
        })