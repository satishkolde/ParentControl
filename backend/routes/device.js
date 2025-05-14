var express = require('express');
var router = express.Router();
var User = require("../model/user");
var Alert = require("../model/alerts");
var {connection} = require("../model/connection")

router.post('/add', async (req, res) => {
    try {
      const { devicename, username } = req.body;
      if (!username) return res.status(400).json({ error: 'userId is required' });
  
      const newDevice = new User({
        devicename,
        username,
      });
  
      await newDevice.save();
      res.status(201).json({ message: 'Device added', device: newDevice });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add device' });
    }
  });
  
  // Get all devices for a specific user
  router.get('/devices', async (req, res) => {
    try {
      const { username } = req.query;
      if (!username) return res.status(400).json({ error: 'username is required' });
  
      const devices = await User.find({ username });
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });
  

  router.get('/:devicename', async (req, res) => {
  
    /// here you write the quries according to the data base 
    // here data should be displayed on react about the device 

  });