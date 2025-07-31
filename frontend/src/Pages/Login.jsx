import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage('Login successful!');
      if (res.data.user.role === 'admin') {
        navigate('/admin/');
      } else {
        navigate('/');
      }
    } catch (err) {
      setMessage('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {message && <div className="login-message">{message}</div>}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          New here? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;