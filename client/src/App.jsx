import { Routes, Route, Link } from 'react-router-dom'
import AuthTest from './test/auth/AuthTest'
import Home from './components/Home';

function App() { 

  return (
    <>
      <nav className="flex justify-center space-x-4 p-4 bg-gray-100 p-4 dark:bg-gray-900">
        <Link to="/test/auth">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
            AUTH API TEST
          </button>
        </Link>
        <Link to="/home">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
            Go Home
          </button>
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
