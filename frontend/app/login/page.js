"use client"
// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('https://parentcontrolserver.onrender.com/users/login',{username:username,password:password});
    const data = await response.data;
    if (data.token) {
      localStorage.setItem('token', data.token);
      router.push('/device');
    } else {
      alert('Login failed!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-10 flex justify-center items-center box-border">
      <div className="flex flex-column max-w-md box-border">
        <h1 className="block text-4xl text-center mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className='box-border block'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className='box-border block'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
