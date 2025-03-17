
const Iklim = require('../models/iklimModel');
const multer = require('multer');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Konfigurasi multer untuk upload Excel
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

//Fungsi upload Excel 
exports.uploadExcel = [
  upload.single('file'),
  async (req, res) => {
    try {
      const workbook = require('xlsx').readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = require('xlsx').utils.sheet_to_json(sheet);

      const formattedData = data.map(row => ({
        tanggal: new Date(row['Tanggal']),
        temperaturMax: Number(row['Temperatur Maksimum (°C)']),
        temperaturMin: Number(row['Temperatur Minimum (°C)']),
        temperaturAvg: Number(row['Temperatur rata-rata']),
        lamaPenyinaran: Number(row['Lama Penyinaran Matahari (jam)']),
        provinsi: row['Provinsi'],
        kota: row['Kota'],
        stasiun: row['Stasiun'],
      }));

      await Iklim.insertMany(formattedData);
      res.status(200).json({ msg: 'Upload berhasil' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

//Fungsi search data berdasarkan range tanggal 
exports.searchData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await Iklim.find({
      tanggal: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Fungsi Export Excel 
exports.exportExcel = async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const data = await Iklim.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Iklim');

    worksheet.columns = [
      { header: 'Tanggal', key: 'tanggal' },
      { header: 'Temperatur Max (°C)', key: 'temperaturMax' },
      { header: 'Temperatur Min', key: 'temperaturMin' },
      { header: 'Temperatur Avg', key: 'temperaturAvg' },
      { header: 'Lama Penyinaran (Jam)', key: 'lamaPenyinaran' },
      { header: 'Provinsi', key: 'provinsi' },
      { header: 'Kota', key: 'kota' },
      { header: 'Stasiun', key: 'stasiun' },
    ];

    data.forEach(item => worksheet.addRow(item));

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="data-iklim.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi Export PDF 
exports.exportPDF = async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
    const data = await Iklim.find();

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="data-iklim.pdf"');

    doc.pipe(res);

    doc.fontSize(18).text('Data Iklim BSIP', { align: 'center' });
    doc.moveDown();

    data.forEach(item => {
      doc.text(`Tanggal: ${new Date(item.tanggal).toLocaleDateString()}`);
      doc.text(`Temperatur Max: ${item.temperaturMax} °C`);
      doc.text(`Temperatur Min: ${item.temperaturMin} °C`);
      doc.text(`Temperatur Avg: ${item.temperaturAvg} °C`);
      doc.text(`Lama Penyinaran: ${item.lamaPenyinaran} Jam`);
      doc.text(`Provinsi: ${item.provinsi}`);
      doc.text(`Kota: ${item.kota}`);
      doc.text(`Stasiun: ${item.stasiun}`);
      doc.moveDown();
    });

    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
