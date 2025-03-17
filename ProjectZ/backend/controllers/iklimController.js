const Iklim = require("../models/iklimModel");
const multer = require("multer");
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const path = require("path");

// Konfigurasi multer untuk upload Excel
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./file"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

//Fungsi upload Excel
exports.uploadExcel = [
  upload.single("file"),
  async (req, res) => {
    try {
      const workbook = require("xlsx").readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = require("xlsx").utils.sheet_to_json(sheet);

      // Ambil informasi stasiun dari baris pertama
      const stationInfo = {
        ID_WMO: data[0]["ID_WMO"] || "",
        NAMA_STASIUN: data[0]["NAMA_STASIUN"] || "",
        LATITUDE: Number(data[0]["LATITUDE"]) || 0,
        LONGITUDE: Number(data[0]["LONGITUDE"]) || 0,
        ELEVATION: Number(data[0]["ELEVATION"]) || 0,
      };

      // Format data iklim
      const formattedData = data.map((row) => ({
        ...stationInfo, // Tambahkan informasi stasiun ke setiap baris
        TANGGAL: new Date(row["TANGGAL"]),
        TN: Number(row["TN"]) || null,
        TX: Number(row["TX"]) || null,
        TAVG: Number(row["TAVG"]) || null,
        RH_AVG: Number(row["RH_AVG"]) || null,
        RR: Number(row["RR"]) || null,
        SS: Number(row["SS"]) || null,
        FF_X: Number(row["FF_X"]) || null,
        DDD_X: row["DDD_X"] || null,
        FF_AVG: Number(row["FF_AVG"]) || null,
        DDD_CAR: row["DDD_CAR"] || null,
      }));

      await Iklim.insertMany(formattedData);
      res.status(200).json({ msg: "Upload berhasil" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

//Fungsi search data berdasarkan range tanggal dan nama stasiun
exports.searchData = async (req, res) => {
  try {
    const { startDate, endDate, stasiun } = req.query;
    let query = {};

    console.log("Search Params:", { startDate, endDate, stasiun });

    // Tampilkan beberapa data pertama untuk debug
    console.log("Sample Data in DB:");
    const sampleData = await Iklim.find().limit(1).lean();
    console.log(sampleData);

    // Debug log untuk request
    console.log("\n=== Search Request ===");
    console.log("Search Params:", { startDate, endDate, stasiun });

    // Cek data yang ada di database
    const totalDocs = await Iklim.countDocuments();
    console.log("\n=== Database Stats ===");
    console.log("Total documents:", totalDocs);

    // Cek stasiun yang tersedia
    const availableStations = await Iklim.distinct("NAMA_STASIUN");
    console.log("Available stations:", availableStations);

    // Build query
    if (stasiun) {
      // Tambahkan ":  " ke depan untuk mencocokkan format di database
      const searchPattern = stasiun;
      query.NAMA_STASIUN = {
        $regex: new RegExp(`:.*${searchPattern}`, "i"),
      };
      console.log("\n=== Station Filter ===");
      console.log("Searching for station:", stasiun);
      console.log("Search pattern:", query.NAMA_STASIUN.$regex);

      // Cek berapa dokumen untuk stasiun ini
      const stationCount = await Iklim.countDocuments(query);
      console.log("Documents for this station:", stationCount);
    }

    if (startDate && endDate) {
      const startDateTime = new Date(startDate + "T00:00:00.000Z");
      const endDateTime = new Date(endDate + "T23:59:59.999Z");
      query.TANGGAL = {
        $gte: startDateTime,
        $lte: endDateTime,
      };
      console.log("\n=== Date Filter ===");
      console.log("Date range:", { startDateTime, endDateTime });
    }

    console.log("MongoDB Query:", JSON.stringify(query, null, 2));

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Eksekusi query dengan logging
    const data = await Iklim.find(query).skip(skip).limit(limit).lean();
    console.log(`Found ${data.length} records`);

    // Total untuk pagination
    const total = await Iklim.countDocuments(query);
    console.log(`Total matching records: ${total}`);

    res.json({
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Fungsi Export Excel
exports.exportExcel = async (req, res) => {
  try {
    const ExcelJS = require("exceljs");
    let data = await Iklim.find();

    // Bersihkan format untuk export
    data = data.map((item) => ({
      ...item.toObject(),
      ID_WMO: item.ID_WMO.replace(/^:\s+/, ""),
      NAMA_STASIUN: item.NAMA_STASIUN.replace(/^:\s+/, ""),
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Iklim");

    worksheet.columns = [
      { header: "ID WMO", key: "ID_WMO" },
      { header: "Nama Stasiun", key: "NAMA_STASIUN" },
      { header: "Latitude", key: "LATITUDE" },
      { header: "Longitude", key: "LONGITUDE" },
      { header: "Elevation", key: "ELEVATION" },
      { header: "Tanggal", key: "TANGGAL" },
      { header: "Temperatur Min (°C)", key: "TN" },
      { header: "Temperatur Max (°C)", key: "TX" },
      { header: "Temperatur Avg (°C)", key: "TAVG" },
      { header: "Kelembaban Rata-rata (%)", key: "RH_AVG" },
      { header: "Curah Hujan (mm)", key: "RR" },
      { header: "Lama Penyinaran (jam)", key: "SS" },
      { header: "Kecepatan Angin Max (knot)", key: "FF_X" },
      { header: "Arah Angin saat Max", key: "DDD_X" },
      { header: "Kecepatan Angin Rata-rata (knot)", key: "FF_AVG" },
      { header: "Arah Angin Terbanyak", key: "DDD_CAR" },
    ];

    data.forEach((item) => worksheet.addRow(item));

    res.setHeader(
      "Content-Disposition",
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
    const PDFDocument = require("pdfkit");
    let data = await Iklim.find();

    // Bersihkan format untuk export
    data = data.map((item) => ({
      ...item.toObject(),
      ID_WMO: item.ID_WMO.replace(/^:\s+/, ""),
      NAMA_STASIUN: item.NAMA_STASIUN.replace(/^:\s+/, ""),
    }));

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="data-iklim.pdf"'
    );

    doc.pipe(res);

    doc.fontSize(18).text("Data Iklim BSIP", { align: "center" });
    doc.moveDown();

    data.forEach((item) => {
      doc.text(`ID WMO: ${item.ID_WMO}`);
      doc.text(`Nama Stasiun: ${item.NAMA_STASIUN}`);
      doc.text(`Lokasi: ${item.LATITUDE}°, ${item.LONGITUDE}°`);
      doc.text(`Ketinggian: ${item.ELEVATION} m`);
      doc.text(`Tanggal: ${new Date(item.TANGGAL).toLocaleDateString()}`);
      doc.text(`Temperatur Min: ${item.TN || "-"} °C`);
      doc.text(`Temperatur Max: ${item.TX || "-"} °C`);
      doc.text(`Temperatur Rata-rata: ${item.TAVG || "-"} °C`);
      doc.text(`Kelembaban Rata-rata: ${item.RH_AVG || "-"} %`);
      doc.text(`Curah Hujan: ${item.RR || "-"} mm`);
      doc.text(`Lama Penyinaran: ${item.SS || "-"} jam`);
      doc.text(`Kecepatan Angin Max: ${item.FF_X || "-"} knot`);
      doc.text(`Arah Angin saat Max: ${item.DDD_X || "-"}`);
      doc.text(`Kecepatan Angin Rata-rata: ${item.FF_AVG || "-"} knot`);
      doc.text(`Arah Angin Terbanyak: ${item.DDD_CAR || "-"}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
