import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import { useStateContext } from './contexts/ContextProvider';
import HmeApis from './services/HmeApis';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './components/Navbar';

import Login from './pages/Login';

function App() {
  const { isLoggedIn, setIsLoggedIn } = useStateContext();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-REQUEST-ID': uuidv4(),
        'X-SESSION-ID': uuidv4(),
        'x-source': 'web',
      },
    };

    if (!accessToken) {
      // Handle the case where the user is not logged in
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
    <Navbar />
      <Router>
        <Routes>
          <Route path="/login" component={Login} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
