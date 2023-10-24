import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { setIsLoggedIn } = useStateContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Implement your login logic here and get the JWT token
    // const token = await yourLoginFunction(credentials.username, credentials.password);
    const token = "valido";

    if (token) {
      // Set the token in local storage
      localStorage.setItem('token', token);
      // Set the user as authenticated
      setIsLoggedIn(true);
      navigate('/protected/dashboard');
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <form onSubmit={handleLogin}>
          <div className='form-group'>
            <input
              className='login-input'
              type='text'
              id='username'
              name='username'
              value={credentials.username}
              onChange={handleChange}
              placeholder='Enter your username'
              required
            />
          </div>
          <div className='form-group'>
            <input
            className='login-input'
              type='text'
              id='password'
              name='password'
              value={credentials.password}
              onChange={handleChange}
              placeholder='Enter your password'
              required
            />
          </div>
          <button className='login-btn' type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
