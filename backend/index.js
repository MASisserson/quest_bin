const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const pg_service = require('./pg_service');

app.use(express.json());

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
  let readout = await pg_service.getAllRequests();
  res.send(readout);
});

app.get('/requestbins/', async (req, res) => {
  const requestBins = await pg_service.getAllRequestBins()
  res.send(requestBins);

  // Get reqeuests for an individual endpoint
});

app.get('/requests/:id', async (req, res) => {
  // Get reqeuests for an individual endpoint

});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



