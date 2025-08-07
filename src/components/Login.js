import React, { useState, useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect to dashboard if token already exists
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);   // ✅ Save JWT access token
        localStorage.setItem('refresh', data.refresh); // ✅ Save refresh token (optional)
        alert('Login successful!');
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  // Styling
  const pageStyle = {
    height: '100vh',
    background: 'linear-gradient(to right, #ffecd2, rgb(245, 229, 223))',
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

  const forgotPasswordStyle = {
    textAlign: 'right',
    fontSize: '0.9rem',
    marginTop: '-5px',
    marginBottom: '15px',
  };

  const forgotPasswordLink = {
    color: '#007bff',
    textDecoration: 'none',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.3s ease',
  };

  const signupPromptStyle = {
    marginTop: '20px',
    fontSize: '0.95rem',
    color: '#333',
  };

  const signupLinkStyle = {
    marginTop: '10px',
    padding: '12px',
    width: '100%',
    display: 'inline-block',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: '0.3s ease',
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Login to Travel Buddy</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <div style={forgotPasswordStyle}>
            <a href="/forgot-password" style={forgotPasswordLink}>
              Forgot Password?
            </a>
          </div>
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <div style={signupPromptStyle}>
          Don’t have an account?
          <br />
          <a href="/signup" style={signupLinkStyle}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
