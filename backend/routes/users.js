const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const router = express.Router();
const {uniqueNamesGenerator,adjectives,animals,colors} = require("unique-names-generator");

//bcryptjs saltrounds setup
const saltRounds = 10;

//function to generate the unique_user_name
async function generateUniqueUserName(){
    let username;
    let exists = true;
    do{
      username = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: '_',
        length: 3,
        style: 'lowerCase'
      });
      const user = await User.findOne({"username":username});
      if(!user){
        exists = false;
      }
    }while(exists)
    return username;
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const username = await generateUniqueUserName();
    const temp_salt = await bcrypt.genSalt(saltRounds);
    const encrp_password = await bcrypt.hash(password,temp_salt);
    const user = new User({ "username":username, "password":encrp_password, "name":name });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
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

    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
      res.status(200).json({message:"Login in successfull!"});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
