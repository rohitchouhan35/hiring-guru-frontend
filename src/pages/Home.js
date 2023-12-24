import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div>
    <Navbar />
    <div className="home" style={{marginTop: "50px"}}>
      <header>This is home</header>
    </div>
    </div>
  )
}

export default Home
