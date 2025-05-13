var express = require('express');
var router = express.Router();
var User = require("../model/user");
var {connection} = require("../model/connection")

/* GET users listing. */
router.get('/', async function(req, res, next) {
  await connection();
  const user = new User({username:"void",name:"parent1",password:"passs"});
  await user.save().then(()=>{
    console.log("User saved!");
  })
  res.send('respond with a resource');
});

module.exports = router;
