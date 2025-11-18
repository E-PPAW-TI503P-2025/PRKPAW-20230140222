import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-b from-[#050229] to-[#001b44]">

      <div className="bg-gradient-to-b from-purple-700 to-purple-900 
        p-12 rounded-3xl shadow-2xl w-full max-w-lg relative">

        {/* ICON PROFILE */}
        <div className="w-32 h-32 rounded-full bg-white/20 border border-white/40
          flex items-center justify-center mx-auto mb-6">
          <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5.121 17.804A8 8 0 0112 15a8 8 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-4xl font-bold text-white tracking-wide mb-10">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-white text-sm font-medium">Email</label>
            <div className="flex items-center mt-2 border-b border-white/40 pb-2">
              <svg className="w-6 h-6 text-white/80 mr-3" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-indigo-200 bg-indigo-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm font-medium">Password</label>
            <div className="flex items-center mt-2 border-b border-white/40 pb-2">
              <svg className="w-6 h-6 text-white/80 mr-3" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 15v2m0 4a2 2 0 01-2-2v-4a2 2 0 014 0v4a2 2 0 01-2 2zm0-6V9a4 4 0 018 0v2" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-indigo-200 bg-indigo-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Button Login */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-800 font-bold text-lg rounded-full mt-6
            hover:bg-gray-200 transition"
          >
            LOGIN
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <p className="text-red-300 text-center mt-4">{error}</p>
        )}

        {/* REGISTER LINK */}
        <p className="text-center text-white mt-6">
          Belum punya akun?{" "}
          <a href="/register" className="text-yellow-300 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>

    </div>
  );
}

export default LoginPage;
