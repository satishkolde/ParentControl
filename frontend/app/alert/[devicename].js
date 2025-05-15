// pages/alert/[devicename].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// import '.../app/globals.css';


export default function Alert() {
  const [alert, setAlert] = useState(null);
  const router = useRouter();
  const { devicename } = router.query;

  useEffect(() => {
    if (devicename) {
      const fetchAlert = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/device/${devicename}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAlert(data);
      };
      fetchAlert();
    }
  }, [devicename]);

  return (
    <div className="min-h-screen bg-black text-green-500 p-10">
      {alert ? (
        <div>
          <h2 className="text-2xl mb-4">{devicename} - Alert</h2>
          <p><strong>Text:</strong> {alert.text}</p>
          <p><strong>Context:</strong> {alert.context}</p>
          <p><strong>Sentiment:</strong> {alert.sentiment}</p>
          <p><strong>Risk:</strong> {alert.risk}</p>
        </div>
      ) : (
        <p>Loading alert...</p>
      )}
    </div>
  );
}
