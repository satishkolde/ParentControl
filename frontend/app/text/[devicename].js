// pages/text/[devicename].js
"use client";  // This is required for using client-side hooks in Next.js 13+

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';  // Import Axios

export default function Text() {
  const [texts, setTexts] = useState([]);
  const router = useRouter();
  const { devicename } = router.query;

  useEffect(() => {
    if (devicename) {
      const fetchTexts = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`https://parentcontrolserver.onrender.com/device/${devicename}/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTexts(response.data);  // Set the texts data using response.data
        } catch (error) {
          console.error('Error fetching texts:', error);
        }
      };
      fetchTexts();
    }
  }, [devicename]);

  return (
    <div className="min-h-screen bg-black text-green-500 p-10">
      <h2 className="text-2xl mb-4">Texts for {devicename}</h2>
      <ul className="space-y-2">
        {texts.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>
    </div>
  );
}
