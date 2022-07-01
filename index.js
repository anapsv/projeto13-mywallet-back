import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import joi from 'joi';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();
promise.then(() => {
    db = mongoClient.db(process.env.DATABASE);
    console.log('Successfully connected to database');
});
promise.catch((err) => {
    console.log('There was an error connecting to database', err);
});

app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server on port ${process.env.PORT}`)
});