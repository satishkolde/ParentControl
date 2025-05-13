const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema({
    text:{
        type:String,
        require:true
    },
    sentiment:{
        type:String,
        require:true
    },
    context:{
        type:String,
        require:true
    },
    risk:{
        type:String,
        require:true
    },
    device_name:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('Alert', alertSchema);