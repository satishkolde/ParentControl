// pages/text/[devicename].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// import '.../app/globals.css';


export default function Text() {
  const [texts, setTexts] = useState([]);
  const router = useRouter();
  const { devicename } = router.query;

  useEffect(() => {
    if (devicename) {
      const fetchTexts = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/device/${devicename}/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTexts(data);
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
