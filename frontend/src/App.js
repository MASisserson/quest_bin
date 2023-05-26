import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import axios from 'axios';

const FeedPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getAllRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/requests');
        setRequests(response.data);
        console.log(response.data);

      } catch (error) {
        console.log("ERROR:", error);
      }
    }

    getAllRequests()
  }, [])

  return (
    <>
      <h2>Feed list</h2>
      <RequestList requests={requests} />
    </>
  )
}

const RequestList = ({ requests }) => {
  const requestLineItems = () => {
    return requests.map(request => {
      return (<li key={request.id}>{request.request_data.method}</li>)
    })
  }

  return (
    <ul>
      {requestLineItems()}
    </ul>
  )
}

const EndpointsPage = () => {
  const [endpoints, setEndpoints] = useState([]);

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

    getAllEndpoints()
  }, [])

  return (
    <>
      <h2>Endpoint List</h2>
      <EndpointList endpoints={endpoints} />
    </>
  )
}

const EndpointList = ({ endpoints }) => {
  const endpointLineItems = () => {
    return endpoints.map(endpoint => {
      return (<li key={endpoint.id}>{endpoint.uuid}</li>)
    })
  }

  return (
    <ul>
      {endpointLineItems()}
    </ul>
  )
}



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
        <Route path="/" element={<h2>Home</h2>} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/endpoints" element={<EndpointsPage />} />
      </Routes>
    </>
  )
}

export default App;
