import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';

// FEED ====================================================================

const FeedPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getAllRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/requests');
        setRequests(response.data);
        // console.log(response.data);

      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    getAllRequests()
  }, []);

  return (
    <>
      <h2>Request Feed</h2>
      <RequestList requests={requests} />
    </>
  );
};

const RequestList = ({ requests }) => {
  const requestLineItems = () => {
    return requests.map(request => {
      return (
        <Link to={`/endpoints/${request.endpoint_id}`} key={request.id}>
          <li key={request.id}>{request.request_data.method} {request.time_stamp} {request.uuid}</li>
        </Link>
      );
    });
  };

  console.log(requests);

  return (
    <ul>
      {requestLineItems()}
    </ul>
  );
};


// ENDPOINTS ===================================================================

const EndpointsPage = () => {
  const [endpoints, setEndpoints] = useState([]);
  // const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  useEffect(() => {
    const getAllEndpoints = async () => {
      try {
        const response = await axios.get('http://localhost:3001/endpoints');
        setEndpoints(response.data);
        console.log(response.data);

      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    getAllEndpoints();
  }, []);

  // const handleEndpointClick = (endpointId) => {

  // }

  return (
    <>
      <h2>Endpoints</h2>
      <EndpointList endpoints={endpoints} />
    </>
  );
};

const EndpointList = ({ endpoints }) => {
  const endpointLineItems = () => {
    return endpoints.map(endpoint => {
      return (
        <Link to={`/endpoints/${endpoint.id}`} key={endpoint.id}>
          <li >{endpoint.uuid}</li>
        </Link>
      );
    });
  };

  return (
    <ul>
      {endpointLineItems()}
    </ul>
  );
};

// ENDPOINT DETAIL =============================================================

const EndpointDetailPage = () => {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getEndpointRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/endpoints/${id}/requests`);
        console.log(response.data);

        setRequests(response.data);
      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    getEndpointRequests();
  }, []);

  return (
    <>
      <p>You endpoint is:</p>
      <h3>http://localhost:3001/endpoints/{id}</h3>
      <h2>Requests</h2>
      {EndpointRequestSidebar({ requests })}

    </>
  );
};

const EndpointRequestSidebar = ({ requests }) => {
  console.log("in endpointrequestsidebar", requests);

  const requestLineItems = () => {
    return requests.map(request => {
      return <li key={request.id}>{JSON.stringify(request)}</li>
    });
  }

  return (
    <ul>
      {requestLineItems()}
    </ul>
  );
};

// APP =========================================================================

const App = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  return (
    <>
      <nav className='navigation'>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/feed">Feed</Link>
          </li>
          <li>
            <Link to="/endpoints">Endpoints</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<h2>Home</h2>} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/endpoints" element={<EndpointsPage />} />
        {/* <Route path="/endpoints" element={<EndpointsPage setSelectEndpoint={setSelectedEndpoint} />} /> */}
        <Route path="/endpoints/:id" element={<EndpointDetailPage />} />
      </Routes>
    </>
  );
};

export default App;
