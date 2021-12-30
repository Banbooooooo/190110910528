const mongoose=require('./db.js')
const Schema=mongoose.Schema;
const departmentschema = new Schema({
    name:String,
    address:String
})
module.exports= mongoose.model('tdepartment', departmentschema,'tdepartment');
