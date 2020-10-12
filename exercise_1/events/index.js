const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const events = [];

app.get('/events', (request, response) => {
    console.log(events);
    response.send(events);
}); 

app.post('/events', (request, response) => {
    const event = request.body;

    console.log(event);
    events.push(event);

    axios.post('http://localhost:4000/events', event);
    axios.post('http://localhost:4001/events', event);
    axios.post('http://localhost:4002/events', event);
    axios.post('http://localhost:4003/events', event);

    response.send({ status: 'ok event forwarded'});
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});
