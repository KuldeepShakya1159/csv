const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let isoDate = new Date().toISOString();
    isoDate = isoDate.replace(/:/g, "-").replace(/\./g, "-");
    cb(null, isoDate + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".csv") {
    return cb(new Error("Only .csv files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
const {
  handleCsvFiles,
  getImgProcessingStatus,
} = require("../controllers/ImgCompressJobController");

router.post("/upload", upload.single("csv-file"), handleCsvFiles);
router.get("/status/:requestId", getImgProcessingStatus);

module.exports = router;
