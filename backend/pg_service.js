const pgp = require('pg-promise')();
const db = pgp(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/questbin_project`);

db.connect()
  .then(obj => {
    console.log("connected to postgres")
    obj.done();
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

const getAllRequestBins = async () => {
  return await db.manyOrNone('SELECT uuid FROM requestbin');
}

const insertRequestData = async (uuid, requestData) => {
  return await db.none('INSERT INTO request (requestbin_id, request_body) VALUES ($1, $2)', [uuid, requestData])
};

const getAllRequests = async () => {
  return await db.manyOrNone('SELECT request_body FROM request ORDER BY id DESC');
};

const getRequestsForRequestBin = async (requestBinId) => {
  return await db.manyOrNone('SELECT request_body FROM request WHERE requestbin_id = $1', requestBinId);
}

module.exports = {
  insertRequestData,
  getAllRequests,
  getAllRequestBins,
  getRequestsForRequestBin
}