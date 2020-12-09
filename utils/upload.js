const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const multer = require('multer');

const { HOST } = process.env;

const fileDir = path.join(__dirname, '../static');

if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir);
}

const Upload = getFileName => name => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, fileDir),
    filename(req, file, cb) {
      const words = file.originalname.split('.');
      const filename = words.slice(0, -1).join('');
      const ext = words.slice(-1).join('');
      const result = getFileName(req, filename, ext);
      cb(null, result);
    },
  });
  const multerMW = multer({ storage }).single(name);
  const urlMW = (req, res, next) => {
    const url = lodash.get(req, 'file.path', '')
      .replace(fileDir, HOST);
    if (!url) return next();
    req.file.url = url;
    return next();
  };
  return [multerMW, urlMW];
};

module.exports = Upload;
