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

app.get('/questbin/test', async (req, res) => {
  // Get data from the request table in inverted order
  let readout = await pg_service.read();
  res.send(readout);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



