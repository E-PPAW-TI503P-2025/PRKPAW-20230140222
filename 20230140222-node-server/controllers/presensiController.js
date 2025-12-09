// controllers/presensiController.js
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// ======================= CHECK ACTIVE CHECK-IN =======================
exports.checkActiveCheckIn = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const activeRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (activeRecord) {
      res.json({
        message: "Anda sedang dalam status check-in aktif.",
        isActive: true,
        checkInTime: format(activeRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      });
    } else {
      res.json({
        message: "Anda tidak sedang dalam status check-in aktif.",
        isActive: false,
      });
    }
  } catch (error) {
    console.error("Error checkActiveCheckIn:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// ======================= GET ALL PRESENSI =======================
exports.getAllPresensi = async (req, res) => {
  try {
    const presensiRecords = await Presensi.findAll({
      include: [{
        model: require('../models').User,
        as: 'user',
        attributes: ['nama', 'email']
      }],
      order: [['createdAt', 'DESC']],
    });

    const formattedData = presensiRecords.map(record => ({
      id: record.id,
      userId: record.userId,
      user: {
        nama: record.user?.nama || 'N/A',
        email: record.user?.email || 'N/A'
      },
      checkIn: record.checkIn ? format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
      checkOut: record.checkOut ? format(record.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }) : null,
      createdAt: format(record.createdAt, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      updatedAt: format(record.updatedAt, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    }));

    res.json({
      message: "Data presensi berhasil diambil",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error getAllPresensi:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// ======================= CHECK-IN =======================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body; // Ambil data lokasi dari body request

    const buktiFoto = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // Cek apakah user sudah check-in dan belum check-out
    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // Buat data baru di database
    const newRecord = await Presensi.create({
      userId,
      nama: userName,
      checkIn: waktuSekarang,
      latitude: latitude,
      longitude: longitude,
      buktiFoto: buktiFoto
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error CheckIn:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ======================= CHECK-OUT =======================
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body; // Ambil data lokasi dari body request

    // Cari data check-in aktif user
    const recordToUpdate = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // Update check-out dan lokasi jika disediakan
    recordToUpdate.checkOut = waktuSekarang;
    if (latitude !== undefined) recordToUpdate.latitude = latitude;
    if (longitude !== undefined) recordToUpdate.longitude = longitude;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: recordToUpdate.nama,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error CheckOut:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ======================= DELETE PRESENSI =======================
exports.deletePresensi = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Presensi.destroy({
      where: { id: id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Data presensi tidak ditemukan" });
    }

    res.status(200).json({ message: "Data presensi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus data presensi",
      error: error.message,
    });
  }
};


// ======================= UPDATE PRESENSI =======================
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message: "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
