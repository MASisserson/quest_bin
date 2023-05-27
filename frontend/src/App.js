import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'


// HOME ====================================================================
const HomePage = () => {
  return (
    <section className='home-page'>
      <h2>Home</h2>
    </section>
  )
}

// FEED ====================================================================

const FeedPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getAllRequests = async () => {
      try {
        const response = await axios.get('/requests');
        setRequests(response.data);
        // console.log(response.data);

      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    getAllRequests()
  }, []);

  return (
    <section className='feed-page'>
      <h2>Request Feed</h2>
      <RequestList requests={requests} />
    </section>
  )
}

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

  useEffect(() => {
    const getAllEndpoints = async () => {
      try {
        const response = await axios.get('/endpoints');
        setEndpoints(response.data);
        console.log(response.data);

      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    getAllEndpoints();
  }, []);

  return (
    <section className='endpoints-page'>
      <h2>Endpoints</h2>
      <EndpointList endpoints={endpoints} />

    </section>
  )
}

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
  const [selectedRequest, setSelectedRequest] = useState(null);
  const endpointURL = `${window.location.origin}/endpoints/${id}`;

  useEffect(() => {
    const getEndpointRequests = async () => {
      try {
        const response = await axios.get(`/endpoints/${id}/requests`);
        console.log(response.data);

        setRequests(response.data);
      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    getEndpointRequests();
  }, [id])

  const handleRequestClick = async (requestId) => {
    const request = await axios.get(`/requests/${requestId}`);
    setSelectedRequest(request.data);
  };

  return (
    <section className='endpoint-detail-page'>
      <section>
        <p>Your endpoint is:</p>
        <h3>{endpointURL}</h3>
      </section>
      <section className='endpoint-detail-content'>
        <section className='endpoint-detail-sidebar'>
          <h2>Requests</h2>
          <EndpointDetailSidebar
            requests={requests}
            onRequestClick={handleRequestClick}
            selectedRequestId={selectedRequest ? selectedRequest.id : null}
          />
        </section>
        <section className='endpoint-detail-main'>
          <h3>Request Detail</h3>
          <EndpointDetailContent request={selectedRequest} />
        </section>
      </section>
    </section>
  )
}

const EndpointDetailSidebar = ({ requests, onRequestClick, selectedRequestId }) => {
  if (requests.length === 0) {
    return <p>No requests.</p>
  }

  const requestLineItems = () => {
    return requests.map(request => {
      const { id, time_stamp, request_data } = request;
      const method = request_data.method;
      const timestamp = new Date(time_stamp).toLocaleString();

      return (
        <li
          key={id}
          onClick={() => onRequestClick(id)}
          className={`request-item ${selectedRequestId === id ? 'request-selected' : ''}`}
        >
          {`${method} ${timestamp}`}
        </li>)
    })
  }

  return (
    <ul>
      {requestLineItems()}
    </ul>
  );
};

const EndpointDetailContent = ({ request }) => {
  if (!request) {
    return <p>Select a request to see details</p>
  }

  return (
    <div>
      <JsonView src={request} />
    </div>
  )
}

// APP =========================================================================

const App = () => {
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
        <Route path="/" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/endpoints" element={<EndpointsPage />} />
        <Route path="/endpoints/:id" element={<EndpointDetailPage />} />
      </Routes>
    </>
  );
};

export default App;
