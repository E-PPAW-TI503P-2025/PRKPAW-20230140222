import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReportsPage() {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchNama, setSearchNama] = useState('');
  const [searchTanggal, setSearchTanggal] = useState('');

  const fetchReports = async (nama = '', tanggal = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const params = {};
      if (nama) params.nama = nama;
      if (tanggal) params.tanggal = tanggal;

      const response = await axios.get('http://localhost:3001/api/reports/daily', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      });

      setReportData(response.data.data || []);
    } catch (err) {
      setError('Gagal mengambil laporan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [navigate]);

  const handleSearch = () => {
    fetchReports(searchNama, searchTanggal);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-500">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Halaman Reports (Admin Only)
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Laporan Presensi Harian
          </p>
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Laporan</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cari berdasarkan Nama</label>
              <input
                type="text"
                value={searchNama}
                onChange={(e) => setSearchNama(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama..."
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter berdasarkan Tanggal</label>
              <input
                type="date"
                value={searchTanggal}
                onChange={(e) => setSearchTanggal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cari
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Laporan</h2>

          {loading ? (
            <p className="text-center text-gray-600">Memuat data...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : reportData.length === 0 ? (
            <p className="text-center text-gray-600">Tidak ada data laporan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">User ID</th>
                    <th className="px-4 py-2 text-left">Check-In</th>
                    <th className="px-4 py-2 text-left">Check-Out</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.id}</td>
                      <td className="px-4 py-2">{item.userId}</td>
                      <td className="px-4 py-2">
                        {item.checkIn ? new Date(item.checkIn).toLocaleString() : 'Belum check-in'}
                      </td>
                      <td className="px-4 py-2">
                        {item.checkOut ? new Date(item.checkOut).toLocaleString() : 'Belum check-out'}
                      </td>
                      <td className="px-4 py-2">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
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

export default ReportsPage;
