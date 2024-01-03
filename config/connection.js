const mongoose = require("mongoose");
const db = 'mongodb://127.0.0.1:27017/zipiflyTest'

const conn = () =>{
    try{
        mongoose.connect(db)
        console.log("DB connected")
    }catch(err){
        console.log(err)
    }
}
module.exports=conn;