const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/uploads");
  },
  filename: (req, file, callback) => {
    const date = new Date().toJSON().slice(0, 10);
    const uniquePrefix = date + "_" + Math.round(Math.random() * 1e9);
    callback(null, uniquePrefix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      return callback(
        new Error("Only .png, .jpg and .jpeg format allowed!", false)
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = upload;
