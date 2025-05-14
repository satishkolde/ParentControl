var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const axios = require('axios');
const clients = []
const Alert = require('../model/alerts');
const User = require("../model/user");

/* GET home page. */
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
      clients = clients.filter(c => c !== res);
  });});

router.post('/event', async (req, res) => {
  try {
    const { word: text, device } = req.body;
    console.log('Received:', text, device);
    const user = await User.findOne({
      device: { $elemMatch: { device_name: device } }
    });

    if(!user){
      return res.status(400).json({message:"Forbidden"});
    }

    // 1. ML Prediction - call Flask API
    const response = await axios.post('http://localhost:8000/predict', { text });
    const sentiment = response.data.sentiment;
    const risk = response.data.risk;
    const context = response.data.context;

    // 2. Save to MongoDB
    const alert = new Alert({device_name:device,text:text,sentiment:sentiment,risk:risk,context:context});
    await alert.save();

    // 3. Send response
    res.status(200).json({ text, sentiment,risk,context });
  } catch (error) {
    console.error('Error in /event:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}); 



module.exports = router;
