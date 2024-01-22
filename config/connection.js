const mongoose = require("mongoose");
const db = 'mongodb+srv://rafiulfaisal:TiRe7BAvyeT2291h@zipifly.9chbgrz.mongodb.net/?retryWrites=true&w=majority'

const conn = () =>{
    try{
        mongoose.connect(db)
        console.log("DB connected")
    }catch(err){
        console.log(err)
    }
}
module.exports=conn;
// rafiulfaisal TiRe7BAvyeT2291h