import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  NavLink,
} from "react-router-dom";
import axios from "axios";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

// HOME ====================================================================
const HomePage = ({ handleClick }) => {
  return (
    <section className="home-page">
      <section className="page-header">
        <h2>Home</h2>
        <Link to="#" onClick={handleClick}>
          Create URL Endpoint
        </Link>
      </section>
      <section className="home-page-content">
        <h1>Examine HTTP requests and webhooks</h1>
        <p>
          Use a URL endpoint to capture HTTP or webhook requests and examine
          them using an intuitive UI
        </p>
        <Link to="#" onClick={handleClick}>
          Create URL Endpoint
        </Link>
      </section>
    </section>
  );
};

// FEED ====================================================================

const FeedPage = ({ handleClick }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getAllRequests = async () => {
      try {
        const response = await axios.get("/api/requests");
        setRequests(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log("ERROR:", error);
      }
    };

    getAllRequests();
  }, []);

  return (
    <section className="feed-page">
      <section className="page-header">
        <h2>Request Feed</h2>
        <Link to="#" onClick={handleClick}>
          Create URL Endpoint
        </Link>
      </section>
      <RequestList requests={requests} />
    </section>
  );
};

const RequestList = ({ requests }) => {
  if (requests.length === 0) {
    return (
      <section className="request-feed-list">
        <p>No requests yet</p>
      </section>
    );
  }

  const requestLineItems = () => {
    return requests.map((request) => {
      const { id, uuid, time_stamp, request_data } = request;
      const method = request_data.method;
      const timestamp = new Date(time_stamp).toLocaleString();

      return (
        <li key={id}>
          <Link to={`/endpoints/${uuid}`}>
            <span className="method">{method}</span>
            <span className="uuid">{uuid}</span>
            <span>{timestamp}</span>
          </Link>
        </li>
      );
    });
  };

  return <ul className="request-feed-list">{requestLineItems()}</ul>;
};

// ENDPOINTS ===================================================================

const EndpointsPage = ({ handleClick }) => {
  const [endpoints, setEndpoints] = useState([]);

  useEffect(() => {
    const getAllEndpoints = async () => {
      try {
        const response = await axios.get("/api/endpoints");
        setEndpoints(response.data);
      } catch (error) {
        console.log("ERROR:", error);
      }
    };

    getAllEndpoints();
  }, []);

  return (
    <section className="endpoints-page">
      <section className="page-header">
        <h2>Endpoints</h2>
        <Link to="#" onClick={handleClick}>
          Create URL Endpoint
        </Link>
      </section>
      <EndpointList endpoints={endpoints} />
    </section>
  );
};

const EndpointList = ({ endpoints }) => {
  if (endpoints.length === 0) {
    return (
      <section className="request-feed-list">
        <p>No endpoints. Click "Create URL Endpoint".</p>
      </section>
    );
  }

  const endpointLineItems = () => {
    return endpoints.map((endpoint) => {
      return (
        <li key={endpoint.id}>
          <Link to={`/endpoints/${endpoint.uuid}`}>{endpoint.uuid}</Link>
        </li>
      );
    });
  };

  return <ul className="endpoint-list">{endpointLineItems()}</ul>;
};

// ENDPOINT DETAIL =============================================================

const EndpointDetailPage = ({ handleClick }) => {
  const { uuid } = useParams();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const endpointURL = `${window.location.origin}/api/questbin/${uuid}`;

  useEffect(() => {
    const getEndpointRequests = async () => {
      try {
        const response = await axios.get(`/api/endpoints/${uuid}/requests`);
        // console.log(response.data);
        setRequests(response.data);
      } catch (error) {
        console.log("ERROR:", error);
      }
    };

    getEndpointRequests();
  }, [uuid]);

  const handleRequestClick = async (requestId) => {
    const request = await axios.get(`/api/requests/${requestId}`);
    console.log(request);

    setSelectedRequest(request.data);
  };

  return (
    <section className="endpoint-detail-page">
      <section className="page-header">
        <h2>Endpoint Detail</h2>
        <Link to="#" onClick={handleClick}>
          Create URL Endpoint
        </Link>
      </section>
      <section className="current-endpoint">
        <p>Your endpoint is:</p>
        <h3>{endpointURL}</h3>
      </section>
      <section className="endpoint-detail-container">
        <section className="endpoint-detail-header">
          <h2>Captured Requests</h2>
        </section>

        <section className="endpoint-detail-content">
          <section className="endpoint-detail-sidebar">
            <EndpointDetailSidebar
              requests={requests}
              onRequestClick={handleRequestClick}
              selectedRequestId={selectedRequest ? selectedRequest.id : null}
            />
          </section>
          <section className="endpoint-detail-main">
            <EndpointDetailContent request={selectedRequest} />
          </section>
        </section>
      </section>
    </section>
  );
};

const EndpointDetailSidebar = ({
  requests,
  onRequestClick,
  selectedRequestId,
}) => {
  if (requests.length === 0) {
    return <p>No requests</p>;
  }

  const requestLineItems = () => {
    return requests.map((request) => {
      const { id, time_stamp, request_data } = request;
      console.log("ID", id, selectedRequestId);
      const method = request_data.method;
      const timestamp = new Date(time_stamp).toLocaleString();

      return (
        <li
          key={id}
          onClick={() => onRequestClick(id)}
          className={`${
            selectedRequestId === id
              ? "request-selected request-line-item"
              : "request-line-item"
          }`}
        >
          <span>{method}</span>
          <span>{timestamp}</span>
        </li>
      );
    });
  };

  return <ul className="endpoint-detail-list">{requestLineItems()}</ul>;
};

const EndpointDetailContent = ({ request }) => {
  if (!request) {
    return <p>Select a request to see details</p>;
  }

  delete request.id;

  return (
    <div>
      <JsonView src={request} collapseObjectsAfterLength={13} />
    </div>
  );
};

// APP =========================================================================

const App = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await axios.get("/api/createuuid");
      const uuid = response.data;
      navigate(`/endpoints/${uuid}`);
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  return (
    <>
      <nav className="navigation">
        <ul>
          <li className="questbin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-swords"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M21 3v5l-11 9l-4 4l-3 -3l4 -4l9 -11z"></path>
              <path d="M5 13l6 6"></path>
              <path d="M14.32 17.32l3.68 3.68l3 -3l-3.365 -3.365"></path>
              <path d="M10 5.5l-2 -2.5h-5v5l3 2.5"></path>
            </svg>
            QUESTBIN
          </li>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/feed">Feed</NavLink>
          </li>
          <li>
            <NavLink to="/endpoints">Endpoints</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage handleClick={handleClick} />} />
        <Route path="/feed" element={<FeedPage handleClick={handleClick} />} />
        <Route
          path="/endpoints"
          element={<EndpointsPage handleClick={handleClick} />}
        />
        <Route
          path="/endpoints/:uuid"
          element={<EndpointDetailPage handleClick={handleClick} />}
        />
      </Routes>
    </>
  );
};

export default App;
