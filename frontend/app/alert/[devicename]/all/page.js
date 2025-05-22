"use client";  // This is required for using client-side hooks in Next.js 13+

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';  // Import Axios
import ListTable from '../ListTable';
import AlertTable from '../AlertTable'
import IndexNavbar from '@/app/Navbars/IndexNavbar'

export default function Alert({params}) {
  const [alerts, setAlerts] = useState(null);
  const [tableData,setTableData] = useState([]);
  const [tableDataPresent,setTableDataPresent] = useState(false);
  const router = useRouter();
  const [gdevicename,setDeviceName] = useState("");
  useEffect(() => {
    const fetchAlert = async () => {
      const { devicename } = await params;
      setDeviceName(devicename);
      console.log("Device name:", devicename);

      if (!devicename) return;

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`https://parentcontrolserver.onrender.com/device/${devicename}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAlerts(response.data);

        let context = {};
        let sentiment = {};
        let risk = {};

        response.data.forEach(element => {
          context[element.context] = (context[element.context] || 0) + 1;
          sentiment[element.sentiment] = (sentiment[element.sentiment] || 0) + 1;
          risk[element.risk] = (risk[element.risk] || 0) + 1;
        });

        const sentimentContent = Object.entries(sentiment).map(([title, count]) => ({ title, count }));
        const contextContent = Object.entries(context).map(([title, count]) => ({ title, count }));
        const riskContent = Object.entries(risk).map(([title, count]) => ({ title, count }));

        const tableDetails = [
          { tableTitle: "Sentiment", totalCount: response.data.length, tableContent: sentimentContent },
          { tableTitle: "Context", totalCount: response.data.length, tableContent: contextContent },
          { tableTitle: "Risk", totalCount: response.data.length, tableContent: riskContent },
        ];
        const deepClone = JSON.parse(JSON.stringify(tableDetails));
        setTableData(deepClone);
      } catch (error) {
        console.error('Error fetching alert:', error);
      }
    };

    fetchAlert();
}, []);

useEffect(() => {
  console.log("Updated tableData:", tableData);
  setTableDataPresent(true);
}, [tableData]);

  return (
    <>
    <IndexNavbar fixed />
    <div className="w-full min-h-screen bg-white text-black p-10 mt-[80px] flex flex-row" style={{"gap":"16px"}}>
      {/* Left Column: Alert Table */}
      <div className='w-full'>
        <AlertTable device_name={gdevicename} alerts={alerts} />
      </div>

      {/* Right Column: List Tables stacked vertically */}
      <div className="flex flex-col gap-4">
        {tableDataPresent ? (
          tableData.map((row, index) => (
            <ListTable
              key={index}
              tableTitle={row.tableTitle}
              tableContent={row.tableContent}
              totalCount={row.totalCount}
            />
          ))
        ) : (
          <p>Loading alert...</p>
        )}
      </div>
    </div>
    </>
  );
  
}
