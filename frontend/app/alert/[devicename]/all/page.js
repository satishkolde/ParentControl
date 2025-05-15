// pages/alert/[devicename].js
"use client";  // This is required for using client-side hooks in Next.js 13+

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';  // Import Axios

export default function Alert({params}) {
  const [alerts, setAlerts] = useState(null);
  const router = useRouter();
  const [devicename,setDeviceName] = useState("");
  useEffect(() => {
    const fetchAlert = async () => {
      const { temp_devicename } = await params;
      setDeviceName(temp_devicename);
      if(!devicename){
        return;
      }
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`https://parentcontrolserver.onrender.com/device/${devicename}/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlerts(response.data);
        // Set the alert data using response.data
      } catch (error) {
        console.error('Error fetching alert:', error);
      }
    };
    fetchAlert();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 p-10">
      {alerts && alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div key={index}>
            <h2 className="text-2xl mb-4">{devicename} - Alert {index + 1}</h2>
            <p><strong>Text:</strong> {alert.text}</p>
            <p><strong>Context:</strong> {alert.context}</p>
            <p><strong>Sentiment:</strong> {alert.sentiment}</p>
            <p><strong>Risk:</strong> {alert.risk}</p>
          </div>
        ))
      ) : (
        <p>Loading all...</p>
      )}
    </div>
  );
  
}
