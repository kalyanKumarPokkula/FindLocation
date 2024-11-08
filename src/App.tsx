import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { User, UserLocation } from './types';
import './App.css';

async function getLocationData(): Promise<UserLocation> {
  const ipResponse = await fetch('https://api.ipify.org?format=json');
  const { ip } = await ipResponse.json();
  
  const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
  const locationData = await locationResponse.json();
  
  return {
    ip,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    city: locationData.city,
    country: locationData.country_name,
    timestamp: new Date().toISOString()
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const locationData = await getLocationData();
      
      // In a real app, you would validate credentials against a backend
      const newUser: User = {
        email,
        password,
        locations: [locationData]
      };

      // Check if user exists
      const existingUserJson = localStorage.getItem('user');
      if (existingUserJson) {
        const existingUser: User = JSON.parse(existingUserJson);
        if (existingUser.email === email) {
          if (existingUser.password !== password) {
            setError('Invalid password');
            return;
          }
          // Add new location to existing user
          existingUser.locations.push(locationData);
          localStorage.setItem('user', JSON.stringify(existingUser));
          setUser(existingUser);
          return;
        }
      }

      // Create new user
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setError(undefined);
    } catch (err) {
      setError('Failed to get location data');
      console.error(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <Dashboard
          locations={user.locations}
          onLogout={handleLogout}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <LoginForm onLogin={handleLogin} error={error} />
        </div>
      )}
    </div>
  );
}

export default App;