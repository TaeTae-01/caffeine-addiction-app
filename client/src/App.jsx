import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import AuthTest from './test/auth/AuthTest'
import Home from './components/Home';

function App() { 

  return (
    <>
      <nav>
        <Link to="/test/auth">
          <button>AUTH API TEST</button>
        </Link>
        <Link to="/home">
          <button>Go Home</button>
        </Link>
      </nav>
      
      <Routes>
        <Route path="/test/auth" element={<AuthTest />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
