const mongoose = require("mongoose");

const conn = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected");
    } catch (err) {
        console.log(err);
    }
};

module.exports = conn;
// rafiulfaisal TiRe7BAvyeT2291h