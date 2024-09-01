const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid").v4;
const https = require("https");
const {compressImage} = require('../services/processImages')

// Mock database to track request statuses
const requestDb = {};

// Helper function to validate URL format
const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

// Helper function to validate CSV row
const validateRow = (row) => {
  const errors = [];
  if (!row["Serial Number"] || isNaN(row["Serial Number"])) {
    errors.push("Invalid Serial Number");
  }
  if (!row["Product Name"]) {
    errors.push("Missing Product Name");
  }
  if (!row["Input Image Urls"]) {
    errors.push("Missing Input Image Urls");
  } else {
    const urls = row["Input Image Urls"].split(",");
    for (const urlStr of urls) {
      if (!isValidUrl(urlStr.trim())) {
        errors.push(`Invalid URL: ${urlStr}`);
      }
    }
  }
  return errors;
};

// Function to process images asynchronously
const processImages = (requestId, filePath) => {
  const outputDir = path.join(__dirname, "../outputCompressedImage");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const errors = validateRow(row);
      if (errors.length > 0) {
        requestDb[requestId].status = "error";
        requestDb[requestId].message = `CSV validation failed: ${errors.join(", ")}`;
        return;
      } else {
        const urls = row["Input Image Urls"].split(",").map((url) => url.trim());
        urls.forEach((url) => {
          const imageName = path.basename(url);
          const destination = path.join(__dirname, "../downloads", imageName);
          const outputImagePath = path.join(outputDir, imageName);

          const file = fs.createWriteStream(destination);

          https.get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
              // Call your compressImage function here
              compressImage(destination, outputImagePath);
              file.close(() => {
                console.log("File downloaded and processed successfully");
              });
            }).on("error", (err) => {
              fs.unlink(destination, () => {
                console.error("Error downloading file:", err);
              });
            });
          });
        });
      }
    })
    .on("end", () => {
      requestDb[requestId].status = "completed";
    })
    .on("error", (err) => {
      requestDb[requestId].status = "error";
      requestDb[requestId].message = `Error processing CSV: ${err.message}`;
    });
};

// API to handle CSV uploads
const handleCsvFiles = (req, res) => {
  try {
    console.log("--- Inside handleCSVFiles API ---");
    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const requestId = uuid();

    // Store initial request status
    requestDb[requestId] = { status: "processing", filePath };

    // Send request ID immediately
    res.send({ status: true, requestId });

    // Process images asynchronously
    processImages(requestId, filePath);

  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      result: `Error occurred while handling compress job: ${error.message}`,
    });
  }
};

// API to get processing status
const getImgProcessingStatus = (req, res) => {
  const { requestId } = req.params;

  if (!requestDb[requestId]) {
    return res.status(404).json({ status: false, message: "Request ID not found" });
  }

  return res.json({ status: true, data: requestDb[requestId] });
};

module.exports = { handleCsvFiles, getImgProcessingStatus };
