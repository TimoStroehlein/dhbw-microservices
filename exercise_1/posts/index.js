const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Mongodb
const mongoose = require('mongoose');
const PostsM = require('./postsDataModel.js').PostsM;
const DB_URI = 'mongodb://dhbw-microservices-exercise1-mongo:27017/postsApp';

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("connected to mongo db");
});

const posts = {};

app.get('/posts', (request, response) => {
    // response.send(posts);
    PostsM.find()
      .then((postsData) => response.status(200).send(postsData))
      .catch((err) => response.status(400).send(err));

});

app.post('/posts', async (request, response) => {
    const id = randomBytes(4).toString('hex');
    const { title } = request.body;
    posts[id] = {
        id, title
    };

    console.log(posts[id]);

    await axios.post('http://dhbw-microservices-exercise1-events:4005/events', {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    });

    const postsM = new PostsM({
        id,
        title
    })

    postsM.save((err, postm) => {
        if (err) {
            console.log(err);
            return response.status(500).send();
        }
    })

    response.status(201).send(posts[id]);
});

app.post('/events', (request, response) => {
    console.log('event recieved', request.body.type);
    response.send({});
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});
