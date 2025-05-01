var express = require('express');
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
  });
});

router.post('/event', (req, res) => {
  const word = req.body.word;
  console.log('Received:', word);
  for (const client of clients) {
      client.write(`data: ${word}\n\n`);
  }
  res.status(200).json({ message: 'Word broadcasted' });
});


module.exports = router;
