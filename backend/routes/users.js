const express = require("express");
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const router = express.Router();
const jwt = require('jsonwebtoken');

//bcryptjs saltrounds setup
const saltRounds = 10;

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userCheck = await User.findOne({username:username});
    if(!userCheck){
      return res.status(400).json({message:"User alerady exist"});
    }
    const temp_salt = await bcrypt.genSalt(saltRounds);
    const encrp_password = await bcrypt.hash(password,temp_salt);
    const user = new User({ "username":username, "password":encrp_password});
    await user.save();
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({token:token,username:username, message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log(process.env.JWT_SECERT);
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({"token":token,username:username,message:"Login in successfull!"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
