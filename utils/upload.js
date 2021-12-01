const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const {
  HOST,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_BASE_URL,
} = process.env;

const fileDir = path.join(__dirname, '../static');

const init = () => {
  if (fs.existsSync(fileDir)) {
    fs.rmdirSync(fileDir, { recursive: true, force: true });
  }
  fs.mkdirSync(fileDir);
  return true;
};

// init();

const upload = () => {
  const awsCredentials = new aws.Credentials({
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: AWS_S3_ACCESS_SECRET_ACCESS_KEY,
  });

  const s3 = new aws.S3({
    region: 'ap-northeast-2',
    credentials: awsCredentials,
  });

  const storage = multerS3({
    bucket: 'multertest',
    s3,
    key(req, file, cb) {
      const ext = encodeURIComponent(file.originalname).split('.').slice(-1).join('');
      return cb(null, `${Date.now()}.${ext}`);
    },
  });

  const multerMW = multer({ storage }).single('file');
  const urlMW = (req, res, next) => {
    try {
      console.log('~~!!!');
      const url = `${AWS_S3_BUCKET_BASE_URL}/${req.file.key}`;
      if (!url) return next();
      req.file.url = url;
      return next();
    } catch (err) {
      next(err);
    }
  };
  return [multerMW, urlMW];
};

module.exports = upload;
