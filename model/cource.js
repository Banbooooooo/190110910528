const mongoose=require('./db.js')
const Schema=mongoose.Schema;
const courceschema = new Schema({
    name:String,
    grade:String,
    teacher:String
})
module.exports = mongoose.model('tcource', courceschema,'tcource');
