// pages/alert/[devicename].js
// "use client";  // This is required for using client-side hooks in Next.js 13+

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';  // Import Axios

// export default function Alert({params}) {
//   const [alerts, setAlerts] = useState(null);
//   const router = useRouter();
//   const [gdevicename,setDeviceName] = useState("");
//   useEffect(() => {
//     const fetchAlert = async () => {
//       const { devicename } = await params;
//       setDeviceName(devicename);
//       console.log(devicename)
//       if(!devicename){
//         return;
//       }
//       const token = localStorage.getItem('token');
//       try {
//         const response = await axios.get(`https://parentcontrolserver.onrender.com/device/${devicename}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAlerts(response.data);
//         // Set the alert data using response.data
//       } catch (error) {
//         console.error('Error fetching alert:', error);
//       }
//     };
//     fetchAlert();
//   }, []);

//   return (
//     <div classNameName="min-h-screen bg-black text-green-500 p-10">
//       {alerts && alerts.length > 0 ? (
//         alerts.map((alert, index) => (
//           <div key={index}>
//             <h2 classNameName="text-2xl mb-4">{gdevicename} - Alert {index + 1}</h2>
//             <p><strong>Text:</strong> {alert.text}</p>
//             <p><strong>Context:</strong> {alert.context}</p>
//             <p><strong>Sentiment:</strong> {alert.sentiment}</p>
//             <p><strong>Risk:</strong> {alert.risk}</p>
//           </div>
//         ))
//       ) : (
//         <p>Loading alert...</p>
//       )}
//     </div>
//   );
  
// }








    // <style>
    //     body {
    //         font-family: Consolas, monospace;
    //         margin: 0;
    //         padding: 0;
    //         background-color: #0D0D0D;
    //         color: #00FF00;
    //     }
    //     .navbar {
    //         background-color: #1A1A1A;
    //         padding: 15px 20px;
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //         color: #00FF00;
    //         border-bottom: 2px solid #00FF00;
    //     }
    //     .navbar button {
    //         background-color: transparent;
    //         border: 1px solid #00FF00;
    //         padding: 8px 16px;
    //         color: #00FF00;
    //         font-size: 14px;
    //         cursor: pointer;
    //         border-radius: 3px;
    //         transition: background-color 0.3s;
    //     }
    //     .navbar button:hover {
    //         background-color: #00FF00;
    //         color: #0D0D0D;
    //     }
    //     .content {
    //         padding: 20px;
    //         display: flex;
    //         flex-direction: column;
    //         align-items: center;
    //     }
    //     .device-info {
    //         font-size: 18px;
    //         margin-bottom: 20px;
    //         color: #00FF00;
    //     }
        // .tile {
        //     background-color: #1A1A1A;
        //     padding: 15px;
        //     margin-bottom: 15px;
        //     box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
        //     border: 1px solid #00FF00;
        //     border-radius: 8px;
        //     width: 80%;
        //     max-width: 800px;
        // }
        // .text {
        //     font-size: 16px;
        //     margin-bottom: 10px;
        //     color: #00FF00;
        //     width: 100%;
        // }
        // .details {
        //     display: flex;
        //     justify-content: space-between;
        //     align-items: stretch;
        //     width: 100%;
        //     gap: 15px;
        // }
        // .details .left {
        //     display: flex;
        //     flex-direction: column;
        //     gap: 10px;
        //     flex: 1.5;
        //     align-items: flex-start;
        //     border: none;
        // }
        // .block {
        //     background-color: transparent;
        //     padding: 10px;
        //     text-align: left;
        //     color: #00FF00;
        //     font-size: 16px; /* Restoring font size */
        // }
        // .details .right {
        //     flex: 1;
        //     display: flex;
        //     align-items: center;
        //     justify-content: center;
        //     background-color: rgba(0, 0, 0, 0.2);
        //     border: 1px solid #00FF00;
        //     border-radius: 5px;
        //     margin-left: 15px;
        //     animation: none;
        // }
    //     .right[data-risk="high"] {
    //         animation: blink-fast 0.5s infinite alternate;
    //     }
    //     .right[data-risk="medium"] {
    //         animation: blink-slow 1.5s infinite alternate;
    //     }
    //     @keyframes blink-fast {
    //         0% { background-color: rgba(0, 0, 0, 0.2); }
    //         100% { background-color: #00FF00; color: #000000; }
    //     }
    //     @keyframes blink-slow {
    //         0% { background-color: rgba(0, 0, 0, 0.2); }
    //         100% { background-color: #00FF00; color: #000000;}
    //     }
    //     .block {
    //         background-color: #1A1A1A;
    //         padding: 10px;
    //         /*border: 1px solid #00FF00;*/
    //         border-radius: 5px;
    //         text-align: center;
    //     }
    // </style>


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
        const response = await axios.get(`https://parentcontrolserver.onrender.com/device/${devicename}`, {
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
