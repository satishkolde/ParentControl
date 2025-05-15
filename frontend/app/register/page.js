"use client"
// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('https://parentcontrolserver.onrender.com/users/register',{username:username,password:password});
      const data = await response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/device');
      } else {
        alert('Registration failed!');
      }
    }catch(err){
      console.log(err);
    }
    
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-10 flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl text-center mb-8">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
