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

const getAllEndpoints = async () => {
  return await db.manyOrNone('SELECT uuid FROM endpoint');
}

const insertRequestData = async (uuid, requestData) => {
  return await db.none('INSERT INTO request (endpoint_id, request_data) VALUES ($1, $2)', [uuid, requestData])
};

const getAllRequests = async () => {
  return await db.manyOrNone('SELECT endpoint.uuid, request.id, time_stamp, request_data FROM request JOIN endpoint ON request.endpoint_id = endpoint.id ORDER BY id DESC');
};

const getRequestsForEndpoint = async (endpointId) => {
  return await db.manyOrNone('SELECT request_data FROM request WHERE endpoint_id = $1', endpointId);
}

module.exports = {
  insertRequestData,
  getAllRequests,
  getAllEndpoints,
  getRequestsForEndpoint
}

