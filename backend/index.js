const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const pg_service = require('./pg_service');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(cors());
app.use(express.static('build'))

app.all('/api/questbin/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const { id: endpointId } = await pg_service.getEndpointIdByUuid(uuid);

  const requestData = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    url: req.originalUrl,
    query: req.query
  };

  await pg_service.insertRequestData(endpointId, requestData);
  res.sendStatus(200);
});

app.get('/api/createuuid', async (req, res) => {
  const uuid = uuidv4();
  await pg_service.insertEndpoint(uuid);
  res.json(uuid)
});

app.get('/api/requests', async (req, res) => {
  // Get data from the request table in inverted order
  let requests = await pg_service.getAllRequests();
  res.json(requests);
});

app.get('/api/requests/:id', async (req, res) => {
  const request = await pg_service.getRequestById(req.params.id);
  res.json(request);
});

app.get('/api/endpoints/', async (req, res) => {
  const endpoints = await pg_service.getAllEndpoints()
  res.json(endpoints);
});

app.get('/api/endpoints/:uuid/requests', async (req, res) => {
  const requests = await pg_service.getRequestsForEndpoint(req.params.uuid);
  res.send(requests);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



