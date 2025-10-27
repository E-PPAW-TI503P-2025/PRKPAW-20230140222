const { Presensi } = require("../models");

exports.getDailyReport = async (req, res) => {
  try {
    console.log("Controller: Mengambil data laporan harian dari database...");

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const records = await Presensi.findAll({
      where: {
        checkIn: {
          [require("sequelize").Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    res.json({
      reportDate: new Date().toLocaleDateString("id-ID"),
      data: records,
    });
  } catch (error) {
    console.error("Error mengambil laporan harian:", error);
    res.status(500).json({ message: "Gagal mengambil laporan harian" });
  }
};
