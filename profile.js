import React, { useEffect, useState } from 'react';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await fetch("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile.");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: '#f8f5f2',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      color: '#5a4636'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.8em',
        color: '#a6895a'
      }}>My Profile</h2>
      <div style={{
        lineHeight: '1.8',
        fontSize: '1.1em'
      }}>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Favorite Cuisine:</strong> {profile.favoriteCuisine}</p>
        <p><strong>Membership Level:</strong> {profile.membershipLevel}</p>
      </div>
    </div>
  );
};

export default MyProfile;
