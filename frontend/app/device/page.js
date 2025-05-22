// // pages/devices.js
// "use client";  // This is required for using client-side hooks in Next.js 13+

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function Devices() {
//   const [devices, setDevices] = useState([]);
//   const [newDevice, setNewDevice] = useState('');
//   const [token, setToken] = useState(null);  // State to store the token
//   const router = useRouter();

//   // Fetch devices when the component mounts and the token is available
//   useEffect(() => {
//     // Ensure localStorage is accessed only on the client
//     if (typeof window !== 'undefined') {
//       const tokenFromLocalStorage = localStorage.getItem('token');
//       setToken(tokenFromLocalStorage);
//     }
//   }, []);

//   useEffect(() => {
//     if (token) {
//       const fetchDevices = async () => {
//         try {
//           const response = await axios.get('https://parentcontrolserver.onrender.com/device/', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           console.log(response.data.devices);
//           setDevices(response.data.devices);
//         } catch (error) {
//           console.error('Error fetching devices:', error);
//         }
//       };
//       fetchDevices();
//     }
//   }, [token]);

//   const handleAddDevice = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       alert('No token found. Please log in again.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'https://parentcontrolserver.onrender.com/device/',
//         { devicename: newDevice },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.status === 201) {
//         setNewDevice('');
//         alert('Device added successfully!');
//         // Reload the device list after adding a new device
//         const updatedDevices = await axios.get('https://parentcontrolserver.onrender.com/device/', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setDevices(updatedDevices.data);
//       } else {
//         alert('Failed to add device');
//       }
//     } catch (error) {
//       console.error('Error adding device:', error);
//       alert('Failed to add device');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-green-500 py-10 px-5 sm:px-10 flex justify-center items-start">
//       <div className="w-full max-w-6xl">
//         <h1 className="text-4xl text-center mb-12 text-white font-bold">Your Devices</h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

//           {/* Add Device Card */}
//           <div className="bg-gray-900 border-2 border-dashed border-green-500 p-6 rounded-2xl flex flex-col justify-center items-center text-center hover:shadow-green-400 transition-all">
//             <form onSubmit={handleAddDevice} className="w-full">
//               <input
//                 type="text"
//                 value={newDevice}
//                 onChange={(e) => setNewDevice(e.target.value)}
//                 placeholder="New Device Name"
//                 className="mb-4 w-full p-2 rounded bg-transparent border border-green-500 text-green-400 placeholder-green-600 focus:outline-none"
//               />
//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-bold transition"
//               >
//                 + Add Device
//               </button>
//             </form>
//           </div>

//           {/* Device Cards */}
//           {devices.map((device, index) => (
//             <div
//               key={index}
//               onClick={() => router.push(`/alert/${device.device_name}`)}
//               className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:shadow-lg hover:bg-green-800 cursor-pointer transition-all"
//             >
//               <p className="text-lg font-semibold text-white mb-2">{device.device_name}</p>
//               <p className="text-sm text-gray-400">Click for alerts</p>
//             </div>
//           ))}
//         </div>

//         {devices.length === 0 && (
//           <p className="text-center text-gray-500 mt-8">No devices found. Add a device to get started.</p>
//         )}
//       </div>
//     </div>
//   );

// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IndexNavbar from "@/app/Navbars/IndexNavbar"
import axios from "axios";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [devicesAlertCount,setDeviceAlertCount] = useState({});
  const [newDevice, setNewDevice] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenFromLocalStorage = localStorage.getItem("token");
      setToken(tokenFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchDevices = async () => {
        try {
          const response = await axios.get(
            "https://parentcontrolserver.onrender.com/device/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setDevices(response.data.devices || []);
          let responseCount = await axios.post(
            "https://parentcontrolserver.onrender.com/device/count",{},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          let alertCount = {};
          responseCount.data.device.forEach((elem) => {
            alertCount[elem.name] = elem.totalAlerts;
          })
          setDeviceAlertCount(alertCount);
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      };
      fetchDevices();
    }
  }, [token]);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!token) return alert("No token found. Please log in again.");

    try {
      const response = await axios.post(
        "https://parentcontrolserver.onrender.com/device/",
        { devicename: newDevice },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setNewDevice("");
        alert("Device added successfully!");
        const updatedDevices = await axios.get(
          "https://parentcontrolserver.onrender.com/device/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDevices(updatedDevices.data.devices || []);
      } else {
        alert("Failed to add device");
      }
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device");
    }
  };

  return (
    <>
    <IndexNavbar fixed />
    <div className="min-h-screen mt-[80px] text-gray-900 p-10 flex justify-center">
      {/* Container to restrict width */}
      <div className="w-full max-w-[1200px]">
        {/* Add Device Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl text-center font-semibold mb-4">ADD DEVICE</h2>
          <form
            onSubmit={handleAddDevice}
            className="flex flex-col items-center space-y-4"
          >
            <label className="w-full text-center text-gray-600 font-semibold">
              Device Name
            </label>
            <input
              type="text"
              value={newDevice}
              onChange={(e) => setNewDevice(e.target.value)}
              placeholder="Copy from your device"
              className="w-1/4 min-w-[250px] p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-[#0288D1] text-white font-bold px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              ADD
            </button>
          </form>
        </div>
  
        {/* Devices Grid */}
        <div className="flex flex-col gap-10">
          {devices.length > 0 ? (
            [...Array(Math.ceil(devices.length / 4))].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex justify-between gap-6"
                style={{ width: "100%" }}
              >
                {devices
                  .slice(rowIndex * 4, rowIndex * 4 + 4)
                  .map((device, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(`/alert/${device.device_name}`)}
                      className="flex flex-col justify-center items-center w-1/4 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-400"
                    >
                      <p className="text-lg font-semibold text-gray-800 text-center mb-2">
                        {device.device_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Alerts: {devicesAlertCount[device.device_name] ?? 0}
                      </p>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <p className="text-white text-center">
              No devices found. Add a device to get started.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
  
}
