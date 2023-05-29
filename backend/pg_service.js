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

const insertEndpoint = async (uuid) => {
  return await db.none('INSERT INTO endpoint (uuid) VALUES ($1)', uuid);
};

const getAllEndpoints = async () => {
  return await db.manyOrNone('SELECT id, uuid FROM endpoint');
}

const getEndpointIdByUuid = async (uuid) => {
  return await db.one('SELECT id FROM endpoint WHERE uuid = $1', uuid);
}

const insertRequestData = async (endpointId, requestData) => {
  return await db.none('INSERT INTO request (endpoint_id, request_data) VALUES ($1, $2)', [endpointId, requestData])
};

const getAllRequests = async () => {
  return await db.manyOrNone('SELECT endpoint.id AS endpoint_id, endpoint.uuid, request.id, time_stamp, request_data FROM request JOIN endpoint ON request.endpoint_id = endpoint.id ORDER BY id DESC');
};

const getRequestById = async (requestId) => {
  return await db.one('SELECT id, request_data FROM request WHERE id = $1', requestId);
};

const getRequestsForEndpoint = async (endpointUuid) => {
  // return await db.manyOrNone('SELECT id, time_stamp, request_data, uuid FROM request JOIN endpoint ON WHERE endpoint_id = $1 ORDER BY id DESC', endpointId);
  return await db.manyOrNone('select request.id, time_stamp, request_data from request JOIN endpoint ON request.endpoint_id = endpoint.id WHERE uuid = $1 ORDER BY id DESC', endpointUuid);
}

module.exports = {
  insertRequestData,
  getAllRequests,
  getRequestById,
  getAllEndpoints,
  getRequestsForEndpoint,
  insertEndpoint,
  getEndpointIdByUuid
}

