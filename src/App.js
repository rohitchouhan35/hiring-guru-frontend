import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Meet from './pages/Meet';
import { ContextProvider } from './contexts/ContextProvider';

function App() {
  return (
    <div className="App">
      <Navbar />
      <ContextProvider> {/* Wrap your app with the context provider */}
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/meet" element={<Meet />} />
            <Route path="/protected/*" element={<ProtectedRoutes />} /> {/* Protect routes starting with /protected */}
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ContextProvider>
    </div>
  );
}

export default App;
