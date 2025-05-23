var express = require('express');
var router = express.Router();
var User = require("../model/user");
var Alert = require("../model/alerts");

router.post('/', async (req, res) => {
    try {
      const { devicename } = req.body;
      const username = req.user.username;
      if (!username) return res.status(400).json({ error: 'username is required' });
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
      const user = await User.findOne({"username":req.user.username});
      if(!user){
        return res.status(404).json({message:"User not found!"});
      }
      res.json({"devices":user.device});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  router.get('/:devicename', async (req, res) => {
    try{
      const {devicename} = req.params;
      console.log();
      const user = await User.findOne({"username":req.user.username});
      if(!user){
        return res.status(404).json({message:"User not found!"});
      }
      
      const device = user.device.find(d => d.device_name === devicename);

      if(!device){
        return res.status(404).json({message:"Device not found"});
      }

      let alerts = await Alert.find({device_name:devicename});
      console.log(alerts)
      alerts = alerts.filter(ele => {
        return ele.risk.match("High") || ele.risk.match("Moderate")
      });
      return res.status(200).send(alerts);

    }catch(err){
      console.log(err);
      return res.status(500).json({message:err});
    }
  });


  router.get('/download',async(req,res)=>{
    try {
      const fileUrl = `https://drive.google.com/file/d/1BjGzj70W1XbI6S8chdkZMZj6Tqq5uIC4/view?usp=drive_link`;
      res.redirect(fileUrl)
    } catch (error) {
      console.error("Download error:", error.message);
      res.status(500).send("Failed to download file.");
    }

  })


  router.get('/:devicename/all', async (req, res) => {
    try{
      const {devicename} = req.params;
      const user = await User.findOne({"username":req.user.username});
      if(!user){
        return res.status(404).json({message:"User not found!"});
      }
      
      const device = user.device.find(d => d.device_name === devicename);

      if(!device){
        return res.status(404).json({message:"Device not found"});
      }

      let alerts = await Alert.find({device_name:devicename});
      return res.status(200).send(alerts);

    }catch(err){
      console.log(err);
      return res.status(500).json({message:err});
    }
  });

module.exports = router;