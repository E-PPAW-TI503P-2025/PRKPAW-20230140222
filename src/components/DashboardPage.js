import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DashboardPage() {
  const navigate = useNavigate();
  const [presensiData, setPresensiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresensiData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3001/api/presensi', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPresensiData(response.data.data);
      } catch (err) {
        setError('Gagal mengambil data presensi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPresensiData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari local storage
    navigate('/login'); // Arahkan kembali ke halaman login
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-500">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Dashboard Presensi Mahasiswa
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Selamat Datang di Halaman Dashboard Anda.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/presensi')}
              className="py-2 px-6 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Lakukan Presensi
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lihat Reports
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Presensi Mahasiswa</h2>

          {loading ? (
            <p className="text-center text-gray-600">Memuat data...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : presensiData.length === 0 ? (
            <p className="text-center text-gray-600">Belum ada data presensi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Check-In</th>
                    <th className="px-4 py-2 text-left">Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {presensiData.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.user?.nama || 'N/A'}</td>
                      <td className="px-4 py-2">{item.user?.email || 'N/A'}</td>
                      <td className="px-4 py-2">
                        {item.checkIn ? new Date(item.checkIn).toLocaleString() : 'Belum check-in'}
                      </td>
                      <td className="px-4 py-2">
                        {item.checkOut ? new Date(item.checkOut).toLocaleString() : 'Belum check-out'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
