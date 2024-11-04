import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Login.css'; // Optional: Your custom CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Optional: For success/error messages
  const navigate = useNavigate(); // Initialize useNavigate

  // Redirect to dashboard if token is found in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', { // Replace with your API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        console.log('Token:', data.token);
        
        localStorage.setItem('token', data.token); // Store token in local storage
        navigate('/dashboard'); // Navigate to the dashboard on successful login
      } else {
        setMessage(`Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred during login');
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">Cross Wallet</a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/">Home <span className="sr-only"></span></a>
            </li>
           
            <li className="nav-item">
              <a className="nav-link" href="/register">Register</a>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="container mt-2">
        <form className="p-4 shadow-sm bg-light" onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Login</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
          {message && <p className="text-center mt-3">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
