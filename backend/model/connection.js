const mongoose = require("mongoose");

async function connection(){
    await mongoose.connect(process.env.MONGODB_LINK).then(()=>{
        console.log("Connection is successfull!!");
    }).catch((err)=>{
        console.log(err);
    })
}

async function disconnect(){
    await mongoose.disconnect().then(()=>{
        console.log("Disconnection successfull!");
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports = {connection,disconnect};