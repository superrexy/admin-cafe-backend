const fs = require("fs");

const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = deleteFile;
