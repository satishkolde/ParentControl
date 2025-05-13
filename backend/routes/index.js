var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const clients = []

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

// router.post('/event', (req, res) => {
//   const word = req.body.word;
//   console.log('Received:', word);
//   for (const client of clients) {
//       client.write(`data: ${word}\n\n`);
//   }
//   res.status(200).json({ message: 'Word broadcasted' });
// });

router.post('/event', async (req, res) => {
  try {
    const text = req.body.word;
    const device = req.body.device;
    console.log('Received:', text,device);

    // 1. ML Prediction
    // const prediction = await predictText(text);

    // 2. Save to MongoDB
    // await saveToMongo(text, prediction);
  }
    catch (error) {
      console.error('Error in /event:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



module.exports = router;
