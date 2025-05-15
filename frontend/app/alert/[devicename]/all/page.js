"use client";  // This is required for using client-side hooks in Next.js 13+

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';  // Import Axios

export default function Alert({params}) {
  const [alerts, setAlerts] = useState(null);
  const router = useRouter();
  const [gdevicename,setDeviceName] = useState("");
  useEffect(() => {
    const fetchAlert = async () => {
      const { devicename } = await params;
      setDeviceName(devicename);
      console.log(devicename)
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
    <>
    <h1>{gdevicename}</h1>
    <div className="min-h-screen bg-black text-green-500 p-10 divrow">
      {alerts && alerts.length > 0 ? (
  alerts.map((alert, index) => (
    <div className="grid1 flex-1" key={index}>
        <div className="tile1">
            <div className="text1">{alert.text}</div>
            <div className="details1">
                <div className="left1">
                    <div className="block1"><strong>Context:</strong> <span>{alert.context}</span></div>
                    <div className="block1"><strong>Sentiment:</strong> <span>{alert.sentiment}</span></div>
                </div>
                <div className="right1" data-risk="high"><span>{alert.risk}</span></div>
            </div>
        </div>
    </div>
    
  ))
) : (
  <p>Loading alert...</p>
)}
    </div>
    </>
  );
  
}