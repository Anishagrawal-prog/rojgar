"use client";

import React, { useState, useEffect } from 'react';

// --- Define the data shapes ---
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  ownerId: number;
}

// --- This is our entire application ---
export default function HomePage() {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // --- Form State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // --- Data State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Check if we are already logged in on page load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty array means this runs only once on mount

  // 2. Login Function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // --- SUCCESS ---
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Logout Function
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setProjects([]);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 4. Fetch Projects Function
  const handleFetchProjects = async () => {
    if (!token) {
      setError("You must be logged in to fetch projects.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4001/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the token!
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }
      
      // --- SUCCESS ---
      setProjects(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER THE PAGE ---

  // If user is logged in, show the "Profile" view
  if (user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
        <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
        <h1>Welcome, {user.name}!</h1>
        <p>Email: {user.email} | Role: {user.role}</p>
        
        <hr style={{ margin: '20px 0' }} />
        
        <h2>My Projects</h2>
        <button onClick={handleFetchProjects} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch My Projects'}
        </button>
        
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {projects.length > 0 && (
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '20px' }}>
            {projects.map(project => (
              <li key={project.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // If no user, show the "Login" form
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: 'auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', fontSize: '16px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </form>
    </div>
  );
}

