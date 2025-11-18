import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari local storage
    navigate('/login'); // Arahkan kembali ke halaman login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-500">

      
      
      <div className="bg-white p-10 rounded-lg shadow-md text-center">        
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Login Sukses!
        </h1>

          <div className="flex justify-center mb-6">
        <div className="w-20 h-20 border-4 border-green-500 rounded-full flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
       
        <p className="text-lg text-gray-700 mb-8">
          Selamat Datang di Halaman Dashboard Anda.
        </p>

     
        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default DashboardPage;
