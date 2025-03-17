const cors = require('cors'); // Import CORS middleware
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Import mongoose

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/ProjectBSIP_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Simulasi data pengguna
const users = [
  { username: 'Hasbul', password: 'password123' } 
];

// Schema untuk data iklim (sesuaikan dengan struktur data di MongoDB Anda)
const IklimSchema = new mongoose.Schema({
  TANGGAL: String,
  TN: Number,
  TX: Number,
  TAVG: Number,
  RH_AVG: Number,
  RR: Number,
  SS: Number,
  FF_X: Number,
  DDD_X: Number,
  FF_AVG: Number,
  DDD_CAR: String,
  ID_WMO: String,
  NAMA_STASIUN: String,
  LATITUDE: String,
  LONGITUDE: String,
  ELEVATION: String
});

const Iklim = mongoose.model('Iklim', IklimSchema); // Model untuk koleksi iklims

// Endpoint Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Mencari pengguna yang cocok
  const user = users.find((user) => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Login gagal! Username atau password salah.' });
  }

  const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });

  return res.json({ token });
});

// Endpoint Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Mengecek apakah pengguna sudah terdaftar
  const userExists = users.find((user) => user.username === username);
  
  if (userExists) {
    return res.status(400).json({ message: 'Username sudah digunakan!' });
  }

  // Menambahkan pengguna baru
  users.push({ username, password });

  return res.status(201).json({ message: 'Registrasi berhasil!' });
});

// Endpoint Get Data - Mengambil data dari MongoDB
app.get('/api/get-data', async (req, res) => {
  try {
    // Ambil data dari MongoDB, Anda bisa menyesuaikan dengan query tertentu
    const data = await Iklim.find(); // Mengambil semua data
    return res.json(data); // Mengirim data ke frontend
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Error fetching data from MongoDB' });
  }
});

app.listen(port, () => console.log(`App running on port ${port}`));
