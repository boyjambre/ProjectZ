import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import SearchData from './components/SearchData';
import DataTable from './components/DataTable';  // Import DataTable component

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Header - Logo dan Teks */}
        <header className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white p-6 flex items-center justify-center">
          <img
            src="/logo-bsip.png" // Pastikan logo disimpan di folder public dengan nama logo-bsip.png
            alt="BSIP Logo"
            className="w-10 h-10 mr-4" // Ukuran logo
          />
          <div className="text-3xl font-bold">Database Project BSIP</div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row">
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchData />} /> {/* Route ke halaman Search Data */}
              <Route path="/data" element={<DataTable />} /> {/* Route ke halaman DataTable */}
              
              {/* Default route menuju halaman login jika belum login */}
              <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center p-4 mt-4">
          <span>Balai Pengujian Standar Instrumen Agroklimat dan Hidrologi Pertanian</span>
        </footer>
      </div>
    </Router>
  );
}
