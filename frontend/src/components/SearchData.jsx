import React, { useState } from 'react';

const SearchData = () => {
  const [station, setStation] = useState('');
  const [parameter, setParameter] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stationName, setStationName] = useState('');

  const handleSearch = () => {
    alert('Proses pencarian data');
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Pencarian Data</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Jenis Stasiun</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={station}
            onChange={(e) => setStation(e.target.value)}
          >
            <option value="UPT">UPT</option>
            <option value="UPT">Pilih</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">No/Nama Stasiun</label>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Masukkan No/Nama Stasiun"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Parameter</label>
          <div className="flex flex-wrap">
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Arah_angin_kecepatan_maksimum"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Arah angin saat kecepatan maksimum (ddd_x)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Arah_angin_terbanyak"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Arah angin terbanyak (ddd_car)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Curah_hujan"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Curah hujan (RR)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Kecepatan_angin_maksimum"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Kecepatan angin maksimum (ff_x)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Kecepatan_angin_rata_rata"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Kecepatan angin rata-rata (ff_avg)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Kelembapan_rata_rata"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Kelembapan rata-rata (RH_avg)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Lamanya_penyinaran_matahari"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Lamanya penyinaran matahari (ss)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Temperatur_maksimum"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Temperatur maksimum (Tx)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Temperatur_minimum"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Temperatur minimum (Tn)</span>
            </div>
            <div className="flex items-center w-full sm:w-1/2">
              <input
                type="checkbox"
                value="Temperatur_rata_rata"
                onChange={(e) => setParameter([...parameter, e.target.value])}
                className="mr-2"
              />
              <span>Temperatur rata-rata (Tavg)</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Rentang Waktu</label>
          <div className="flex">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded mr-2"
            />
            <span className="mx-2">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Proses
        </button>
      </div>
    </div>
  );
};

export default SearchData;
