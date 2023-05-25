import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, Link } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom'

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
        <Route path="/feed" element={<h1>Feed</h1>} />
        <Route path="/endpoints" element={<h1>Endpoints</h1>} />
      </Routes>
    </>
  )
}

export default App;
