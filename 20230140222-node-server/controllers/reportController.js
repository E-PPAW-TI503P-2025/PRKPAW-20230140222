const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggal, startDate, endDate, bulan } = req.query;
    let options = { where: {} };

    // Filter nama
    if (nama) {
      options.where.nama = { [Op.like]: `%${nama}%` };
    }

    // Filter tanggal (checkIn)
    if (tanggal) {
      // validasi format tanggal
      const validDate = /^\d{4}-\d{2}-\d{2}$/;
      if (!validDate.test(tanggal)) {
        return res.status(400).json({
          message: "Format tanggal tidak valid, gunakan format YYYY-MM-DD",
        });
      }

      // cari data di tanggal tersebut (antara 00:00 sampai 23:59)
      const start = new Date(tanggal);
      const end = new Date(tanggal);
      end.setHours(23, 59, 59, 999);

      options.where.checkIn = {
        [Op.between]: [start, end],
      };
    }

    // Filter antar tanggal
    if (startDate && endDate) {
      const validStart = /^\d{4}-\d{2}-\d{2}$/;
      const validEnd = /^\d{4}-\d{2}-\d{2}$/;
      if (!validStart.test(startDate) || !validEnd.test(endDate)) {
        return res.status(400).json({
          message: "Format tanggal tidak valid, gunakan format YYYY-MM-DD",
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      options.where.checkIn = {
        [Op.between]: [start, end],
      };
    }

    // Filter bulan
    if (bulan) {
      const validMonth = /^\d{4}-\d{2}$/;
      if (!validMonth.test(bulan)) {
        return res.status(400).json({
          message: "Format bulan tidak valid, gunakan format YYYY-MM",
        });
      }

      const [year, month] = bulan.split('-');
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);

      options.where.checkIn = {
        [Op.between]: [start, end],
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
