const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const pg_service = require('./pg_service');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('build'))

app.post('/questbin', async (req, res) => {
  // get the data from the request
  const requestData = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    url: req.originalUrl,
    query: req.query
  };

  await pg_service.insertRequestData(1, requestData);

  res.sendStatus(200);
});

app.get('/requests', async (req, res) => {
  // Get data from the request table in inverted order
  let requests = await pg_service.getAllRequests();
  res.json(requests);
});

app.get('/requests/:id', async (req, res) => {
  const request = await pg_service.getRequestById(req.params.id);
  res.json(request);
});

app.get('/endpoints/', async (req, res) => {
  const endpoints = await pg_service.getAllEndpoints()
  res.send(endpoints);
});

app.get('/endpoints/:id/requests', async (req, res) => {
  const requests = await pg_service.getRequestsForEndpoint(req.params.id);
  res.send(requests);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



