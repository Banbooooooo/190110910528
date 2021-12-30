const mongoose=require('./db.js')
const Schema=mongoose.Schema;
const appliclassroomschema = new Schema({
    cid:{
        type: Schema.Types.ObjectId
    },
    jid:{
        type: Schema.Types.ObjectId
    },
    usetime:String
})
module.exports = mongoose.model('tappliclassroom', appliclassroomschema,'tappliclassroom');
