import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" required />
        </div>
        <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Register</button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Have an Account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
      </div>
    </div>
  );
};
export default Register;