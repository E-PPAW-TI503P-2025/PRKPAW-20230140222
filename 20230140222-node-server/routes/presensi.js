const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { CheckIn, CheckOut } = require("../controllers/presensiController");

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now();
    cb(null, `${req.body.userId}-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/checkin", upload.single("buktiFoto"), CheckIn);
router.post("/checkout", CheckOut);

module.exports = router;
