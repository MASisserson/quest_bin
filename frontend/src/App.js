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
      return (<li>{request.request_body.method}</li>)
    })
  }

  return (
    <ul>
      {requestLineItems()}
    </ul>
  )
}



const App = () => {
  return (
    <>
      <nav>
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
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/endpoints" element={<h1>Endpoints</h1>} />
      </Routes>
    </>
  )
}

export default App;
