const multer = require('multer');
const path = require('path');

const uploadBulk = multer({
  dest: 'uploads/bulk/',   // temp upload folder for bulk files
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max size
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', '.xls', '.xlsx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only .csv, .xls, .xlsx files allowed'));
    }
  }
});

module.exports = uploadBulk;
