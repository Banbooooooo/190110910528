const mongoose=require('./db.js')
const Schema=mongoose.Schema;
const userschema = new Schema({
    username:String,
    password:String,
    sex:String,
    birth:Date,
    department:String,
    grade:String
})
module.exports = mongoose.model('tuser', userschema,'tuser');