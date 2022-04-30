import mongoose from 'mongoose';
import { MongoClient } from "mongodb";
import { dbUrl } from "../dot-env.js";
const dbConnection = () => {
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.on('error', (e) => {
        console.log(e);
    }).once('open', () => {
        console.log('database connected');
    });
    //mongoose.disconnect().then(() => { console.log('aeeehohho'); }).catch((e) => { console.log(e.message) }); 
}

export default dbConnection;