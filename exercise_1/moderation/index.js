const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('werbung') ? 'rejected' : 'approved';
    console.log('status', status);
    await axios.post('http://dhbw-microservices-exercise1-events:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }
  console.log('Event received', req.body.type);

  res.send({});
});
  

app.listen(4003, () => {
  console.log('Listening on 4003');
});
