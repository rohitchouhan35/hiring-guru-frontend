import React from 'react'
import logo from './logo_dark.png'
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={logo} alt="HME Logo" />
      </div>
      <div className="button-container">
        <button className="find-job-button">Find Job</button>
        <button className="post-job-button">Hire Talent</button>
      </div>
    </div>
  )
}

export default Navbar
