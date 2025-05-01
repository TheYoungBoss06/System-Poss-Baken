const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 8024 * 8024, // Tamaño máximo de archivo: 10 MB
  },
});




module.exports = upload;