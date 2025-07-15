import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import AuthTest from './test/auth/AuthTest'

function App() {
  return (
    <>
      <nav>
        <Link to="/test/auth">
          <button>AUTH API TEST</button>
        </Link>
        <Link to="/">
          <button>Go Home</button>
        </Link>
      </nav>

      <Routes>
        <Route path="/test/auth" element={<AuthTest />} />
      </Routes>
    </>
  );
}

export default App;
