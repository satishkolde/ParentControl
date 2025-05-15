// app/page.js
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-green-500 p-10 flex items-center justify-center">
      <div className="text-center max-w-lg w-full">
        <h1 className="text-4xl mb-4">Welcome to the Parental Control System</h1>
        <p className="text-xl mb-8">Please choose an option to get started:</p>
        <div className="flex flex-row justify-end gap-4 w-100">
          <Link href="/register" className='block'>
            <button className="p-4 bg-transparent border-2 border-green-600 text-green-500 text-xl font-semibold rounded-md hover:bg-green-500 hover:text-black transition duration-300">
              Register User
            </button>
          </Link>
          <Link href="/login" className='block'>
            <button className="p-4 bg-transparent border-2 border-green-700 text-green-500 text-xl font-semibold rounded-md hover:bg-green-500 hover:text-black transition duration-300">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
