const mongoose = require('mongoose');
mongoose.connect('mongodb://172.21.2.236:27017/190110910528');
//mongoose.connect('mongodb://localhost/190110910528');
module.exports=mongoose;