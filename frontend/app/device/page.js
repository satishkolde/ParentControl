"use client"
// pages/devices.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/device/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDevices(data);
    };
    fetchDevices();
  }, []);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/device/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ devicename: newDevice }),
    });
    if (response.ok) {
      setNewDevice('');
      alert('Device added successfully!');
      // Reload the device list after adding a new device
      const updatedDevices = await response.json();
      setDevices(updatedDevices);
    } else {
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
          />
          <button type="submit">Add Device</button>
        </form>

        {/* List of devices */}
        <div className="text-center">
          <h2 className="text-2xl mb-4">Your Devices</h2>
          <ul className="space-y-2">
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <li
                  key={index}
                  onClick={() => router.push(`/alert/${device}`)}
                  className="cursor-pointer hover:text-green-300"
                >
                  {device}
                </li>
              ))
            ) : (
              <p>No devices found. Add a device to get started.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
