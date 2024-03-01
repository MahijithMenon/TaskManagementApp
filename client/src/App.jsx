// App.js
import React from 'react';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import TaskPage from './pages/PublicPage/PublicPage';
import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/publicpage/:taskId" element={<TaskPage />} />
          <Route path="*" element={<h1>Not Found 404</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
