const mongoose = require('mongoose');

const iklimSchema = new mongoose.Schema({
  tanggal: { type: Date, required: true },
  temperaturMax: { type: Number, required: true },
  temperaturMin: { type: Number, required: true },
  temperaturAvg: { type: Number, required: true },
  lamaPenyinaran: { type: Number, required: true },
  provinsi: { type: String, required: true },
  kota: { type: String, required: true },
  stasiun: { type: String, required: true },
});

module.exports = mongoose.model('Iklim', iklimSchema);
