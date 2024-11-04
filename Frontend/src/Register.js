import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      try {
        const response = await axios.post('http://localhost:3000/register', {
          name,
          email,
          password,
        });

        console.log('Registration successful:', response.data);
        setSuccessMessage('Registration successful! You can now log in.');

        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        console.error('Registration error:', err);
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } else {
      setError('Passwords do not match');
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
              <a className="nav-link" href="/">Home</a>
            </li>
           
            <li className="nav-item">
              <a className="nav-link" href="/login">Login</a>
            </li>
          
          </ul>
        </div>
      </nav>
      <div className="container mt-5">
        <form className="p-4 shadow-sm bg-light" onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
