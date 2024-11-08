import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { UserLocation } from '../types';
import 'leaflet/dist/leaflet.css';
import { LogOut } from 'lucide-react';

interface DashboardProps {
  locations: UserLocation[];
  onLogout: () => void;
}

export function Dashboard({ locations, onLogout }: DashboardProps) {
  const lastLocation = locations[locations.length - 1];

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Location Dashboard</h1>
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Current Location</h3>
              <dl className="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lastLocation?.ip}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lastLocation?.city}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lastLocation?.country}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lastLocation?.timestamp).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Login History</h3>
              <div className="mt-4 max-h-[200px] overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {locations.slice().reverse().map((location, index) => (
                    <li key={index} className="py-3">
                      <p className="text-sm text-gray-600">
                        {new Date(location.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-900">
                        {location.city}, {location.country}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="h-[500px] relative">
            <MapContainer
              center={[lastLocation?.latitude || 0, lastLocation?.longitude || 0]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.latitude, location.longitude]}
                >
                  <Popup>
                    <div>
                      <p><strong>IP:</strong> {location.ip}</p>
                      <p><strong>Location:</strong> {location.city}, {location.country}</p>
                      <p><strong>Time:</strong> {new Date(location.timestamp).toLocaleString()}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </main>
    </div>
  );
}