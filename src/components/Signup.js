import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const pageStyle = {
    height: '100vh',
    background: 'linear-gradient(to right, rgb(233, 248, 249), rgb(227, 232, 239))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '20px',
  };

  const formContainerStyle = {
    background: '#fff',
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.3s ease',
  };

  const loginPromptStyle = {
    marginTop: '20px',
    fontSize: '0.95rem',
    color: '#333',
  };

  const loginLinkStyle = {
    color: '#007bff',
    textDecoration: 'none',
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/signup/', {
        username: name, 
        full_name: name, 
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });
  
      if (response.status === 201) {
        alert('Signup successful!');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      alert('Signup failed: ' + (error.response?.data?.detail || 'Check your input.'));
    }
  };
  

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Create an Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            style={inputStyle}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" style={buttonStyle}>Sign Up</button>
        </form>

        <div style={loginPromptStyle}>
          Already have an account?{' '}
          <a href="/login" style={loginLinkStyle}>Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
