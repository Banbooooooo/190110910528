const mongoose=require('./db.js')
const Schema=mongoose.Schema;
const classroomschema = new Schema({
    address:String,
    size:String
})
module.exports= mongoose.model('tclassroom', classroomschema,'tclassroom');
