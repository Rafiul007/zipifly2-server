const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.MONGODB_URI;
const conn = () => {
    mongoose.connect(db)
    .then(() => {
        console.log('MongoDB Connnected...')
    }).catch((err) => {
        console.log('Error while Mongo Conn..', err);
    })
};

module.exports = conn;
// rafiulfaisal TiRe7BAvyeT2291h