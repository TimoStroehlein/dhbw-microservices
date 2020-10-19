const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    console.log(`handle event: ${type}`);
    if (type === 'PostCreated') {
      const { id, title } = data;
  
      posts[id] = { id, title, comments: [] };
    }
  
    if (type === 'CommentCreated') {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      post.comments.push({ id, content, status });
    }
  
    if (type === 'CommentUpdated') {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      const comment = post.comments.find(comment => {
        return comment.id === id;
      });
  
      comment.status = status;
      comment.content = content;
    }
};

app.get('/posts', (request, response) => {
    console.log(posts);
    response.send(posts);
});

app.post('/events', (request, response) => {
    console.log('Event received', request.body.type);
    const { type, data } = request.body;

    handleEvent(type, data);
    
    console.log(posts);
    response.send(posts);
});

app.listen(4002, async () => {
    console.log('Listening on 4002');

    const res = await axios.get('http://events:4005/events');

    for( let event of res.data) {
        console.log('processing event:', event.type)

        // Now invoke the routine to handle the events
        handleEvent(event.type, event.data);
    }
});
