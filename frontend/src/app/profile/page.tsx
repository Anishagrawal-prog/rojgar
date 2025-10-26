"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // 1. IMPORT OUR HOOK (Fixed path)
import Link from 'next/link';

const API_URL = 'http://localhost:4001/api';

export default function ProfilePage() {
  // 2. GET USER INFO AND TOKEN FROM CONTEXT
  const { user, token, loading: authLoading, logout } = useAuth();

  // 3. STATE TO HOLD THE DATA WE FETCH
  const [projects, setProjects] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. FETCH DATA WHEN THE PAGE LOADS
  useEffect(() => {
    // Only fetch if we are logged in (we have a token)
    if (token) {
      fetchData();
    }
  }, [token]); // This effect runs whenever the token changes

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // --- FETCH PROJECTS ---
      const projectsRes = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token
        },
      });
      if (!projectsRes.ok) throw new Error('Failed to fetch projects');
      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      // --- FETCH INTERVIEWS ---
      // (Assuming you have this route in your backend)
      // const interviewsRes = await fetch(`${API_URL}/interviews`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      // if (!interviewsRes.ok) throw new Error('Failed to fetch interviews');
      // const interviewsData = await interviewsRes.json();
      // setInterviews(interviewsData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle loading and non-logged-in states
  if (authLoading) {
    return <p>Loading application...</p>;
  }

  if (!token || !user) {
    return (
      <div style={{ padding: '20px' }}>
        <p>You must be logged in to view this page.</p>
        <Link href="/">Go to Login</Link>
      </div>
    );
  }

  // 5. RENDER THE PROFILE
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <Link href="/">Back to Home</Link>
      {/* Fixed the closing button tag here */}
      <button onClick={logout} style={{ float: 'right' }}>Logout</button>
      
      <h1>{user.email}'s Profile</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <hr style={{ margin: '20px 0' }} />

      <h2>My Projects</h2>
      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {projects.length > 0 ? (
        <ul>
          {projects.map((project: any) => (
            <li key={project.id}>
              <strong>{project.title}</strong>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>You have not created any projects yet.</p>
      )}

      {/* You can add a similar section for interviews here */}
      {/* <h2>My Interviews</h2> ... */}

    </div>
  );
}

