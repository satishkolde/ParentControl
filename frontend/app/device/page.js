// pages/devices.js
"use client";  // This is required for using client-side hooks in Next.js 13+

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState('');
  const [token, setToken] = useState(null);  // State to store the token
  const router = useRouter();

  // Fetch devices when the component mounts and the token is available
  useEffect(() => {
    // Ensure localStorage is accessed only on the client
    if (typeof window !== 'undefined') {
      const tokenFromLocalStorage = localStorage.getItem('token');
      setToken(tokenFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchDevices = async () => {
        try {
          const response = await axios.get('https://parentcontrolserver.onrender.com/device/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data.devices);
          setDevices(response.data.devices);
        } catch (error) {
          console.error('Error fetching devices:', error);
        }
      };
      fetchDevices();
    }
  }, [token]);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        'https://parentcontrolserver.onrender.com/device/',
        { devicename: newDevice },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setNewDevice('');
        alert('Device added successfully!');
        // Reload the device list after adding a new device
        const updatedDevices = await axios.get('https://parentcontrolserver.onrender.com/device/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevices(updatedDevices.data);
      } else {
        alert('Failed to add device');
      }
    } catch (error) {
      console.error('Error adding device:', error);
      alert('Failed to add device');
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-10 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl text-center mb-8">Devices</h1>

        {/* Form to add a new device */}
        <form onSubmit={handleAddDevice} className="space-y-4 mb-8">
          <input
            type="text"
            value={newDevice}
            onChange={(e) => setNewDevice(e.target.value)}
            placeholder="Enter Device Name"
            className="p-2 w-full border border-green-500 bg-transparent text-green-500"
          />
          <button type="submit" className="w-full p-2 bg-transparent border border-green-500 text-green-500">
            Add Device
          </button>
        </form>

        {/* List of devices */}
        <div className="text-center max-w-2xl mx-auto mt-10">
          <h2 className="text-3xl font-semibold mb-6 text-white">Your Devices</h2>

          {devices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices.map((device, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/alert/${device.device_name}`)}
                  className="bg-gray-800 hover:bg-green-700 transition-all duration-300 p-4 rounded-2xl shadow-md cursor-pointer border border-gray-700 hover:shadow-lg"
                >
                  <p className="text-white font-medium text-lg">{device.device_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-4">No devices found. Add a device to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
