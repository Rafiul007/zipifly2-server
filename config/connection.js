const mongoose = require("mongoose");
require('dotenv').config();
console.log(process.env.MONGODB_URI);

const conn = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected");
    } catch (err) {
        console.log(err);
    }
};

module.exports = conn;
// rafiulfaisal TiRe7BAvyeT2291h