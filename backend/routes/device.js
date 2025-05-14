var express = require('express');
var router = express.Router();
var User = require("../model/user");
var Alert = require("../model/alerts");

router.post('/', async (req, res) => {
    try {
      const { devicename, username } = req.body;
      // console.log(req.user);
      if (!username) return res.status(400).json({ error: 'userId is required' });
      const user = await User.findOne({"username":username});
      if(!user){
        console.log("User not found!");
        return res.status(404).json({message:"User not found!"});
      }
      const existingDevice = user.device.find(
        (d) => d.device_name === devicename
      );
      if (existingDevice) {
        console.log("Device already exists for this user.");
        return res.status(400).json({message:"Device already exists for this user."});
      }
      user.device.push({device_name:devicename});
      await user.save();  
      res.status(201).json({ message: 'Device added', device: devicename });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add device' });
    }
  });
  
  // Get all devices for a specific user
  router.get('/', async (req, res) => {
    try {
      const { username } = req.query;
      if (!username) return res.status(400).json({ error: 'username is required' });
  
      const user = await User.findOne({ username });
      res.json({"devices":user.device});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });
  

  router.get('/:devicename', async (req, res) => {
    
    /// here you write the quries according to the data base 
    // here data should be displayed on react about the device 

  });

module.exports = router;