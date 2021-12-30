const mongoose=require('./db.js')
const Schema=mongoose.Schema;
const regcourceschema = new Schema({
    uid:String,
    cid:{
        type: Schema.Types.ObjectId
    }
})
module.exports= mongoose.model('tregcource', regcourceschema,'tregcource');
