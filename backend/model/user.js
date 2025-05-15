const mongoose = require("mongoose")

const deviceSchema = new mongoose.Schema({
    device_name:{
        type:String,
        unqiue:true
    },
    username:{
        type:String
    }
},{_id:false})

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    device:[deviceSchema]
});

module.exports = mongoose.model('User', userSchema);
