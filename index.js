import express from "express";
import mongoose from "mongoose";
import { MongoDbUrl } from "./config.js";
import { PORT } from "./config.js";
import userAuth from './routes/userAuth.js'
import cors from 'cors';

const app = express();
app.use(express.json()); //middleware for parshing request body
app.use(cors())

app.get('/', (req,res)=>{
    console.log(req);
    return res.status(234).send('Backend is running.')
})

app.use('/user', userAuth);

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